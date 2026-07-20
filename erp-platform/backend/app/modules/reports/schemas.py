from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ReportRequest(BaseModel):
    report_type: str
    format: str = "json"
    company_id: Optional[str] = None
    filters: Optional[dict] = None
    schedule: Optional[str] = None


class ReportResponse(BaseModel):
    id: str
    report_type: str
    format: str
    status: str
    data: Optional[dict] = None
    file_url: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
