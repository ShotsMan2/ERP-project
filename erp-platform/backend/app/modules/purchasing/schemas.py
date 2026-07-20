from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class SupplierCreate(BaseModel):
    name: str
    code: str
    tax_id: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    payment_terms: Optional[str] = None
    currency: str = "USD"
    company_id: Optional[str] = None


class SupplierResponse(BaseModel):
    id: str
    name: str
    code: str
    tax_id: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    payment_terms: Optional[str] = None
    currency: str
    rating: Optional[float] = None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class POLineCreate(BaseModel):
    product_id: Optional[str] = None
    description: str
    quantity: float
    unit_price: float
    tax_rate: float = 0.0


class POCreate(BaseModel):
    supplier_id: str
    order_number: str
    order_date: date
    expected_date: Optional[date] = None
    currency: str = "USD"
    notes: Optional[str] = None
    company_id: Optional[str] = None
    lines: list[POLineCreate]


class POUpdate(BaseModel):
    expected_date: Optional[date] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class POLineResponse(BaseModel):
    id: str
    product_id: Optional[str] = None
    description: str
    quantity: float
    unit_price: float
    tax_rate: float
    received_quantity: float
    total: float

    model_config = {"from_attributes": True}


class POResponse(BaseModel):
    id: str
    supplier_id: str
    order_number: str
    status: str
    order_date: date
    expected_date: Optional[date] = None
    total_amount: float
    currency: str
    approved_by: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    lines: list[POLineResponse] = []

    model_config = {"from_attributes": True}


class GRNLineCreate(BaseModel):
    po_line_id: str
    product_id: Optional[str] = None
    quantity_received: float
    bin_id: Optional[str] = None


class GoodsReceiptCreate(BaseModel):
    purchase_order_id: str
    receipt_number: str
    lines: list[GRNLineCreate]


class GoodsReceiptResponse(BaseModel):
    id: str
    purchase_order_id: str
    receipt_number: str
    received_date: date
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
