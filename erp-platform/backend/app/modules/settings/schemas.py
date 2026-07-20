from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class SystemConfigUpdate(BaseModel):
    key: str
    value: dict | str | int | float | bool


class SystemConfigResponse(BaseModel):
    id: str
    key: str
    value: dict | str | int | float | bool
    description: Optional[str] = None
    updated_at: datetime
