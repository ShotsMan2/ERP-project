from __future__ import annotations

from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.database.session import get_db as _get_db
from app.core.cache.redis import get_redis as _get_redis
from app.core.security.jwt import decode_token
from app.core.security.permissions import PermissionChecker

security_scheme = HTTPBearer(auto_error=False)

get_db = _get_db
AsyncSessionDep = Annotated[AsyncSession, Depends(get_db)]


async def get_redis():
    from app.core.cache.redis import redis_client
    return redis_client


RedisDep = Annotated[object, Depends(get_redis)]


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security_scheme)],
    db: AsyncSessionDep,
) -> dict:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = credentials.credentials
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload


CurrentUserDep = Annotated[dict, Depends(get_current_user)]


def check_permission(module: str, action: str):
    async def _check_permission(
        current_user: CurrentUserDep,
        db: AsyncSessionDep,
    ) -> bool:
        checker = PermissionChecker(db, current_user)
        has_perm = await checker.has_permission(module, action)
        if not has_perm:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing permission: {module}.{action}",
            )
        return True
    return Depends(_check_permission)


PermissionDep = Annotated[bool, Depends(check_permission)]
