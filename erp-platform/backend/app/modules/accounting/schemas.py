from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class AccountCreate(BaseModel):
    code: str
    name: str
    type: str
    parent_id: Optional[str] = None
    tax_code: Optional[str] = None
    description: Optional[str] = None
    company_id: Optional[str] = None


class AccountResponse(BaseModel):
    id: str
    code: str
    name: str
    type: str
    parent_id: Optional[str] = None
    is_active: bool
    tax_code: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class JournalEntryCreate(BaseModel):
    account_id: str
    debit_amount: float = 0.0
    credit_amount: float = 0.0
    description: Optional[str] = None
    cost_center_id: Optional[str] = None
    project_id: Optional[str] = None


class JournalCreate(BaseModel):
    journal_type: str
    reference: Optional[str] = None
    description: Optional[str] = None
    company_id: Optional[str] = None
    entries: list[JournalEntryCreate]


class JournalResponse(BaseModel):
    id: str
    journal_type: str
    reference: Optional[str] = None
    description: Optional[str] = None
    total_debit: float
    total_credit: float
    status: str
    posted_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class InvoiceLineCreate(BaseModel):
    product_id: Optional[str] = None
    description: str
    quantity: float
    unit_price: float
    tax_rate: float = 0.0


class InvoiceCreate(BaseModel):
    invoice_number: str
    type: str
    direction: str
    issue_date: date
    due_date: date
    currency: str = "USD"
    customer_id: Optional[str] = None
    supplier_id: Optional[str] = None
    notes: Optional[str] = None
    company_id: Optional[str] = None
    lines: list[InvoiceLineCreate]


class InvoiceResponse(BaseModel):
    id: str
    invoice_number: str
    type: str
    direction: str
    status: str
    issue_date: date
    due_date: date
    total_amount: float
    tax_amount: float
    paid_amount: float
    currency: str
    customer_id: Optional[str] = None
    supplier_id: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PaymentCreate(BaseModel):
    invoice_id: str
    bank_account_id: Optional[str] = None
    amount: float
    payment_date: date
    reference: Optional[str] = None


class TaxRateCreate(BaseModel):
    name: str
    code: str
    rate_percent: float
    type: str = "vat"
    company_id: Optional[str] = None
    effective_from: Optional[date] = None
    effective_to: Optional[date] = None


class TaxRateResponse(BaseModel):
    id: str
    name: str
    code: str
    rate_percent: float
    type: str
    is_active: bool
    effective_from: Optional[date] = None
    effective_to: Optional[date] = None

    model_config = {"from_attributes": True}
