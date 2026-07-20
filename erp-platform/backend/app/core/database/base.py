from __future__ import annotations

from sqlalchemy.orm import DeclarativeBase

from app.core.database.mixins import (
    UUIDMixin,
    TimestampMixin,
    SoftDeleteMixin,
    AuditMixin,
    TenantMixin,
)


class Base(DeclarativeBase):
    pass


class TimestampMixin(TimestampMixin, Base):
    __abstract__ = True


class SoftDeleteMixin(SoftDeleteMixin, Base):
    __abstract__ = True


class AuditMixin(AuditMixin, Base):
    __abstract__ = True


class TenantMixin(TenantMixin, Base):
    __abstract__ = True
