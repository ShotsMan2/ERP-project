from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ProductCreate(BaseModel):
    name: str
    sku: str
    barcode: Optional[str] = None
    product_type: str = "goods"
    unit: str = "pcs"
    sale_price: float = 0.0
    cost_price: float = 0.0
    category_id: Optional[str] = None
    company_id: Optional[str] = None
    description: Optional[str] = None
    attributes: Optional[dict] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    barcode: Optional[str] = None
    product_type: Optional[str] = None
    unit: Optional[str] = None
    sale_price: Optional[float] = None
    cost_price: Optional[float] = None
    category_id: Optional[str] = None
    description: Optional[str] = None
    attributes: Optional[dict] = None
    is_active: Optional[bool] = None


class ProductResponse(BaseModel):
    id: str
    name: str
    sku: str
    barcode: Optional[str] = None
    product_type: str
    unit: str
    sale_price: float
    cost_price: float
    category_id: Optional[str] = None
    company_id: Optional[str] = None
    description: Optional[str] = None
    attributes: Optional[dict] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class VariantCreate(BaseModel):
    name: str
    sku: str
    attributes: Optional[dict] = None
    price_adjustment: float = 0.0


class VariantResponse(BaseModel):
    id: str
    product_id: str
    name: str
    sku: str
    attributes: Optional[dict] = None
    price_adjustment: float
    is_active: bool

    model_config = {"from_attributes": True}


class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[str] = None
    company_id: Optional[str] = None


class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class CategoryTree(BaseModel):
    id: str
    name: str
    slug: str
    children: list["CategoryTree"] = []

    model_config = {"from_attributes": True}
