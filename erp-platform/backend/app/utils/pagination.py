from __future__ import annotations

import base64
import json
import math
from typing import Any, Generic, TypeVar

from pydantic import BaseModel
from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

ModelT = TypeVar("ModelT", bound=DeclarativeBase)
SchemaT = TypeVar("SchemaT", bound=BaseModel)


class PagePagination:
    def __init__(self, page: int = 1, page_size: int | None = None) -> None:
        self.page = max(page, 1)
        self.page_size = min(page_size or settings.PAGINATION_DEFAULT_PAGE_SIZE, settings.PAGINATION_MAX_PAGE_SIZE)

    async def paginate_query(
        self,
        db: AsyncSession,
        query: Select,
        schema_class: type[SchemaT],
    ) -> dict:
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar() or 0
        total_pages = math.ceil(total / self.page_size) if total > 0 else 0
        offset = (self.page - 1) * self.page_size
        result = await db.execute(query.offset(offset).limit(self.page_size))
        rows = result.scalars().all()
        return {
            "success": True,
            "data": [schema_class.model_validate(row) for row in rows],
            "total": total,
            "page": self.page,
            "page_size": self.page_size,
            "total_pages": total_pages,
            "has_next": self.page < total_pages,
            "has_prev": self.page > 1,
        }


class CursorPagination:
    def __init__(self, cursor: str | None = None, limit: int = 25) -> None:
        self.limit = min(limit, settings.PAGINATION_MAX_PAGE_SIZE)
        self.cursor_value = self._decode_cursor(cursor) if cursor else None

    def _decode_cursor(self, cursor: str) -> Any:
        try:
            decoded = base64.urlsafe_b64decode(cursor.encode()).decode()
            return json.loads(decoded)
        except Exception:
            return None

    def _encode_cursor(self, value: Any) -> str:
        encoded = json.dumps(value, default=str)
        return base64.urlsafe_b64encode(encoded.encode()).decode()

    async def paginate_query(
        self,
        db: AsyncSession,
        query: Select,
        schema_class: type[SchemaT],
        cursor_column: Any,
    ) -> dict:
        if self.cursor_value is not None:
            query = query.where(cursor_column > self.cursor_value)
        query = query.order_by(cursor_column.asc()).limit(self.limit + 1)
        result = await db.execute(query)
        rows = result.scalars().all()
        has_more = len(rows) > self.limit
        items = rows[: self.limit]
        next_cursor = None
        if has_more and items:
            last_value = getattr(items[-1], cursor_column.name, None)
            if last_value is not None:
                next_cursor = self._encode_cursor(last_value)
        return {
            "success": True,
            "data": [schema_class.model_validate(item) for item in items],
            "next_cursor": next_cursor,
            "has_more": has_more,
        }
