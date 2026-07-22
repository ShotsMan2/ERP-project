from datetime import datetime
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Index, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import BaseModel


class IntegrationProvider(BaseModel):
    __tablename__ = "integration_providers"

    company_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("companies.id"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    provider_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    api_endpoint: Mapped[str | None] = mapped_column(String(512), nullable=True)
    api_key_encrypted: Mapped[str | None] = mapped_column(Text, nullable=True)
    api_secret_encrypted: Mapped[str | None] = mapped_column(Text, nullable=True)
    webhook_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    config: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    last_sync_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    sync_status: Mapped[str] = mapped_column(String(20), default="idle", index=True)

    __table_args__ = (
        Index("idx_provider_company_type", "company_id", "provider_type"),
        Index("idx_provider_sync_status", "sync_status"),
    )


class IntegrationLog(BaseModel):
    __tablename__ = "integration_logs"

    provider_id: Mapped[str] = mapped_column(String(36), ForeignKey("integration_providers.id"), nullable=False, index=True)
    direction: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(20), default="pending", index=True)
    request_payload: Mapped[str | None] = mapped_column(Text, nullable=True)
    response_payload: Mapped[str | None] = mapped_column(Text, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    duration_ms: Mapped[float | None] = mapped_column(Float, nullable=True, index=True)
    retry_count: Mapped[int] = mapped_column(default=0)

    provider = relationship("IntegrationProvider", backref="logs")

    __table_args__ = (
        Index("idx_log_provider_created", "provider_id", "created_at"),
    )
