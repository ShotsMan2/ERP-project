from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class WarehouseCreate(BaseModel):
    company_id: str
    branch_id: Optional[str] = None
    name: str
    code: str
    address: Optional[str] = None
    type: str = "store"


class WarehouseResponse(BaseModel):
    id: str
    company_id: Optional[str] = None
    branch_id: Optional[str] = None
    name: str
    code: str
    address: Optional[str] = None
    type: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class LocationCreate(BaseModel):
    warehouse_id: str
    name: str
    code: str
    type: str = "zone"


class LocationResponse(BaseModel):
    id: str
    warehouse_id: str
    name: str
    code: str
    type: str
    created_at: datetime

    model_config = {"from_attributes": True}


class StockLevelResponse(BaseModel):
    id: str
    product_id: str
    bin_id: str
    quantity: float
    reserved_quantity: float
    available_quantity: float = 0.0
    last_counted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class StockMovementResponse(BaseModel):
    id: str
    product_id: str
    from_bin_id: Optional[str] = None
    to_bin_id: Optional[str] = None
    quantity: float
    type: str
    reference_type: Optional[str] = None
    reference_id: Optional[str] = None
    reason: Optional[str] = None
    created_by: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AdjustmentRequest(BaseModel):
    product_id: str
    bin_id: str
    quantity: float
    reason: str


class TransferRequest(BaseModel):
    product_id: str
    from_bin_id: str
    to_bin_id: str
    quantity: float
    reason: Optional[str] = None
