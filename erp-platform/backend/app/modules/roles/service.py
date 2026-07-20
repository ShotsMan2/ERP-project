import uuid
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.roles.models import Role, Permission, UserRole
from app.modules.roles.repository import RoleRepository, PermissionRepository


class RBACService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.role_repo = RoleRepository(db)
        self.permission_repo = PermissionRepository(db)

    async def create_role(self, data: dict) -> Role:
        return await self.role_repo.create(**data)

    async def get_role(self, role_id: uuid.UUID) -> Role:
        role = await self.role_repo.get_by_id(role_id)
        if not role:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
        return role

    async def update_role(self, role_id: uuid.UUID, data: dict) -> Role:
        role = await self.get_role(role_id)
        return await self.role_repo.update(role, **data)

    async def delete_role(self, role_id: uuid.UUID) -> None:
        role = await self.get_role(role_id)
        if role.is_system:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete system role")
        await self.role_repo.delete(role)

    async def list_roles(self, company_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Role], int]:
        return await self.role_repo.list(company_id=company_id, skip=skip, limit=limit)

    async def set_role_permissions(self, role_id: uuid.UUID, permission_ids: list[str]) -> Role:
        role = await self.get_role(role_id)
        pids = [uuid.UUID(pid) for pid in permission_ids]
        await self.role_repo.set_permissions(role_id, pids)
        return await self.role_repo.get_by_id(role_id)

    async def list_permissions(self) -> list[Permission]:
        return await self.permission_repo.list()

    async def assign_user_role(self, user_id: uuid.UUID, role_id: uuid.UUID, company_id: uuid.UUID | None = None) -> UserRole:
        ur = UserRole(user_id=user_id, role_id=role_id, company_id=company_id)
        self.db.add(ur)
        await self.db.flush()
        return ur

    async def remove_user_role(self, user_id: uuid.UUID, role_id: uuid.UUID) -> None:
        from sqlalchemy import delete
        await self.db.execute(delete(UserRole).where(UserRole.user_id == user_id, UserRole.role_id == role_id))
        await self.db.flush()

    async def check_permission(self, user_id: uuid.UUID, required_permission: str) -> bool:
        from sqlalchemy import select as sel
        result = await self.db.execute(
            sel(UserRole).where(UserRole.user_id == user_id).options(
                sel(UserRole).selectinload(UserRole.role).selectinload(Role.permissions).selectinload(RolePermission.permission)
            )
        )
        user_roles = result.scalars().all()
        for ur in user_roles:
            for rp in ur.role.permissions:
                if rp.permission.code == required_permission:
                    return True
        return False
