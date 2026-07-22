from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class IntegrationProviderCreate(BaseModel):
    name: str
    provider_type: str
    api_endpoint: Optional[str] = None
    api_key: Optional[str] = None
    api_secret: Optional[str] = None
    webhook_url: Optional[str] = None
    config: Optional[str] = None
    company_id: Optional[str] = None


class IntegrationProviderUpdate(BaseModel):
    name: Optional[str] = None
    api_endpoint: Optional[str] = None
    api_key: Optional[str] = None
    api_secret: Optional[str] = None
    webhook_url: Optional[str] = None
    config: Optional[str] = None
    is_active: Optional[bool] = None


class IntegrationProviderResponse(BaseModel):
    id: str
    name: str
    provider_type: str
    api_endpoint: Optional[str] = None
    webhook_url: Optional[str] = None
    config: Optional[str] = None
    is_active: bool
    last_sync_at: Optional[datetime] = None
    sync_status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class IntegrationLogResponse(BaseModel):
    id: str
    provider_id: str
    direction: str
    status: str
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    duration_ms: Optional[float] = None
    retry_count: int
    created_at: datetime

    model_config = {"from_attributes": True}


class SyncRequest(BaseModel):
    provider_id: str


class SyncResponse(BaseModel):
    message: str
    provider_id: str
    status: str
