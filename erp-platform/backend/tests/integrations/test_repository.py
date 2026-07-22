import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.integrations.models import IntegrationProvider, IntegrationLog
from app.modules.integrations.repository import IntegrationProviderRepository, IntegrationLogRepository


@pytest.mark.asyncio
async def test_provider_repo_create_and_get(db_session: AsyncSession):
    repo = IntegrationProviderRepository(db_session)
    provider = await repo.create(name="Repo Test", provider_type="graphql")
    assert provider.id is not None

    found = await repo.get_by_id(provider.id)
    assert found is not None
    assert found.name == "Repo Test"


@pytest.mark.asyncio
async def test_provider_repo_list(db_session: AsyncSession):
    repo = IntegrationProviderRepository(db_session)
    await repo.create(name="P1", provider_type="rest")
    await repo.create(name="P2", provider_type="soap")
    await repo.create(name="P3", provider_type="rest")

    items, total = await repo.list(provider_type="rest")
    assert total == 2
    assert len(items) == 2


@pytest.mark.asyncio
async def test_provider_repo_update(db_session: AsyncSession):
    repo = IntegrationProviderRepository(db_session)
    provider = await repo.create(name="Update Test", provider_type="rest")
    updated = await repo.update(provider, name="Updated Name", is_active=False)
    assert updated.name == "Updated Name"
    assert updated.is_active is False


@pytest.mark.asyncio
async def test_log_repo_list_by_provider(db_session: AsyncSession):
    provider = IntegrationProvider(name="Log Test", provider_type="rest")
    db_session.add(provider)
    await db_session.flush()

    log_repo = IntegrationLogRepository(db_session)
    await log_repo.create(provider_id=provider.id, direction="inbound", status="success")
    await log_repo.create(provider_id=provider.id, direction="outbound", status="failed")

    items, total = await log_repo.list_by_provider(provider.id)
    assert total == 2
    assert len(items) == 2
