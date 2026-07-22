import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.integrations.schemas import IntegrationProviderCreate, IntegrationProviderUpdate, IntegrationProviderResponse, IntegrationLogResponse, SyncRequest, SyncResponse
from app.modules.integrations.service import IntegrationService
from app.modules.integrations.repository import IntegrationLogRepository

router = APIRouter(tags=["Integrations"])


@router.get("/providers", response_model=list[IntegrationProviderResponse])
async def list_providers(company_id: str | None = Query(None), provider_type: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("integrations.read"))):
    service = IntegrationService(db)
    items, total = await service.list_providers(company_id=uuid.UUID(company_id) if company_id else None, provider_type=provider_type, skip=(page - 1) * size, limit=size)
    return [IntegrationProviderResponse.model_validate(p) for p in items]


@router.get("/providers/{provider_id}", response_model=IntegrationProviderResponse)
async def get_provider(provider_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("integrations.read"))):
    service = IntegrationService(db)
    provider = await service.get_provider(uuid.UUID(provider_id))
    return IntegrationProviderResponse.model_validate(provider)


@router.post("/providers", response_model=IntegrationProviderResponse, status_code=201)
async def create_provider(body: IntegrationProviderCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("integrations.create"))):
    service = IntegrationService(db)
    provider = await service.create_provider(body.model_dump(exclude_none=True))
    return IntegrationProviderResponse.model_validate(provider)


@router.put("/providers/{provider_id}", response_model=IntegrationProviderResponse)
async def update_provider(provider_id: str, body: IntegrationProviderUpdate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("integrations.update"))):
    service = IntegrationService(db)
    provider = await service.update_provider(uuid.UUID(provider_id), body.model_dump(exclude_none=True))
    return IntegrationProviderResponse.model_validate(provider)


@router.post("/providers/{provider_id}/toggle", response_model=IntegrationProviderResponse)
async def toggle_provider(provider_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("integrations.update"))):
    service = IntegrationService(db)
    provider = await service.toggle_provider(uuid.UUID(provider_id))
    return IntegrationProviderResponse.model_validate(provider)


@router.post("/sync", response_model=SyncResponse)
async def sync_provider(body: SyncRequest, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("integrations.create"))):
    service = IntegrationService(db)
    return await service.sync_provider(uuid.UUID(body.provider_id))


@router.get("/providers/{provider_id}/logs", response_model=list[IntegrationLogResponse])
async def list_provider_logs(provider_id: str, page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("integrations.read"))):
    log_repo = IntegrationLogRepository(db)
    items, total = await log_repo.list_by_provider(uuid.UUID(provider_id), skip=(page - 1) * size, limit=size)
    return [IntegrationLogResponse.model_validate(log) for log in items]
