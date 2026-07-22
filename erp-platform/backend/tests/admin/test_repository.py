import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.admin.models import SystemBackup, SystemHealthCheck
from app.modules.admin.repository import BackupRepository, HealthCheckRepository


@pytest.mark.asyncio
async def test_backup_repo_create_and_list(db_session: AsyncSession):
    repo = BackupRepository(db_session)
    await repo.create(filename="b1.sql", type="full", status="completed")
    await repo.create(filename="b2.sql", type="incremental", status="pending")

    items, total = await repo.list()
    assert total == 2
    assert len(items) == 2

    items_filtered, total_filtered = await repo.list(status="pending")
    assert total_filtered == 1


@pytest.mark.asyncio
async def test_health_check_repo(db_session: AsyncSession):
    repo = HealthCheckRepository(db_session)
    await repo.create(service_name="redis", status="healthy", latency_ms=2.0)
    await repo.create(service_name="postgres", status="healthy", latency_ms=3.0)

    items, total = await repo.list_history()
    assert total == 2

    latest = await repo.get_latest()
    assert len(latest) == 2
