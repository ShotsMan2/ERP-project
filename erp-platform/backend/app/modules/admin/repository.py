import uuid
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.admin.models import SystemBackup, SystemHealthCheck


class BackupRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, backup_id: uuid.UUID) -> Optional[SystemBackup]:
        result = await self.db.execute(select(SystemBackup).where(SystemBackup.id == backup_id, SystemBackup.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[SystemBackup], int]:
        query = select(SystemBackup).where(SystemBackup.deleted_at.is_(None))
        count_query = select(func.count(SystemBackup.id)).where(SystemBackup.deleted_at.is_(None))
        if company_id:
            query = query.where(SystemBackup.company_id == company_id)
            count_query = count_query.where(SystemBackup.company_id == company_id)
        if status:
            query = query.where(SystemBackup.status == status)
            count_query = count_query.where(SystemBackup.status == status)
        query = query.offset(skip).limit(limit).order_by(SystemBackup.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> SystemBackup:
        backup = SystemBackup(**kwargs)
        self.db.add(backup)
        await self.db.flush()
        return backup

    async def update(self, backup: SystemBackup, **kwargs) -> SystemBackup:
        for key, value in kwargs.items():
            if value is not None:
                setattr(backup, key, value)
        await self.db.flush()
        return backup


class HealthCheckRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_latest(self) -> list[SystemHealthCheck]:
        subquery = select(func.max(SystemHealthCheck.checked_at)).scalar_subquery()
        result = await self.db.execute(select(SystemHealthCheck).where(SystemHealthCheck.checked_at == subquery).order_by(SystemHealthCheck.service_name))
        return result.scalars().all()

    async def create(self, **kwargs) -> SystemHealthCheck:
        check = SystemHealthCheck(**kwargs)
        self.db.add(check)
        await self.db.flush()
        return check

    async def list_history(self, service_name: str | None = None, skip: int = 0, limit: int = 50) -> tuple[list[SystemHealthCheck], int]:
        query = select(SystemHealthCheck)
        count_query = select(func.count(SystemHealthCheck.id))
        if service_name:
            query = query.where(SystemHealthCheck.service_name == service_name)
            count_query = count_query.where(SystemHealthCheck.service_name == service_name)
        query = query.offset(skip).limit(limit).order_by(SystemHealthCheck.checked_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0
