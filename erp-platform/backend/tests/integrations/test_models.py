import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.integrations.models import IntegrationProvider, IntegrationLog


@pytest.mark.asyncio
async def test_create_integration_provider(db_session: AsyncSession):
    provider = IntegrationProvider(name="Test REST API", provider_type="rest", api_endpoint="https://api.test.com", is_active=True)
    db_session.add(provider)
    await db_session.flush()

    result = await db_session.execute(select(IntegrationProvider).where(IntegrationProvider.id == provider.id))
    saved = result.scalar_one()
    assert saved.name == "Test REST API"
    assert saved.provider_type == "rest"
    assert saved.sync_status == "idle"


@pytest.mark.asyncio
async def test_create_integration_log(db_session: AsyncSession):
    provider = IntegrationProvider(name="Test Logger", provider_type="webhook")
    db_session.add(provider)
    await db_session.flush()

    log = IntegrationLog(provider_id=provider.id, direction="outbound", status="success")
    db_session.add(log)
    await db_session.flush()

    result = await db_session.execute(select(IntegrationLog).where(IntegrationLog.id == log.id))
    saved = result.scalar_one()
    assert saved.provider_id == provider.id
    assert saved.direction == "outbound"
