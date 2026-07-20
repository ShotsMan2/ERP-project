from __future__ import annotations

import json
from collections.abc import Awaitable, Callable
from functools import wraps
from typing import Any

import redis.asyncio as aioredis
from redis.asyncio import Redis

from app.config import settings


class RedisClient:
    def __init__(self) -> None:
        self._client: Redis | None = None

    async def initialize(self) -> None:
        if self._client is None:
            self._client = await aioredis.from_url(
                settings.redis_url,
                encoding="utf-8",
                decode_responses=True,
            )

    async def close(self) -> None:
        if self._client:
            await self._client.close()
            self._client = None

    @property
    def client(self) -> Redis:
        if self._client is None:
            raise RuntimeError("Redis client not initialized. Call initialize() first.")
        return self._client

    async def get(self, key: str) -> Any:
        value = await self.client.get(key)
        if value is None:
            return None
        try:
            return json.loads(value)
        except (json.JSONDecodeError, TypeError):
            return value

    async def set(self, key: str, value: Any, ttl: int | None = None) -> bool:
        serialized = json.dumps(value, default=str)
        if ttl is not None:
            return await self.client.setex(key, ttl, serialized)
        return await self.client.set(key, serialized)

    async def delete(self, key: str) -> bool:
        return bool(await self.client.delete(key))

    async def exists(self, key: str) -> bool:
        return bool(await self.client.exists(key))

    async def expire(self, key: str, ttl: int) -> bool:
        return await self.client.expire(key, ttl)

    async def incr(self, key: str) -> int:
        return await self.client.incr(key)

    async def clear_pattern(self, pattern: str) -> int:
        cursor = 0
        deleted = 0
        while True:
            cursor, keys = await self.client.scan(cursor=cursor, match=pattern, count=100)
            if keys:
                deleted += await self.client.delete(*keys)
            if cursor == 0:
                break
        return deleted


redis_client = RedisClient()


async def get_redis() -> RedisClient:
    return redis_client


async def set_cache(key: str, value: Any, ttl: int | None = None) -> bool:
    return await redis_client.set(key, value, ttl)


async def get_cache(key: str) -> Any:
    return await redis_client.get(key)


async def delete_cache(key: str) -> bool:
    return await redis_client.delete(key)


async def clear_pattern(pattern: str) -> int:
    return await redis_client.clear_pattern(pattern)


def cached(ttl: int = 300):
    def decorator(func: Callable[..., Awaitable[Any]]) -> Callable[..., Awaitable[Any]]:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            cache_key_parts = [func.__name__]
            for arg in args:
                cache_key_parts.append(str(arg))
            for k, v in sorted(kwargs.items()):
                if k not in ("db", "session", "current_user"):
                    cache_key_parts.append(f"{k}:{v}")
            cache_key = ":".join(cache_key_parts)
            cached_value = await redis_client.get(cache_key)
            if cached_value is not None:
                return cached_value
            result = await func(*args, **kwargs)
            await redis_client.set(cache_key, result, ttl)
            return result
        return wrapper
    return decorator
