from __future__ import annotations

import time
from collections.abc import Awaitable, Callable
from typing import Any

from fastapi import FastAPI, HTTPException, Request, Response, status
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import settings


class RateLimiter:
    def __init__(self, redis_client: object | None = None) -> None:
        self.redis = redis_client

    async def check(self, key: str, max_requests: int, window_seconds: int) -> bool:
        if not settings.RATE_LIMIT_ENABLED:
            return True
        if self.redis is None or not hasattr(self.redis, "incr"):
            return self._check_local(key, max_requests, window_seconds)
        return await self._check_redis(key, max_requests, window_seconds)

    async def _check_redis(self, key: str, max_requests: int, window_seconds: int) -> bool:
        try:
            current = await self.redis.incr(key)
            if current == 1:
                await self.redis.expire(key, window_seconds)
            return current <= max_requests
        except Exception:
            return self._check_local(key, max_requests, window_seconds)

    def _check_local(self, key: str, max_requests: int, window_seconds: int) -> bool:
        _store: dict = getattr(self, "_local_store", {})
        now = time.time()
        if key not in _store:
            _store[key] = []
        _store[key] = [t for t in _store[key] if now - t < window_seconds]
        if len(_store[key]) >= max_requests:
            return False
        _store[key].append(now)
        setattr(self, "_local_store", _store)
        return True


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: FastAPI, redis_client: object | None = None) -> None:
        super().__init__(app)
        self.limiter = RateLimiter(redis_client)

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        client_ip = request.client.host if request.client else "unknown"
        path = request.url.path
        key = f"rate_limit:{client_ip}:{path}"
        default_limit = int(settings.RATE_LIMIT_DEFAULT.split("/")[0]) if "/" in settings.RATE_LIMIT_DEFAULT else 1000
        allowed = await self.limiter.check(key, default_limit, 60)
        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Try again later.",
            )
        return await call_next(request)


rate_limiter = RateLimiter()
