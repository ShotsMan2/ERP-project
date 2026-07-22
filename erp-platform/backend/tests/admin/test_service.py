import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.admin.models import SystemBackup
from app.modules.admin.service import AdminService


@pytest.mark.asyncio
async def test_create_backup_service(db_session: AsyncSession):
    service = AdminService(db_session)
    data = {"filename": "auto_backup.sql", "type": "full", "status": "pending"}
    backup = await service.create_backup(data)
    assert backup.filename == "auto_backup.sql"
    assert backup.type == "full"


@pytest.mark.asyncio
async def test_get_backup_not_found(db_session: AsyncSession):
    service = AdminService(db_session)
    with pytest.raises(Exception):
        await service.get_backup(uuid.uuid4())


@pytest.mark.asyncio
async def test_health_summary_empty(db_session: AsyncSession):
    service = AdminService(db_session)
    summary = await service.get_health_summary()
    assert summary["status"] == "healthy"
    assert summary["healthy_count"] == 0
    assert summary["down_count"] == 0


@pytest.mark.asyncio
async def test_run_health_checks(db_session: AsyncSession):
    service = AdminService(db_session)
    results = await service.run_health_check()
    assert len(results) == 6
    for check in results:
        assert check.status == "healthy"
