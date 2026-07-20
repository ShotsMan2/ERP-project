import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.purchasing.schemas import SupplierCreate, SupplierResponse, POCreate, POUpdate, POResponse, GoodsReceiptCreate, GoodsReceiptResponse
from app.modules.purchasing.service import SupplierService, PurchaseOrderService, GoodsReceiptService

router = APIRouter(tags=["Purchasing"])


@router.get("/suppliers", response_model=list[SupplierResponse])
async def list_suppliers(company_id: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("purchasing.read"))):
    service = SupplierService(db)
    items, _ = await service.list_suppliers(company_id=uuid.UUID(company_id) if company_id else None, skip=(page - 1) * size, limit=size)
    return [SupplierResponse.model_validate(s) for s in items]


@router.post("/suppliers", response_model=SupplierResponse, status_code=201)
async def create_supplier(body: SupplierCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("purchasing.create"))):
    service = SupplierService(db)
    supplier = await service.create_supplier(body.model_dump(exclude_none=True))
    return SupplierResponse.model_validate(supplier)


@router.get("/suppliers/{supplier_id}", response_model=SupplierResponse)
async def get_supplier(supplier_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("purchasing.read"))):
    service = SupplierService(db)
    supplier = await service.get_supplier(uuid.UUID(supplier_id))
    return SupplierResponse.model_validate(supplier)


@router.put("/suppliers/{supplier_id}", response_model=SupplierResponse)
async def update_supplier(supplier_id: str, body: dict, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("purchasing.update"))):
    service = SupplierService(db)
    supplier = await service.update_supplier(uuid.UUID(supplier_id), body)
    return SupplierResponse.model_validate(supplier)


@router.get("/purchase-orders", response_model=list[POResponse])
async def list_pos(company_id: str | None = Query(None), status: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("purchasing.read"))):
    service = PurchaseOrderService(db)
    items, _ = await service.list_pos(company_id=uuid.UUID(company_id) if company_id else None, status=status, skip=(page - 1) * size, limit=size)
    return [POResponse.model_validate(po) for po in items]


@router.get("/purchase-orders/{po_id}", response_model=POResponse)
async def get_po(po_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("purchasing.read"))):
    service = PurchaseOrderService(db)
    po = await service.get_po(uuid.UUID(po_id))
    return POResponse.model_validate(po)


@router.post("/purchase-orders", response_model=POResponse, status_code=201)
async def create_po(body: POCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("purchasing.create"))):
    service = PurchaseOrderService(db)
    po = await service.create_po(body.model_dump(exclude_none=True))
    return POResponse.model_validate(po)


@router.put("/purchase-orders/{po_id}", response_model=POResponse)
async def update_po(po_id: str, body: POUpdate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("purchasing.update"))):
    service = PurchaseOrderService(db)
    po = await service.update_po(uuid.UUID(po_id), body.model_dump(exclude_none=True))
    return POResponse.model_validate(po)


@router.post("/purchase-orders/{po_id}/approve", response_model=POResponse)
async def approve_po(po_id: str, user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("purchasing.approve"))):
    service = PurchaseOrderService(db)
    po = await service.approve_po(uuid.UUID(po_id), uuid.UUID(user_id))
    return POResponse.model_validate(po)


@router.post("/purchase-orders/{po_id}/receive", response_model=GoodsReceiptResponse)
async def receive_goods(po_id: str, body: GoodsReceiptCreate, user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("purchasing.receive"))):
    service = GoodsReceiptService(db)
    gr = await service.receive_goods(body.model_dump(exclude_none=True))
    return GoodsReceiptResponse.model_validate(gr)
