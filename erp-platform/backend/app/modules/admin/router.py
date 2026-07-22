import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.admin.service import AdminService
from app.modules.admin.repository import HealthCheckRepository
from app.modules.admin.schemas import BackupCreate, BackupResponse, HealthCheckResponse, SystemHealthSummary

router = APIRouter(tags=["Admin"])


@router.get("/health", response_model=SystemHealthSummary)
async def get_health_summary(db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("admin.read"))):
    service = AdminService(db)
    return await service.get_health_summary()


@router.post("/health/check", response_model=list[HealthCheckResponse])
async def run_health_checks(db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("admin.create"))):
    service = AdminService(db)
    checks = await service.run_health_check()
    return [HealthCheckResponse.model_validate(c) for c in checks]


@router.get("/health/history", response_model=list[HealthCheckResponse])
async def get_health_history(service_name: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(50, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("admin.read"))):
    repo = HealthCheckRepository(db)
    items, total = await repo.list_history(service_name=service_name, skip=(page - 1) * size, limit=size)
    return [HealthCheckResponse.model_validate(c) for c in items]


@router.get("/backups", response_model=list[BackupResponse])
async def list_backups(company_id: str | None = Query(None), status: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("admin.read"))):
    service = AdminService(db)
    items, total = await service.list_backups(company_id=uuid.UUID(company_id) if company_id else None, status=status, skip=(page - 1) * size, limit=size)
    return [BackupResponse.model_validate(b) for b in items]


@router.get("/backups/{backup_id}", response_model=BackupResponse)
async def get_backup(backup_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("admin.read"))):
    service = AdminService(db)
    backup = await service.get_backup(uuid.UUID(backup_id))
    return BackupResponse.model_validate(backup)


@router.post("/backups", response_model=BackupResponse, status_code=201)
async def create_backup(body: BackupCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("admin.create"))):
    service = AdminService(db)
    backup = await service.create_backup(body.model_dump(exclude_none=True))
    return BackupResponse.model_validate(backup)
