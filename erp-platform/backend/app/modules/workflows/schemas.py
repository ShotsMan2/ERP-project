from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class WorkflowCreate(BaseModel):
    name: str
    trigger_type: str
    trigger_config: Optional[dict] = None
    conditions: Optional[dict] = None
    actions: Optional[dict] = None
    company_id: Optional[str] = None


class WorkflowResponse(BaseModel):
    id: str
    name: str
    trigger_type: str
    trigger_config: Optional[dict] = None
    conditions: Optional[dict] = None
    actions: Optional[dict] = None
    is_active: bool
    version: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
