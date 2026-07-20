from __future__ import annotations

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from app.config import settings


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({
        "exp": expire,
        "iat": now,
        "iss": settings.JWT_ISSUER,
        "type": "access",
    })
    private_key = settings.JWT_PRIVATE_KEY.replace("\\n", "\n")
    return jwt.encode(to_encode, private_key, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({
        "exp": expire,
        "iat": now,
        "iss": settings.JWT_ISSUER,
        "type": "refresh",
    })
    private_key = settings.JWT_PRIVATE_KEY.replace("\\n", "\n")
    return jwt.encode(to_encode, private_key, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict | None:
    try:
        public_key = settings.JWT_PUBLIC_KEY.replace("\\n", "\n")
        payload = jwt.decode(
            token,
            public_key,
            algorithms=[settings.JWT_ALGORITHM],
            issuer=settings.JWT_ISSUER,
        )
        return payload
    except JWTError:
        return None


def verify_token(token: str, expected_type: str = "access") -> bool:
    payload = decode_token(token)
    if payload is None:
        return False
    if payload.get("type") != expected_type:
        return False
    exp = payload.get("exp")
    if exp is None:
        return False
    now = datetime.now(timezone.utc).timestamp()
    return now < exp
