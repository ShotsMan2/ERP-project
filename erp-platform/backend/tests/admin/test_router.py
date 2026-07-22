import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_endpoint(client: AsyncClient):
    response = await client.get("/api/v1/admin/health")
    assert response.status_code in (200, 401, 403)


@pytest.mark.asyncio
async def test_list_backups(client: AsyncClient):
    response = await client.get("/api/v1/admin/backups")
    assert response.status_code in (200, 401, 403)
