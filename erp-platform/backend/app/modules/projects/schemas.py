from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[float] = None
    project_manager_id: Optional[str] = None
    priority: str = "medium"
    company_id: Optional[str] = None


class ProjectResponse(BaseModel):
    id: str
    name: str
    code: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: str
    budget: Optional[float] = None
    project_manager_id: Optional[str] = None
    priority: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    assignee_id: Optional[str] = None
    due_date: Optional[date] = None
    estimated_hours: Optional[float] = None
    parent_id: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee_id: Optional[str] = None
    due_date: Optional[date] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None


class TaskResponse(BaseModel):
    id: str
    project_id: str
    parent_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    assignee_id: Optional[str] = None
    due_date: Optional[date] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TimeEntryCreate(BaseModel):
    task_id: str
    employee_id: str
    date: date
    hours: float
    description: Optional[str] = None
    billable: bool = True


class TimeEntryResponse(BaseModel):
    id: str
    task_id: str
    employee_id: str
    date: date
    hours: float
    description: Optional[str] = None
    billable: bool
    approved_by: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
