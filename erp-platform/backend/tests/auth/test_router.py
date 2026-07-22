import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_login_endpoint(client: AsyncClient):
    response = await client.post("/api/v1/auth/login", json={"email": "test@test.com", "password": "wrongpass"})
    assert response.status_code in (401, 422)


@pytest.mark.asyncio
async def test_refresh_endpoint(client: AsyncClient):
    response = await client.post("/api/v1/auth/refresh", json={"refresh_token": "invalid_token"})
    assert response.status_code in (401, 422)


@pytest.mark.asyncio
async def test_profile_unauthenticated(client: AsyncClient):
    response = await client.get("/api/v1/auth/profile")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_forgot_password(client: AsyncClient):
    response = await client.post("/api/v1/auth/forgot-password", params={"email": "test@test.com"})
    assert response.status_code in (200, 422)
