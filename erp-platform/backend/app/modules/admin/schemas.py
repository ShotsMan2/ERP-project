from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class BackupCreate(BaseModel):
    type: str = "full"
    company_id: Optional[str] = None


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
