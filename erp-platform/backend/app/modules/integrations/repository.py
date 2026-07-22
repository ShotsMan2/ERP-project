import uuid
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.integrations.models import IntegrationProvider, IntegrationLog


class IntegrationProviderRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, provider_id: uuid.UUID) -> Optional[IntegrationProvider]:
        result = await self.db.execute(select(IntegrationProvider).where(IntegrationProvider.id == provider_id, IntegrationProvider.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None, provider_type: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[IntegrationProvider], int]:
        query = select(IntegrationProvider).where(IntegrationProvider.deleted_at.is_(None))
        count_query = select(func.count(IntegrationProvider.id)).where(IntegrationProvider.deleted_at.is_(None))
        if company_id:
            query = query.where(IntegrationProvider.company_id == company_id)
            count_query = count_query.where(IntegrationProvider.company_id == company_id)
        if provider_type:
            query = query.where(IntegrationProvider.provider_type == provider_type)
            count_query = count_query.where(IntegrationProvider.provider_type == provider_type)
        query = query.offset(skip).limit(limit).order_by(IntegrationProvider.name)
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> IntegrationProvider:
        provider = IntegrationProvider(**kwargs)
        self.db.add(provider)
        await self.db.flush()
        return provider

    async def update(self, provider: IntegrationProvider, **kwargs) -> IntegrationProvider:
        for key, value in kwargs.items():
            if value is not None:
                setattr(provider, key, value)
        await self.db.flush()
        return provider


class IntegrationLogRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_by_provider(self, provider_id: uuid.UUID, skip: int = 0, limit: int = 100) -> tuple[list[IntegrationLog], int]:
        query = select(IntegrationLog).where(IntegrationLog.provider_id == provider_id).order_by(IntegrationLog.created_at.desc())
        count_query = select(func.count(IntegrationLog.id)).where(IntegrationLog.provider_id == provider_id)
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> IntegrationLog:
        log = IntegrationLog(**kwargs)
        self.db.add(log)
        await self.db.flush()
        return log
