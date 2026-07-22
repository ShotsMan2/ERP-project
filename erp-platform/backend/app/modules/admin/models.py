from datetime import datetime
from sqlalchemy import Boolean, DateTime, Float, Index, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.base import BaseModel


class SystemBackup(BaseModel):
    __tablename__ = "system_backups"

    company_id: Mapped[str | None] = mapped_column(String(36), nullable=True, index=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    size_bytes: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending", index=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_by: Mapped[str | None] = mapped_column(String(36), nullable=True)
    restored_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    restored_by: Mapped[str | None] = mapped_column(String(36), nullable=True)
    s3_key: Mapped[str | None] = mapped_column(String(512), nullable=True)
    checksum: Mapped[str | None] = mapped_column(String(64), nullable=True)

    __table_args__ = (
        Index("idx_backup_company_status", "company_id", "status"),
        Index("idx_backup_created_at", "created_at"),
    )


class SystemHealthCheck(BaseModel):
    __tablename__ = "system_health_checks"

    service_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    latency_ms: Mapped[float | None] = mapped_column(Float, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    checked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)

    __table_args__ = (
        Index("idx_health_service_checked", "service_name", "checked_at"),
    )


class QueueTask(BaseModel):
    __tablename__ = "system_queue_tasks"

    task_id: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    queue_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    task_name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending", index=True)
    args: Mapped[str | None] = mapped_column(Text, nullable=True)
    kwargs: Mapped[str | None] = mapped_column(Text, nullable=True)
    result: Mapped[str | None] = mapped_column(Text, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    retry_count: Mapped[int] = mapped_column(Integer, default=0)
    max_retries: Mapped[int] = mapped_column(Integer, default=3)
    priority: Mapped[int] = mapped_column(Integer, default=0)
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        Index("idx_queue_status_priority", "status", "priority"),
        Index("idx_queue_scheduled", "scheduled_at"),
    )


class ActivityLog(BaseModel):
    __tablename__ = "system_activity_logs"

    user_id: Mapped[str | None] = mapped_column(String(36), nullable=True, index=True)
    user_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    action: Mapped[str] = mapped_column(String(255), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    resource_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    module: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    details: Mapped[str | None] = mapped_column(Text, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(512), nullable=True)
    duration_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="success", index=True)

    __table_args__ = (
        Index("idx_activity_user", "user_id"),
        Index("idx_activity_module", "module", "created_at"),
        Index("idx_activity_resource", "resource_type", "resource_id"),
    )
