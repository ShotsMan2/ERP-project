from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from app.config import settings


class AuditLogModel(DeclarativeBase):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    company_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("companies.id", ondelete="SET NULL"), nullable=True, index=True)
    user_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    event_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    resource_type: Mapped[str] = mapped_column(String(100), nullable=False)
    resource_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    changes: Mapped[str | None] = mapped_column(Text, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(500), nullable=True)
    correlation_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )


class AuditLogTracker:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def log(
        self,
        event_type: str,
        resource_type: str,
        resource_id: str | None = None,
        changes: dict[str, Any] | None = None,
        user_id: str | None = None,
        company_id: str | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
        correlation_id: str | None = None,
    ) -> None:
        if not settings.AUDIT_ENABLED:
            return
        entry = AuditLogModel(
            company_id=company_id,
            user_id=user_id,
            event_type=event_type,
            resource_type=resource_type,
            resource_id=resource_id,
            changes=json.dumps(changes, default=str) if changes else None,
            ip_address=ip_address,
            user_agent=user_agent,
            correlation_id=correlation_id,
        )
        self.db.add(entry)
        await self.db.flush()

    async def log_create(
        self,
        resource_type: str,
        resource_id: str,
        data: dict[str, Any],
        user_id: str | None = None,
        company_id: str | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
        correlation_id: str | None = None,
    ) -> None:
        await self.log(
            event_type=f"{resource_type}.created",
            resource_type=resource_type,
            resource_id=resource_id,
            changes={"after": data},
            user_id=user_id,
            company_id=company_id,
            ip_address=ip_address,
            user_agent=user_agent,
            correlation_id=correlation_id,
        )

    async def log_update(
        self,
        resource_type: str,
        resource_id: str,
        before: dict[str, Any],
        after: dict[str, Any],
        user_id: str | None = None,
        company_id: str | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
        correlation_id: str | None = None,
    ) -> None:
        await self.log(
            event_type=f"{resource_type}.updated",
            resource_type=resource_type,
            resource_id=resource_id,
            changes={"before": before, "after": after},
            user_id=user_id,
            company_id=company_id,
            ip_address=ip_address,
            user_agent=user_agent,
            correlation_id=correlation_id,
        )

    async def log_delete(
        self,
        resource_type: str,
        resource_id: str,
        data: dict[str, Any],
        user_id: str | None = None,
        company_id: str | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
        correlation_id: str | None = None,
    ) -> None:
        await self.log(
            event_type=f"{resource_type}.deleted",
            resource_type=resource_type,
            resource_id=resource_id,
            changes={"before": data},
            user_id=user_id,
            company_id=company_id,
            ip_address=ip_address,
            user_agent=user_agent,
            correlation_id=correlation_id,
        )


def audit_logger(db: AsyncSession) -> AuditLogTracker:
    return AuditLogTracker(db)
