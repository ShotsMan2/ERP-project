from datetime import date, datetime
from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import BaseModel


class Customer(BaseModel):
    __tablename__ = "customers"

    company_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("companies.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    tax_id: Mapped[str | None] = mapped_column(String(50), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    payment_terms: Mapped[str | None] = mapped_column(String(100), nullable=True)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    credit_limit: Mapped[float | None] = mapped_column(Float, nullable=True)
    segment: Mapped[str | None] = mapped_column(String(50), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    sales_orders = relationship("SalesOrder", back_populates="customer", cascade="all, delete-orphan")


class SalesOrder(BaseModel):
    __tablename__ = "sales_orders"

    company_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("companies.id"), nullable=True)
    customer_id: Mapped[str] = mapped_column(String(36), ForeignKey("customers.id"), nullable=False)
    order_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="draft")
    order_date: Mapped[date] = mapped_column(Date, nullable=False)
    delivery_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    total_amount: Mapped[float] = mapped_column(Float, default=0.0)
    discount: Mapped[float] = mapped_column(Float, default=0.0)
    tax_amount: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    approved_by: Mapped[str | None] = mapped_column(String(36), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    customer = relationship("Customer", back_populates="sales_orders")
    lines = relationship("SOLine", back_populates="sales_order", cascade="all, delete-orphan")
    shipments = relationship("Shipment", back_populates="sales_order", cascade="all, delete-orphan")


class SOLine(BaseModel):
    __tablename__ = "so_lines"

    sales_order_id: Mapped[str] = mapped_column(String(36), ForeignKey("sales_orders.id"), nullable=False)
    product_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("products.id"), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    unit_price: Mapped[float] = mapped_column(Float, nullable=False)
    discount_percent: Mapped[float] = mapped_column(Float, default=0.0)
    tax_rate: Mapped[float] = mapped_column(Float, default=0.0)
    total: Mapped[float] = mapped_column(Float, default=0.0)
    delivered_quantity: Mapped[float] = mapped_column(Float, default=0.0)

    sales_order = relationship("SalesOrder", back_populates="lines")


class Shipment(BaseModel):
    __tablename__ = "shipments"

    sales_order_id: Mapped[str] = mapped_column(String(36), ForeignKey("sales_orders.id"), nullable=False)
    shipment_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    shipped_date: Mapped[date] = mapped_column(Date, server_default=func.current_date())
    carrier: Mapped[str | None] = mapped_column(String(100), nullable=True)
    tracking_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending")

    sales_order = relationship("SalesOrder", back_populates="shipments")
    lines = relationship("ShipmentLine", back_populates="shipment", cascade="all, delete-orphan")


class ShipmentLine(BaseModel):
    __tablename__ = "shipment_lines"

    shipment_id: Mapped[str] = mapped_column(String(36), ForeignKey("shipments.id"), nullable=False)
    so_line_id: Mapped[str] = mapped_column(String(36), ForeignKey("so_lines.id"), nullable=False)
    quantity: Mapped[float] = mapped_column(Float, nullable=False)

    shipment = relationship("Shipment", back_populates="lines")
