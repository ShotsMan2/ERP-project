import uuid
from typing import Optional

from sqlalchemy import select, delete, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.roles.models import Role, Permission, RolePermission, UserRole


class RoleRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, role_id: uuid.UUID) -> Optional[Role]:
        result = await self.db.execute(select(Role).where(Role.id == role_id, Role.deleted_at.is_(None)).options(selectinload(Role.permissions).selectinload(RolePermission.permission)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Role], int]:
        query = select(Role).where(Role.deleted_at.is_(None)).options(selectinload(Role.permissions).selectinload(RolePermission.permission))
        count_query = select(func.count(Role.id)).where(Role.deleted_at.is_(None))
        if company_id:
            query = query.where(Role.company_id == company_id)
            count_query = count_query.where(Role.company_id == company_id)
        query = query.offset(skip).limit(limit).order_by(Role.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> Role:
        role = Role(**kwargs)
        self.db.add(role)
        await self.db.flush()
        return role

    async def update(self, role: Role, **kwargs) -> Role:
        for key, value in kwargs.items():
            if value is not None:
                setattr(role, key, value)
        await self.db.flush()
        return role

    async def delete(self, role: Role) -> None:
        from datetime import datetime, timezone
        role.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()

    async def set_permissions(self, role_id: uuid.UUID, permission_ids: list[uuid.UUID]) -> None:
        await self.db.execute(delete(RolePermission).where(RolePermission.role_id == role_id))
        for pid in permission_ids:
            self.db.add(RolePermission(role_id=role_id, permission_id=pid))
        await self.db.flush()


class PermissionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list(self) -> list[Permission]:
        result = await self.db.execute(select(Permission).where(Permission.deleted_at.is_(None)).order_by(Permission.module, Permission.action))
        return result.scalars().all()

    async def get_by_code(self, code: str) -> Optional[Permission]:
        result = await self.db.execute(select(Permission).where(Permission.code == code, Permission.deleted_at.is_(None)))
        return result.scalar_one_or_none()
