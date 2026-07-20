import uuid
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.modules.users.models import User
from app.modules.users.repository import UserRepository


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = UserRepository(db)

    async def create_user(self, data: dict) -> User:
        existing = await self.repo.get_by_email(data["email"])
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")
        data["password_hash"] = hash_password(data.pop("password"))
        if data.get("company_id"):
            data["company_id"] = uuid.UUID(data["company_id"])
        return await self.repo.create(**data)

    async def get_user(self, user_id: uuid.UUID) -> User:
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    async def update_user(self, user_id: uuid.UUID, data: dict) -> User:
        user = await self.get_user(user_id)
        if "password" in data:
            data["password_hash"] = hash_password(data.pop("password"))
        return await self.repo.update(user, **data)

    async def delete_user(self, user_id: uuid.UUID) -> None:
        user = await self.get_user(user_id)
        await self.repo.delete(user)

    async def list_users(self, skip: int = 0, limit: int = 100, company_id: uuid.UUID | None = None) -> tuple[list[User], int]:
        return await self.repo.list(skip=skip, limit=limit, company_id=company_id)

    async def activate_user(self, user_id: uuid.UUID) -> User:
        user = await self.get_user(user_id)
        return await self.repo.update(user, is_active=True)

    async def deactivate_user(self, user_id: uuid.UUID) -> User:
        user = await self.get_user(user_id)
        return await self.repo.update(user, is_active=False)
