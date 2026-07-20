import uuid
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.inventory.models import Warehouse, Location, Bin, StockLevel, StockMovement


class WarehouseRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, wh_id: uuid.UUID) -> Optional[Warehouse]:
        result = await self.db.execute(select(Warehouse).where(Warehouse.id == wh_id, Warehouse.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None) -> list[Warehouse]:
        query = select(Warehouse).where(Warehouse.deleted_at.is_(None))
        if company_id:
            query = query.where(Warehouse.company_id == company_id)
        result = await self.db.execute(query.order_by(Warehouse.name))
        return result.scalars().all()

    async def create(self, **kwargs) -> Warehouse:
        wh = Warehouse(**kwargs)
        self.db.add(wh)
        await self.db.flush()
        return wh

    async def update(self, wh: Warehouse, **kwargs) -> Warehouse:
        for key, value in kwargs.items():
            if value is not None:
                setattr(wh, key, value)
        await self.db.flush()
        return wh

    async def delete(self, wh: Warehouse) -> None:
        from datetime import datetime, timezone
        wh.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()


class InventoryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_stock_level(self, product_id: uuid.UUID, bin_id: uuid.UUID) -> Optional[StockLevel]:
        result = await self.db.execute(select(StockLevel).where(StockLevel.product_id == product_id, StockLevel.bin_id == bin_id, StockLevel.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list_stock_levels(self, product_id: uuid.UUID | None = None, bin_id: uuid.UUID | None = None, low_stock: bool = False, threshold: float = 10.0) -> list[StockLevel]:
        query = select(StockLevel).where(StockLevel.deleted_at.is_(None))
        if product_id:
            query = query.where(StockLevel.product_id == product_id)
        if bin_id:
            query = query.where(StockLevel.bin_id == bin_id)
        if low_stock:
            query = query.where(StockLevel.quantity < threshold)
        result = await self.db.execute(query.order_by(StockLevel.quantity))
        return result.scalars().all()

    async def adjust_stock(self, product_id: uuid.UUID, bin_id: uuid.UUID, quantity: float, reason: str, user_id: uuid.UUID | None = None) -> StockLevel:
        level = await self.get_stock_level(product_id, bin_id)
        if not level:
            level = StockLevel(product_id=product_id, bin_id=bin_id, quantity=0)
            self.db.add(level)
        old_qty = level.quantity
        level.quantity = quantity
        level.last_counted_at = func.now()
        movement = StockMovement(product_id=product_id, to_bin_id=bin_id, quantity=quantity - old_qty, type="adjustment", reason=reason, created_by=user_id)
        self.db.add(movement)
        await self.db.flush()
        return level

    async def transfer_stock(self, from_bin_id: uuid.UUID, to_bin_id: uuid.UUID, product_id: uuid.UUID, quantity: float, reason: str | None, user_id: uuid.UUID | None = None) -> tuple[StockLevel, StockLevel]:
        from_level = await self.get_stock_level(product_id, from_bin_id)
        if not from_level or from_level.quantity < quantity:
            raise ValueError("Insufficient stock")
        to_level = await self.get_stock_level(product_id, to_bin_id)
        if not to_level:
            to_level = StockLevel(product_id=product_id, bin_id=to_bin_id, quantity=0)
            self.db.add(to_level)
        from_level.quantity -= quantity
        to_level.quantity += quantity
        movement = StockMovement(product_id=product_id, from_bin_id=from_bin_id, to_bin_id=to_bin_id, quantity=quantity, type="transfer", reason=reason, created_by=user_id)
        self.db.add(movement)
        await self.db.flush()
        return from_level, to_level

    async def list_movements(self, product_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[StockMovement], int]:
        query = select(StockMovement)
        count_query = select(func.count(StockMovement.id))
        if product_id:
            query = query.where(StockMovement.product_id == product_id)
            count_query = count_query.where(StockMovement.product_id == product_id)
        query = query.offset(skip).limit(limit).order_by(StockMovement.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create_location(self, **kwargs) -> Location:
        loc = Location(**kwargs)
        self.db.add(loc)
        await self.db.flush()
        return loc

    async def create_bin(self, **kwargs) -> Bin:
        bin_obj = Bin(**kwargs)
        self.db.add(bin_obj)
        await self.db.flush()
        return bin_obj
