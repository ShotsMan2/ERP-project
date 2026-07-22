from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class BackupCreate(BaseModel):
    type: str = "full"
    company_id: Optional[str] = None


class BackupUpdate(BaseModel):
    status: Optional[str] = None
    size_bytes: Optional[float] = None
    error_message: Optional[str] = None
    completed_at: Optional[datetime] = None


class BackupResponse(BaseModel):
    id: str
    filename: str
    type: str
    size_bytes: Optional[float] = None
    status: str
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    restored_at: Optional[datetime] = None
    restored_by: Optional[str] = None
    created_by: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class HealthCheckResponse(BaseModel):
    id: str
    service_name: str
    status: str
    latency_ms: Optional[float] = None
    error_message: Optional[str] = None
    checked_at: datetime

    model_config = {"from_attributes": True}


class SystemHealthSummary(BaseModel):
    status: str
    uptime_hours: float
    services: list[HealthCheckResponse]
    healthy_count: int
    degraded_count: int
    down_count: int


class QueueTaskResponse(BaseModel):
    id: str
    task_id: str
    queue_name: str
    task_name: str
    status: str
    retry_count: int
    max_retries: int
    priority: int
    error_message: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class QueueSummary(BaseModel):
    queue_name: str
    pending: int
    processing: int
    completed: int
    failed: int
    total: int


class ActivityLogResponse(BaseModel):
    id: str
    user_email: Optional[str] = None
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    module: str
    details: Optional[str] = None
    ip_address: Optional[str] = None
    duration_ms: Optional[int] = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class SystemOverview(BaseModel):
    total_users: int
    total_companies: int
    active_sessions: int
    pending_tasks: int
    failed_tasks: int
    storage_used_gb: float
    api_requests_24h: int
    error_rate_24h: float
    avg_response_time_ms: float
    uptime_percentage: float
