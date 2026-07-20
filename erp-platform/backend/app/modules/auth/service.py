import hashlib
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.modules.auth.models import User
from app.modules.auth.repository import UserRepository, SessionRepository


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)
        self.session_repo = SessionRepository(db)

    async def authenticate_user(self, email: str, password: str) -> tuple[User, bool]:
        user = await self.user_repo.get_by_email(email)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account is inactive")
        if user.locked_until and user.locked_until > datetime.now(timezone.utc):
            raise HTTPException(status_code=status.HTTP_423_LOCKED, detail="Account is locked")
        if not verify_password(password, user.password_hash):
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= settings.MAX_LOGIN_ATTEMPTS:
                user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=settings.LOGIN_LOCKOUT_MINUTES)
            await self.db.flush()
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        user.failed_login_attempts = 0
        user.locked_until = None
        user.last_login = datetime.now(timezone.utc)
        await self.db.flush()
        return user, user.mfa_enabled

    async def create_session(self, user: User, ip_address: str | None, user_agent: str | None) -> dict:
        token_data = {"sub": user.id, "company_id": user.company_id, "email": user.email}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        access_hash = hashlib.sha256(access_token.encode()).hexdigest()
        refresh_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
        await self.session_repo.create(user.id, access_hash, refresh_hash, ip_address, user_agent, expires_at)
        return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

    async def refresh_token(self, refresh_token: str) -> dict:
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        refresh_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
        session = await self.session_repo.get_by_refresh_token(refresh_hash)
        if not session:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session not found or revoked")
        user = await self.user_repo.get_by_id(session.user_id)
        if not user or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User inactive")
        await self.session_repo.revoke(session)
        return await self.create_session(user, session.ip_address, session.user_agent)

    async def setup_mfa(self, user_id: str) -> dict:
        import pyotp
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        secret = pyotp.random_base32()
        user.mfa_secret = secret
        provisioning_uri = pyotp.totp.TOTP(secret).provisioning_uri(name=user.email, issuer_name=settings.MFA_ISSUER_NAME)
        await self.db.flush()
        return {"secret": secret, "qr_code_url": provisioning_uri}

    async def verify_mfa(self, user_id: str, totp_code: str) -> bool:
        import pyotp
        user = await self.user_repo.get_by_id(user_id)
        if not user or not user.mfa_secret:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="MFA not configured")
        totp = pyotp.TOTP(user.mfa_secret)
        if totp.verify(totp_code):
            user.mfa_enabled = True
            await self.db.flush()
            return True
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid MFA code")

    async def forgot_password(self, email: str) -> dict:
        user = await self.user_repo.get_by_email(email)
        if not user:
            return {"message": "If the email exists, a reset link has been sent"}
        reset_token = create_access_token({"sub": user.id, "purpose": "reset_password"}, timedelta(hours=1))
        return {"message": "If the email exists, a reset link has been sent", "reset_token": reset_token}

    async def reset_password(self, token: str, new_password: str) -> dict:
        payload = decode_token(token)
        if not payload or payload.get("purpose") != "reset_password":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")
        user = await self.user_repo.get_by_id(payload["sub"])
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        user.password_hash = hash_password(new_password)
        await self.db.flush()
        return {"message": "Password reset successfully"}

    async def get_user_profile(self, user_id: str) -> User:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    async def update_user_profile(self, user_id: str, data: dict) -> User:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        allowed_fields = {"email"}
        updates = {k: v for k, v in data.items() if k in allowed_fields}
        return await self.user_repo.update(user, **updates)
