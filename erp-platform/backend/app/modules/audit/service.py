import uuid
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.audit.models import AuditLog
from app.modules.audit.repository import AuditRepository


class AuditService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = AuditRepository(db)

    async def list_logs(self, company_id: uuid.UUID | None = None, user_id: uuid.UUID | None = None, resource_type: str | None = None, event_type: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[AuditLog], int]:
        return await self.repo.list(company_id=company_id, user_id=user_id, resource_type=resource_type, event_type=event_type, skip=skip, limit=limit)

    async def log_event(self, company_id: uuid.UUID | None, user_id: uuid.UUID | None, event_type: str, resource_type: str, resource_id: str | None = None, changes: dict | None = None, ip_address: str | None = None, user_agent: str | None = None, correlation_id: str | None = None) -> AuditLog:
        return await self.repo.log(company_id=company_id, user_id=user_id, event_type=event_type, resource_type=resource_type, resource_id=resource_id, changes=changes, ip_address=ip_address, user_agent=user_agent, correlation_id=correlation_id)

    async def get_compliance_report(self, company_id: uuid.UUID, from_date: str, to_date: str) -> dict:
        logs, _ = await self.repo.list(company_id=company_id)
        return {
            "company_id": str(company_id),
            "total_events": len(logs),
            "period": f"{from_date} to {to_date}",
            "events_by_type": {},
            "events_by_user": {},
        }
