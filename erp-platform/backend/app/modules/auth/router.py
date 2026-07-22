from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id
from app.modules.auth.service import AuthService

router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    mfa_required: bool = False


class MFARequest(BaseModel):
    totp_code: str
    temp_token: str


class MFAResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class ProfileResponse(BaseModel):
    id: str
    email: str
    first_name: str | None = None
    last_name: str | None = None
    is_active: bool
    mfa_enabled: bool


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    user, mfa_required = await service.authenticate_user(request.email, request.password)
    if mfa_required:
        return LoginResponse(access_token="", refresh_token="", mfa_required=True)
    session = await service.create_session(user, None, None)
    return LoginResponse(**session)


@router.post("/mfa", response_model=MFAResponse)
async def mfa_verify(request: MFARequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    payload = decode_token(request.temp_token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid temp token")
    valid = await service.verify_mfa(payload["sub"], request.totp_code)
    if not valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid MFA code")
    user = await service.user_repo.get_by_id(payload["sub"])
    session = await service.create_session(user, None, None)
    return MFAResponse(**session)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(request: RefreshRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    session = await service.refresh_token(request.refresh_token)
    return TokenResponse(**session)


@router.get("/profile", response_model=ProfileResponse)
async def get_profile(user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    user = await service.get_user_profile(user_id)
    return ProfileResponse(
        id=user.id, email=user.email, first_name=user.first_name,
        last_name=user.last_name, is_active=user.is_active, mfa_enabled=user.mfa_enabled,
    )


@router.post("/forgot-password")
async def forgot_password(email: str, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    return await service.forgot_password(email)


@router.post("/reset-password")
async def reset_password(token: str, new_password: str, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    return await service.reset_password(token, new_password)


@router.post("/mfa/setup")
async def setup_mfa(user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    return await service.setup_mfa(user_id)


@router.post("/mfa/verify")
async def verify_mfa(totp_code: str, user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    valid = await service.verify_mfa(user_id, totp_code)
    return {"success": valid}


@router.put("/profile")
async def update_profile(data: dict, user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    user = await service.update_user_profile(user_id, data)
    return ProfileResponse(
        id=user.id, email=user.email, first_name=user.first_name,
        last_name=user.last_name, is_active=user.is_active, mfa_enabled=user.mfa_enabled,
    )


from app.core.security import decode_token
