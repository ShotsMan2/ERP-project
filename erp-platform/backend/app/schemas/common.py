from __future__ import annotations

from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1, description="Page number (1-indexed)")
    page_size: int = Field(default=25, ge=1, le=100, description="Items per page")
    sort_by: str | None = Field(default=None, description="Field to sort by")
    sort_order: str = Field(default="asc", pattern="^(asc|desc)$", description="Sort direction")
    search: str | None = Field(default=None, description="Search query")


class CursorParams(BaseModel):
    cursor: str | None = Field(default=None, description="Cursor for pagination")
    limit: int = Field(default=25, ge=1, le=100, description="Items per page")


class PaginatedResponse(BaseModel, Generic[T]):
    success: bool = True
    data: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_prev: bool


class CursorPaginatedResponse(BaseModel, Generic[T]):
    success: bool = True
    data: list[T]
    next_cursor: str | None = None
    has_more: bool = False


class SuccessResponse(BaseModel):
    success: bool = True
    message: str = "Operation completed successfully"


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Any | None = None
    code: str | None = None


class IdResponse(BaseModel):
    success: bool = True
    id: str
    message: str = "Resource created successfully"
