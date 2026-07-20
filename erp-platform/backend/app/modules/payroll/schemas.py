from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class PayrollRunCreate(BaseModel):
    company_id: str
    period_start: date
    period_end: date
    notes: Optional[str] = None


class PayrollRunResponse(BaseModel):
    id: str
    company_id: Optional[str] = None
    period_start: date
    period_end: date
    run_date: datetime
    status: str
    total_gross: float
    total_deductions: float
    total_net: float
    approved_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PayrollItemResponse(BaseModel):
    id: str
    payroll_run_id: str
    employee_id: str
    earnings: dict
    deductions: dict
    total_gross: float
    total_deductions: float
    total_net: float
    bank_account: Optional[str] = None
    paid_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
