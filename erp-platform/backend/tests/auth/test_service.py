import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.auth.models import User
from app.modules.auth.service import AuthService
from app.core.security import hash_password


@pytest.mark.asyncio
async def test_authenticate_user_success(db_session: AsyncSession):
    user = User(email="test@erp.com", password_hash=hash_password("StrongPass123!"), is_active=True)
    db_session.add(user)
    await db_session.flush()

    service = AuthService(db_session)
    authenticated, mfa = await service.authenticate_user("test@erp.com", "StrongPass123!")
    assert authenticated.id == user.id
    assert mfa is False


@pytest.mark.asyncio
async def test_authenticate_user_wrong_password(db_session: AsyncSession):
    user = User(email="wrong@erp.com", password_hash=hash_password("correctpass"), is_active=True)
    db_session.add(user)
    await db_session.flush()

    service = AuthService(db_session)
    with pytest.raises(Exception):
        await service.authenticate_user("wrong@erp.com", "wrongpass")


@pytest.mark.asyncio
async def test_authenticate_user_inactive(db_session: AsyncSession):
    user = User(email="inactive@erp.com", password_hash=hash_password("testpass"), is_active=False)
    db_session.add(user)
    await db_session.flush()

    service = AuthService(db_session)
    with pytest.raises(Exception):
        await service.authenticate_user("inactive@erp.com", "testpass")


@pytest.mark.asyncio
async def test_get_user_profile(db_session: AsyncSession):
    user = User(email="profile@erp.com", password_hash=hash_password("test"), is_active=True)
    db_session.add(user)
    await db_session.flush()

    service = AuthService(db_session)
    profile = await service.get_user_profile(user.id)
    assert profile.email == "profile@erp.com"
