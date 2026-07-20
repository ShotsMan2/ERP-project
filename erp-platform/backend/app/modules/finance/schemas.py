from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class BankAccountCreate(BaseModel):
    name: str
    account_number: str
    iban: Optional[str] = None
    swift: Optional[str] = None
    currency: str = "USD"
    balance: float = 0.0
    company_id: Optional[str] = None


class BankAccountResponse(BaseModel):
    id: str
    name: str
    account_number: str
    iban: Optional[str] = None
    swift: Optional[str] = None
    currency: str
    balance: float
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class BankTransactionResponse(BaseModel):
    id: str
    bank_account_id: str
    payment_id: Optional[str] = None
    transaction_date: date
    description: Optional[str] = None
    debit: float
    credit: float
    balance: float
    status: str
    reconciled: bool

    model_config = {"from_attributes": True}


class BudgetCreate(BaseModel):
    account_id: str
    department_id: Optional[str] = None
    fiscal_year_id: Optional[str] = None
    budgeted_amount: float
    notes: Optional[str] = None
    company_id: Optional[str] = None


class BudgetResponse(BaseModel):
    id: str
    account_id: str
    department_id: Optional[str] = None
    fiscal_year_id: Optional[str] = None
    budgeted_amount: float
    actual_amount: float
    notes: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
