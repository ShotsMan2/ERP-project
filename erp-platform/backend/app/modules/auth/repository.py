from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.auth.models import User, Session


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.email == email, User.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.id == user_id, User.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def create(self, email: str, password_hash: str, company_id: str | None = None) -> User:
        user = User(email=email, password_hash=password_hash, company_id=company_id)
        self.db.add(user)
        await self.db.flush()
        return user

    async def update(self, user: User, **kwargs) -> User:
        for key, value in kwargs.items():
            setattr(user, key, value)
        await self.db.flush()
        return user


class SessionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, user_id: str, token_hash: str, refresh_token_hash: str | None, ip_address: str | None, user_agent: str | None, expires_at) -> Session:
        session = Session(user_id=user_id, token_hash=token_hash, refresh_token_hash=refresh_token_hash, ip_address=ip_address, user_agent=user_agent, expires_at=expires_at)
        self.db.add(session)
        await self.db.flush()
        return session

    async def get_by_refresh_token(self, refresh_hash: str) -> Optional[Session]:
        result = await self.db.execute(select(Session).where(Session.refresh_token_hash == refresh_hash, Session.is_revoked == False, Session.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def revoke(self, session: Session) -> None:
        session.is_revoked = True
        await self.db.flush()
