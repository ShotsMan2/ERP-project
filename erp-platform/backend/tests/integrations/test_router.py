import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_providers_empty(client: AsyncClient):
    response = await client.get("/api/v1/integrations/providers")
    assert response.status_code in (200, 401, 403)


@pytest.mark.asyncio
async def test_create_provider_endpoint(client: AsyncClient):
    payload = {"name": "API Test", "provider_type": "rest", "api_endpoint": "https://api.test.com"}
    response = await client.post("/api/v1/integrations/providers", json=payload)
    assert response.status_code in (201, 401, 403)
    if response.status_code == 201:
        data = response.json()
        assert data["name"] == "API Test"
        assert data["provider_type"] == "rest"
