from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class NotificationResponse(BaseModel):
    id: str
    type: str
    channel: str
    title: str
    body: Optional[str] = None
    data: Optional[dict] = None
    read_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class TemplateCreate(BaseModel):
    code: str
    channel: str
    subject: Optional[str] = None
    body: str
    variables: Optional[dict] = None
    company_id: Optional[str] = None


class TemplateResponse(BaseModel):
    id: str
    code: str
    channel: str
    subject: Optional[str] = None
    body: str
    variables: Optional[dict] = None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
