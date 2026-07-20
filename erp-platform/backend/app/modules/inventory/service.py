import uuid
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.inventory.models import Warehouse, StockLevel
from app.modules.inventory.repository import WarehouseRepository, InventoryRepository


class WarehouseService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = WarehouseRepository(db)

    async def create_warehouse(self, data: dict) -> Warehouse:
        return await self.repo.create(**data)

    async def get_warehouse(self, wh_id: uuid.UUID) -> Warehouse:
        wh = await self.repo.get_by_id(wh_id)
        if not wh:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Warehouse not found")
        return wh

    async def update_warehouse(self, wh_id: uuid.UUID, data: dict) -> Warehouse:
        wh = await self.get_warehouse(wh_id)
        return await self.repo.update(wh, **data)

    async def delete_warehouse(self, wh_id: uuid.UUID) -> None:
        wh = await self.get_warehouse(wh_id)
        await self.repo.delete(wh)

    async def list_warehouses(self, company_id: uuid.UUID | None = None) -> list[Warehouse]:
        return await self.repo.list(company_id=company_id)


class InventoryService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = InventoryRepository(db)

    async def get_stock_levels(self, product_id: uuid.UUID | None = None, bin_id: uuid.UUID | None = None) -> list[dict]:
        levels = await self.repo.list_stock_levels(product_id=product_id, bin_id=bin_id)
        result = []
        for l in levels:
            result.append({
                "id": str(l.id),
                "product_id": str(l.product_id),
                "bin_id": str(l.bin_id),
                "quantity": l.quantity,
                "reserved_quantity": l.reserved_quantity,
                "available_quantity": l.quantity - l.reserved_quantity,
                "last_counted_at": l.last_counted_at,
            })
        return result

    async def adjust_stock(self, product_id: uuid.UUID, bin_id: uuid.UUID, quantity: float, reason: str, user_id: uuid.UUID | None = None) -> StockLevel:
        return await self.repo.adjust_stock(product_id, bin_id, quantity, reason, user_id)

    async def transfer_stock(self, from_bin_id: uuid.UUID, to_bin_id: uuid.UUID, product_id: uuid.UUID, quantity: float, reason: str | None = None, user_id: uuid.UUID | None = None) -> dict:
        try:
            from_level, to_level = await self.repo.transfer_stock(from_bin_id, to_bin_id, product_id, quantity, reason, user_id)
            return {"from": {"bin_id": str(from_bin_id), "quantity": from_level.quantity}, "to": {"bin_id": str(to_bin_id), "quantity": to_level.quantity}}
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    async def list_movements(self, product_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list, int]:
        return await self.repo.list_movements(product_id=product_id, skip=skip, limit=limit)

    async def get_low_stock(self, company_id: uuid.UUID | None = None, threshold: float = 10.0) -> list[dict]:
        levels = await self.repo.list_stock_levels(low_stock=True, threshold=threshold)
        return [{"id": str(l.id), "product_id": str(l.product_id), "bin_id": str(l.bin_id), "quantity": l.quantity, "available_quantity": l.quantity - l.reserved_quantity} for l in levels]

    async def physical_count(self, product_id: uuid.UUID, bin_id: uuid.UUID, counted_quantity: float, user_id: uuid.UUID | None = None) -> StockLevel:
        return await self.repo.adjust_stock(product_id, bin_id, counted_quantity, "physical_count", user_id)
