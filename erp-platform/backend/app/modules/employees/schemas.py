from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class EmployeeCreate(BaseModel):
    employee_code: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    hire_date: date
    job_title: Optional[str] = None
    grade: Optional[str] = None
    department_id: Optional[str] = None
    company_id: Optional[str] = None
    reports_to: Optional[str] = None
    salary: Optional[float] = None
    currency: str = "USD"
    address: Optional[str] = None
    emergency_contact: Optional[str] = None


class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    job_title: Optional[str] = None
    grade: Optional[str] = None
    department_id: Optional[str] = None
    reports_to: Optional[str] = None
    salary: Optional[float] = None
    currency: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    is_active: Optional[bool] = None


class EmployeeResponse(BaseModel):
    id: str
    employee_code: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    hire_date: date
    termination_date: Optional[date] = None
    status: str
    job_title: Optional[str] = None
    grade: Optional[str] = None
    department_id: Optional[str] = None
    company_id: Optional[str] = None
    reports_to: Optional[str] = None
    salary: Optional[float] = None
    currency: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class EmployeeDocumentResponse(BaseModel):
    id: str
    employee_id: str
    document_type: str
    file_name: str
    file_path: str
    mime_type: Optional[str] = None
    expiry_date: Optional[date] = None
    verified_at: Optional[date] = None

    model_config = {"from_attributes": True}
