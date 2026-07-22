import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.admin.service import AdminService
from app.modules.admin.repository import HealthCheckRepository
from app.modules.admin.schemas import (
    BackupCreate, BackupResponse, HealthCheckResponse, SystemHealthSummary,
    QueueTaskResponse, QueueSummary, ActivityLogResponse, SystemOverview,
)

router = APIRouter(tags=["Admin"])

# ── System Overview ────────────────────────────────────────────────


@router.get("/overview", response_model=SystemOverview)
async def get_system_overview(db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("admin.read"))):
    service = AdminService(db)
    return await service.get_system_overview()

# ── Health Checks ──────────────────────────────────────────────────


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

# ── Backups ────────────────────────────────────────────────────────


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
async def create_backup(body: BackupCreate, db: AsyncSession = Depends(get_db), user_id: str = Depends(get_current_user_id), _: bool = Depends(lambda: check_permission("admin.create"))):
    service = AdminService(db)
    data = body.model_dump(exclude_none=True)
    data["created_by"] = user_id
    backup = await service.create_backup(data)
    return BackupResponse.model_validate(backup)


@router.delete("/backups/{backup_id}", status_code=204)
async def delete_backup(backup_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("admin.delete"))):
    service = AdminService(db)
    await service.delete_backup(uuid.UUID(backup_id))


@router.post("/backups/{backup_id}/restore", response_model=BackupResponse)
async def restore_backup(backup_id: str, db: AsyncSession = Depends(get_db), user_id: str = Depends(get_current_user_id), _: bool = Depends(lambda: check_permission("admin.create"))):
    service = AdminService(db)
    backup = await service.restore_backup(uuid.UUID(backup_id), restored_by=user_id)
    return BackupResponse.model_validate(backup)

# ── Queue Monitoring ───────────────────────────────────────────────


@router.get("/queue/summary", response_model=list[QueueSummary])
async def get_queue_summary(db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("admin.read"))):
    service = AdminService(db)
    return await service.get_queue_summary()


@router.get("/queue/tasks", response_model=list[QueueTaskResponse])
async def list_queue_tasks(queue_name: str | None = Query(None), status: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("admin.read"))):
    service = AdminService(db)
    items, total = await service.list_queue_tasks(queue_name=queue_name, status=status, skip=(page - 1) * size, limit=size)
    return [QueueTaskResponse.model_validate(t) for t in items]


@router.post("/queue/tasks/{task_id}/retry", response_model=QueueTaskResponse)
async def retry_task(task_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("admin.update"))):
    service = AdminService(db)
    task = await service.retry_task(task_id)
    return QueueTaskResponse.model_validate(task)


@router.post("/queue/tasks/{task_id}/cancel", response_model=QueueTaskResponse)
async def cancel_task(task_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("admin.update"))):
    service = AdminService(db)
    task = await service.cancel_task(task_id)
    return QueueTaskResponse.model_validate(task)


@router.post("/queue/{queue_name}/purge")
async def purge_queue(queue_name: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("admin.delete"))):
    service = AdminService(db)
    count = await service.purge_queue(queue_name)
    return {"purged": count, "queue": queue_name}

# ── Activity Logs ──────────────────────────────────────────────────


@router.get("/activities", response_model=list[ActivityLogResponse])
async def list_activity_logs(user_id: str | None = Query(None), module: str | None = Query(None), action: str | None = Query(None), status: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(50, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("admin.read"))):
    service = AdminService(db)
    items, total = await service.list_activity_logs(user_id=user_id, module=module, action=action, status=status, skip=(page - 1) * size, limit=size)
    return [ActivityLogResponse.model_validate(l) for l in items]
