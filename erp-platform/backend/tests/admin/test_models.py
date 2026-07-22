import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.admin.models import SystemBackup, SystemHealthCheck


@pytest.mark.asyncio
async def test_create_backup(db_session: AsyncSession):
    backup = SystemBackup(filename="test_backup.sql", type="full", status="completed")
    db_session.add(backup)
    await db_session.flush()

    result = await db_session.execute(select(SystemBackup).where(SystemBackup.id == backup.id))
    saved = result.scalar_one()
    assert saved.filename == "test_backup.sql"
    assert saved.type == "full"
    assert saved.status == "completed"


@pytest.mark.asyncio
async def test_create_health_check(db_session: AsyncSession):
    check = SystemHealthCheck(service_name="database", status="healthy", latency_ms=5.0)
    db_session.add(check)
    await db_session.flush()

    result = await db_session.execute(select(SystemHealthCheck).where(SystemHealthCheck.id == check.id))
    saved = result.scalar_one()
    assert saved.service_name == "database"
    assert saved.status == "healthy"
