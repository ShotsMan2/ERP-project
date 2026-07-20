from __future__ import annotations

from functools import wraps
from typing import Any, Callable

from fastapi import HTTPException, status
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession


class PermissionChecker:
    def __init__(self, db: AsyncSession, current_user: dict) -> None:
        self.db = db
        self.current_user = current_user

    async def has_permission(self, module: str, action: str) -> bool:
        user_id = self.current_user.get("sub")
        company_id = self.current_user.get("company_id")
        if not user_id:
            return False
        is_super = self.current_user.get("is_super_admin", False)
        if is_super:
            return True
        query = text("""
            SELECT EXISTS (
                SELECT 1 FROM user_roles ur
                JOIN role_permissions rp ON rp.role_id = ur.role_id
                JOIN permissions p ON p.id = rp.permission_id
                WHERE ur.user_id = :user_id
                AND ur.company_id = :company_id
                AND p.code = :permission_code
            )
        """)
        permission_code = f"{module}.{action}"
        result = await self.db.execute(
            query,
            {"user_id": user_id, "company_id": company_id, "permission_code": permission_code},
        )
        row = result.scalar()
        return bool(row)

    async def has_any_permission(self, *permissions: tuple[str, str]) -> bool:
        for module, action in permissions:
            if await self.has_permission(module, action):
                return True
        return False

    async def has_all_permissions(self, *permissions: tuple[str, str]) -> bool:
        for module, action in permissions:
            if not await self.has_permission(module, action):
                return False
        return True


async def has_permission(db: AsyncSession, user: dict, module: str, action: str) -> bool:
    checker = PermissionChecker(db, user)
    return await checker.has_permission(module, action)


def require_permission(module: str, action: str) -> Callable[..., Any]:
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            db = kwargs.get("db")
            current_user = kwargs.get("current_user")
            if db is None or current_user is None:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Permission check requires db and current_user",
                )
            checker = PermissionChecker(db, current_user)
            if not await checker.has_permission(module, action):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Missing permission: {module}.{action}",
                )
            return await func(*args, **kwargs)
        return wrapper
    return decorator
