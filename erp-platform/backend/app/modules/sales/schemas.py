from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class CustomerCreate(BaseModel):
    name: str
    code: str
    tax_id: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    payment_terms: Optional[str] = None
    currency: str = "USD"
    credit_limit: Optional[float] = None
    segment: Optional[str] = None
    company_id: Optional[str] = None


class CustomerResponse(BaseModel):
    id: str
    name: str
    code: str
    tax_id: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    payment_terms: Optional[str] = None
    currency: str
    credit_limit: Optional[float] = None
    segment: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SOLineCreate(BaseModel):
    product_id: Optional[str] = None
    description: str
    quantity: float
    unit_price: float
    discount_percent: float = 0.0
    tax_rate: float = 0.0


class SalesOrderCreate(BaseModel):
    customer_id: str
    order_number: str
    order_date: date
    delivery_date: Optional[date] = None
    discount: float = 0.0
    currency: str = "USD"
    notes: Optional[str] = None
    company_id: Optional[str] = None
    lines: list[SOLineCreate]


class SalesOrderUpdate(BaseModel):
    delivery_date: Optional[date] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class SOLineResponse(BaseModel):
    id: str
    product_id: Optional[str] = None
    description: str
    quantity: float
    unit_price: float
    discount_percent: float
    tax_rate: float
    total: float
    delivered_quantity: float

    model_config = {"from_attributes": True}


class SalesOrderResponse(BaseModel):
    id: str
    customer_id: str
    order_number: str
    status: str
    order_date: date
    delivery_date: Optional[date] = None
    total_amount: float
    discount: float
    tax_amount: float
    currency: str
    approved_by: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    lines: list[SOLineResponse] = []

    model_config = {"from_attributes": True}


class ShipmentCreate(BaseModel):
    sales_order_id: str
    shipment_number: str
    carrier: Optional[str] = None
    tracking_number: Optional[str] = None
    line_items: list[dict]


class ShipmentResponse(BaseModel):
    id: str
    sales_order_id: str
    shipment_number: str
    shipped_date: date
    carrier: Optional[str] = None
    tracking_number: Optional[str] = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
