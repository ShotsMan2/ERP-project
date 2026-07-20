from datetime import datetime
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import BaseModel


class Warehouse(BaseModel):
    __tablename__ = "warehouses"

    company_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("companies.id"), nullable=True)
    branch_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("branches.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    type: Mapped[str] = mapped_column(String(20), default="store")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    locations = relationship("Location", back_populates="warehouse", cascade="all, delete-orphan")


class Location(BaseModel):
    __tablename__ = "locations"

    warehouse_id: Mapped[str] = mapped_column(String(36), ForeignKey("warehouses.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    type: Mapped[str] = mapped_column(String(20), default="zone")

    warehouse = relationship("Warehouse", back_populates="locations")
    bins = relationship("Bin", back_populates="location", cascade="all, delete-orphan")


class Bin(BaseModel):
    __tablename__ = "bins"

    location_id: Mapped[str] = mapped_column(String(36), ForeignKey("locations.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    max_capacity: Mapped[float | None] = mapped_column(Float, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    location = relationship("Location", back_populates="bins")
    stock_levels = relationship("StockLevel", back_populates="bin", cascade="all, delete-orphan")


class StockLevel(BaseModel):
    __tablename__ = "stock_levels"

    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id"), nullable=False)
    bin_id: Mapped[str] = mapped_column(String(36), ForeignKey("bins.id"), nullable=False)
    quantity: Mapped[float] = mapped_column(Float, default=0.0)
    reserved_quantity: Mapped[float] = mapped_column(Float, default=0.0)
    last_counted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    bin = relationship("Bin", back_populates="stock_levels")


class StockMovement(BaseModel):
    __tablename__ = "stock_movements"

    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id"), nullable=False)
    from_bin_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("bins.id"), nullable=True)
    to_bin_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("bins.id"), nullable=True)
    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    type: Mapped[str] = mapped_column(String(30), nullable=False)
    reference_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    reference_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_by: Mapped[str | None] = mapped_column(String(36), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
