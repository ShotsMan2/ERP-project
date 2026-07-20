import uuid
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.purchasing.models import Supplier, PurchaseOrder, POLine, GoodsReceipt, GRNLine


class SupplierRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, supplier_id: uuid.UUID) -> Optional[Supplier]:
        result = await self.db.execute(select(Supplier).where(Supplier.id == supplier_id, Supplier.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def get_by_code(self, code: str) -> Optional[Supplier]:
        result = await self.db.execute(select(Supplier).where(Supplier.code == code, Supplier.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Supplier], int]:
        query = select(Supplier).where(Supplier.deleted_at.is_(None))
        count_query = select(func.count(Supplier.id)).where(Supplier.deleted_at.is_(None))
        if company_id:
            query = query.where(Supplier.company_id == company_id)
            count_query = count_query.where(Supplier.company_id == company_id)
        query = query.offset(skip).limit(limit).order_by(Supplier.name)
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> Supplier:
        supplier = Supplier(**kwargs)
        self.db.add(supplier)
        await self.db.flush()
        return supplier

    async def update(self, supplier: Supplier, **kwargs) -> Supplier:
        for key, value in kwargs.items():
            if value is not None:
                setattr(supplier, key, value)
        await self.db.flush()
        return supplier


class PurchaseOrderRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, po_id: uuid.UUID) -> Optional[PurchaseOrder]:
        result = await self.db.execute(select(PurchaseOrder).where(PurchaseOrder.id == po_id, PurchaseOrder.deleted_at.is_(None)).options(selectinload(PurchaseOrder.lines), selectinload(PurchaseOrder.supplier)))
        return result.scalar_one_or_none()

    async def get_by_order_number(self, order_number: str) -> Optional[PurchaseOrder]:
        result = await self.db.execute(select(PurchaseOrder).where(PurchaseOrder.order_number == order_number, PurchaseOrder.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[PurchaseOrder], int]:
        query = select(PurchaseOrder).where(PurchaseOrder.deleted_at.is_(None))
        count_query = select(func.count(PurchaseOrder.id)).where(PurchaseOrder.deleted_at.is_(None))
        if company_id:
            query = query.where(PurchaseOrder.company_id == company_id)
            count_query = count_query.where(PurchaseOrder.company_id == company_id)
        if status:
            query = query.where(PurchaseOrder.status == status)
            count_query = count_query.where(PurchaseOrder.status == status)
        query = query.offset(skip).limit(limit).order_by(PurchaseOrder.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> PurchaseOrder:
        po = PurchaseOrder(**kwargs)
        self.db.add(po)
        await self.db.flush()
        return po

    async def update(self, po: PurchaseOrder, **kwargs) -> PurchaseOrder:
        for key, value in kwargs.items():
            if value is not None:
                setattr(po, key, value)
        await self.db.flush()
        return po

    async def create_line(self, **kwargs) -> POLine:
        line = POLine(**kwargs)
        self.db.add(line)
        await self.db.flush()
        return line


class GoodsReceiptRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, gr_id: uuid.UUID) -> Optional[GoodsReceipt]:
        result = await self.db.execute(select(GoodsReceipt).where(GoodsReceipt.id == gr_id, GoodsReceipt.deleted_at.is_(None)).options(selectinload(GoodsReceipt.lines)))
        return result.scalar_one_or_none()

    async def create(self, **kwargs) -> GoodsReceipt:
        gr = GoodsReceipt(**kwargs)
        self.db.add(gr)
        await self.db.flush()
        return gr

    async def create_line(self, **kwargs) -> GRNLine:
        line = GRNLine(**kwargs)
        self.db.add(line)
        await self.db.flush()
        return line

    async def update(self, gr: GoodsReceipt, **kwargs) -> GoodsReceipt:
        for key, value in kwargs.items():
            if value is not None:
                setattr(gr, key, value)
        await self.db.flush()
        return gr
