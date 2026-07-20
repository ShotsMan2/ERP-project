import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.audit.schemas import AuditLogResponse
from app.modules.audit.service import AuditService

router = APIRouter(prefix="/audit-logs", tags=["Audit"])


@router.get("", response_model=list[AuditLogResponse])
async def list_audit_logs(company_id: str | None = Query(None), user_id: str | None = Query(None), resource_type: str | None = Query(None), event_type: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("audit.read"))):
    service = AuditService(db)
    items, _ = await service.list_logs(
        company_id=uuid.UUID(company_id) if company_id else None,
        user_id=uuid.UUID(user_id) if user_id else None,
        resource_type=resource_type,
        event_type=event_type,
        skip=(page - 1) * size,
        limit=size,
    )
    return [AuditLogResponse.model_validate(log) for log in items]
