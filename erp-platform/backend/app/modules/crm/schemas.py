from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class LeadCreate(BaseModel):
    contact_name: str
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    company_name: Optional[str] = None
    source: Optional[str] = None
    budget: Optional[float] = None
    timeline: Optional[str] = None
    notes: Optional[str] = None
    assigned_to: Optional[str] = None
    company_id: Optional[str] = None


class LeadResponse(BaseModel):
    id: str
    contact_name: str
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    company_name: Optional[str] = None
    source: Optional[str] = None
    status: str
    score: Optional[int] = None
    budget: Optional[float] = None
    timeline: Optional[str] = None
    notes: Optional[str] = None
    assigned_to: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class OpportunityCreate(BaseModel):
    lead_id: Optional[str] = None
    name: str
    stage: str = "qualification"
    probability: float = 0.0
    expected_revenue: float = 0.0
    close_date: Optional[date] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None


class OpportunityUpdate(BaseModel):
    name: Optional[str] = None
    stage: Optional[str] = None
    probability: Optional[float] = None
    expected_revenue: Optional[float] = None
    close_date: Optional[date] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None


class OpportunityResponse(BaseModel):
    id: str
    lead_id: Optional[str] = None
    name: str
    stage: str
    probability: float
    expected_revenue: float
    close_date: Optional[date] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
