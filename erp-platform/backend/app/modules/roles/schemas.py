from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class PermissionResponse(BaseModel):
    id: str
    name: str
    code: str
    module: str
    action: str
    description: Optional[str] = None

    model_config = {"from_attributes": True}


class RoleCreate(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    is_active: bool = True


class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class RoleResponse(BaseModel):
    id: str
    name: str
    code: str
    description: Optional[str] = None
    is_system: bool
    is_active: bool
    company_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    permissions: list[PermissionResponse] = []

    model_config = {"from_attributes": True}


class RolePermissionUpdate(BaseModel):
    permission_ids: list[str]
