from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: str
    requires_mfa: bool = False


class RefreshRequest(BaseModel):
    refresh_token: str


class MFASetup(BaseModel):
    secret: str
    qr_code_url: str


class MFAVerify(BaseModel):
    user_id: str
    totp_code: str = Field(..., min_length=6, max_length=6)


class ForgotPassword(BaseModel):
    email: EmailStr


class ResetPassword(BaseModel):
    token: str
    new_password: str = Field(..., min_length=12, max_length=128)
