import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.inventory.schemas import WarehouseCreate, WarehouseResponse, LocationCreate, LocationResponse, StockLevelResponse, StockMovementResponse, AdjustmentRequest, TransferRequest
from app.modules.inventory.service import WarehouseService, InventoryService

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.get("/stock-levels", response_model=list[StockLevelResponse])
async def get_stock_levels(product_id: str | None = Query(None), bin_id: str | None = Query(None), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("inventory.read"))):
    service = InventoryService(db)
    levels = await service.get_stock_levels(product_id=uuid.UUID(product_id) if product_id else None, bin_id=uuid.UUID(bin_id) if bin_id else None)
    return levels


@router.post("/adjustments", response_model=StockLevelResponse)
async def adjust_stock(body: AdjustmentRequest, user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("inventory.update"))):
    service = InventoryService(db)
    level = await service.adjust_stock(uuid.UUID(body.product_id), uuid.UUID(body.bin_id), body.quantity, body.reason, uuid.UUID(user_id))
    return StockLevelResponse.model_validate(level)


@router.post("/transfers")
async def transfer_stock(body: TransferRequest, user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("inventory.create"))):
    service = InventoryService(db)
    return await service.transfer_stock(uuid.UUID(body.from_bin_id), uuid.UUID(body.to_bin_id), uuid.UUID(body.product_id), body.quantity, body.reason, uuid.UUID(user_id))


@router.get("/movements", response_model=list[StockMovementResponse])
async def list_movements(product_id: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("inventory.read"))):
    service = InventoryService(db)
    items, _ = await service.list_movements(product_id=uuid.UUID(product_id) if product_id else None, skip=(page - 1) * size, limit=size)
    return [StockMovementResponse.model_validate(m) for m in items]


@router.get("/low-stock")
async def low_stock(threshold: float = Query(10.0), company_id: str | None = Query(None), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("inventory.read"))):
    service = InventoryService(db)
    return await service.get_low_stock(company_id=uuid.UUID(company_id) if company_id else None, threshold=threshold)


@router.post("/counts")
async def physical_count(body: AdjustmentRequest, user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("inventory.create"))):
    service = InventoryService(db)
    level = await service.physical_count(uuid.UUID(body.product_id), uuid.UUID(body.bin_id), body.quantity, uuid.UUID(user_id))
    return StockLevelResponse.model_validate(level)


# Warehouse CRUD
@router.get("/warehouses", response_model=list[WarehouseResponse])
async def list_warehouses(company_id: str | None = Query(None), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("inventory.read"))):
    service = WarehouseService(db)
    whs = await service.list_warehouses(company_id=uuid.UUID(company_id) if company_id else None)
    return [WarehouseResponse.model_validate(w) for w in whs]


@router.get("/warehouses/{wh_id}", response_model=WarehouseResponse)
async def get_warehouse(wh_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("inventory.read"))):
    service = WarehouseService(db)
    wh = await service.get_warehouse(uuid.UUID(wh_id))
    return WarehouseResponse.model_validate(wh)


@router.post("/warehouses", response_model=WarehouseResponse, status_code=201)
async def create_warehouse(body: WarehouseCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("inventory.create"))):
    service = WarehouseService(db)
    wh = await service.create_warehouse(body.model_dump(exclude_none=True))
    return WarehouseResponse.model_validate(wh)


@router.put("/warehouses/{wh_id}", response_model=WarehouseResponse)
async def update_warehouse(wh_id: str, body: dict, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("inventory.update"))):
    service = WarehouseService(db)
    wh = await service.update_warehouse(uuid.UUID(wh_id), body)
    return WarehouseResponse.model_validate(wh)


@router.delete("/warehouses/{wh_id}", status_code=204)
async def delete_warehouse(wh_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("inventory.delete"))):
    service = WarehouseService(db)
    await service.delete_warehouse(uuid.UUID(wh_id))
