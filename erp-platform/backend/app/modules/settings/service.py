import uuid
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession


class SettingsService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[dict]:
        from sqlalchemy import text
        result = await self.db.execute(select(SystemConfig).where(SystemConfig.deleted_at.is_(None)).order_by(SystemConfig.key))
        configs = result.scalars().all()
        return [{"id": str(c.id), "key": c.key, "value": c.value, "description": c.description, "updated_at": c.updated_at} for c in configs]

    async def get(self, key: str) -> dict:
        from sqlalchemy import text
        result = await self.db.execute(select(SystemConfig).where(SystemConfig.key == key, SystemConfig.deleted_at.is_(None)))
        config = result.scalar_one_or_none()
        if not config:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Config not found")
        return {"id": str(config.id), "key": config.key, "value": config.value, "description": config.description, "updated_at": config.updated_at}

    async def update(self, key: str, value: dict | str | int | float | bool) -> dict:
        from sqlalchemy import text
        result = await self.db.execute(select(SystemConfig).where(SystemConfig.key == key, SystemConfig.deleted_at.is_(None)))
        config = result.scalar_one_or_none()
        if config:
            config.value = value
        else:
            config = SystemConfig(key=key, value=value)
            self.db.add(config)
        await self.db.flush()
        return {"id": str(config.id), "key": config.key, "value": config.value, "updated_at": config.updated_at}


from app.core.base import BaseModel
from sqlalchemy import String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column


class SystemConfig(BaseModel):
    __tablename__ = "system_config"

    key: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    value: Mapped[dict] = mapped_column(JSONB, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
