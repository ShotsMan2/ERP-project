import uuid
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.audit.models import AuditLog


class AuditRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list(self, company_id: uuid.UUID | None = None, user_id: uuid.UUID | None = None, resource_type: str | None = None, event_type: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[AuditLog], int]:
        query = select(AuditLog)
        count_query = select(func.count(AuditLog.id))
        if company_id:
            query = query.where(AuditLog.company_id == company_id)
            count_query = count_query.where(AuditLog.company_id == company_id)
        if user_id:
            query = query.where(AuditLog.user_id == user_id)
            count_query = count_query.where(AuditLog.user_id == user_id)
        if resource_type:
            query = query.where(AuditLog.resource_type == resource_type)
            count_query = count_query.where(AuditLog.resource_type == resource_type)
        if event_type:
            query = query.where(AuditLog.event_type == event_type)
            count_query = count_query.where(AuditLog.event_type == event_type)
        query = query.offset(skip).limit(limit).order_by(AuditLog.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def log(self, **kwargs) -> AuditLog:
        entry = AuditLog(**kwargs)
        self.db.add(entry)
        await self.db.flush()
        return entry
