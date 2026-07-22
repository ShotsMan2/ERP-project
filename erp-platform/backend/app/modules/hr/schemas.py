from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    clock_in: Optional[datetime] = None
    clock_out: Optional[datetime] = None
    total_hours: Optional[float] = None
    break_minutes: Optional[int] = None
    geo_lat: Optional[float] = None
    geo_lng: Optional[float] = None
    method: Optional[str] = None


class AttendanceResponse(BaseModel):
    id: str
    employee_id: str
    date: date
    clock_in: Optional[datetime] = None
    clock_out: Optional[datetime] = None
    total_hours: Optional[float] = None
    break_minutes: Optional[int] = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class LeaveCreate(BaseModel):
    employee_id: str
    leave_type: str
    start_date: date
    end_date: date
    reason: Optional[str] = None


class LeaveResponse(BaseModel):
    id: str
    employee_id: str
    leave_type: str
    start_date: date
    end_date: date
    total_days: int
    status: str
    approved_by: Optional[str] = None
    reason: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class LeavePolicyCreate(BaseModel):
    name: str
    leave_type: str
    days_per_year: int
    carry_forward_limit: int = 0
    requires_approval: bool = True
    company_id: Optional[str] = None


class LeavePolicyResponse(BaseModel):
    id: str
    name: str
    leave_type: str
    days_per_year: int
    carry_forward_limit: int
    requires_approval: bool
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class PerformanceReviewCreate(BaseModel):
    employee_id: str
    reviewer_id: str
    period: str
    goals: Optional[dict] = None


class PerformanceReviewResponse(BaseModel):
    id: str
    employee_id: str
    reviewer_id: str
    period: str
    rating: Optional[float] = None
    goals: Optional[dict] = None
    feedback: Optional[str] = None
    status: str
    completed_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Recruitment Schemas ---

class JobPostingCreate(BaseModel):
    title: str
    department: str
    location: str
    description: str
    requirements: Optional[dict] = None

class JobPostingResponse(BaseModel):
    id: str
    title: str
    department: str
    location: str
    description: str
    requirements: Optional[dict] = None
    is_active: bool
    published_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}

class CandidateCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    resume_url: Optional[str] = None

class CandidateResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    resume_url: Optional[str] = None
    parsed_skills: Optional[dict] = None
    ai_summary: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}

class ApplicationCreate(BaseModel):
    candidate_id: str
    job_posting_id: str
    notes: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: str
    candidate_id: str
    job_posting_id: str
    stage: str
    ai_score: Optional[int] = None
    applied_at: datetime
    last_updated_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
