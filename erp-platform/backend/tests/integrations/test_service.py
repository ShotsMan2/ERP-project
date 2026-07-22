import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.integrations.models import IntegrationProvider
from app.modules.integrations.service import IntegrationService


@pytest.mark.asyncio
async def test_create_provider(db_session: AsyncSession):
    service = IntegrationService(db_session)
    data = {"name": "Test Provider", "provider_type": "rest", "api_endpoint": "https://example.com/api"}
    provider = await service.create_provider(data)
    assert provider.name == "Test Provider"
    assert provider.provider_type == "rest"
    assert provider.is_active is True


@pytest.mark.asyncio
async def test_get_provider_not_found(db_session: AsyncSession):
    service = IntegrationService(db_session)
    with pytest.raises(Exception):
        await service.get_provider(uuid.uuid4())


@pytest.mark.asyncio
async def test_toggle_provider(db_session: AsyncSession):
    provider = IntegrationProvider(name="Toggle Test", provider_type="soap", is_active=True)
    db_session.add(provider)
    await db_session.flush()

    service = IntegrationService(db_session)
    toggled = await service.toggle_provider(provider.id)
    assert toggled.is_active is False

    toggled_again = await service.toggle_provider(provider.id)
    assert toggled_again.is_active is True


@pytest.mark.asyncio
async def test_sync_provider(db_session: AsyncSession):
    provider = IntegrationProvider(name="Sync Test", provider_type="rest")
    db_session.add(provider)
    await db_session.flush()

    service = IntegrationService(db_session)
    result = await service.sync_provider(provider.id)
    assert result["status"] == "processing"
    assert result["provider_id"] == str(provider.id)
