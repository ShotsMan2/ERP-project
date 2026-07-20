import uuid
from datetime import date
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.purchasing.models import Supplier, PurchaseOrder, POLine, GoodsReceipt
from app.modules.purchasing.repository import SupplierRepository, PurchaseOrderRepository, GoodsReceiptRepository


class SupplierService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = SupplierRepository(db)

    async def create_supplier(self, data: dict) -> Supplier:
        existing = await self.repo.get_by_code(data["code"])
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Supplier code already exists")
        return await self.repo.create(**data)

    async def get_supplier(self, supplier_id: uuid.UUID) -> Supplier:
        supplier = await self.repo.get_by_id(supplier_id)
        if not supplier:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found")
        return supplier

    async def update_supplier(self, supplier_id: uuid.UUID, data: dict) -> Supplier:
        supplier = await self.get_supplier(supplier_id)
        return await self.repo.update(supplier, **data)

    async def list_suppliers(self, company_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Supplier], int]:
        return await self.repo.list(company_id=company_id, skip=skip, limit=limit)


class PurchaseOrderService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = PurchaseOrderRepository(db)

    async def create_po(self, data: dict) -> PurchaseOrder:
        existing = await self.repo.get_by_order_number(data["order_number"])
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Order number already exists")
        lines_data = data.pop("lines", [])
        po = await self.repo.create(**data)
        total = 0.0
        for line_data in lines_data:
            line_total = line_data["quantity"] * line_data["unit_price"]
            total += line_total
            await self.repo.create_line(purchase_order_id=po.id, **line_data, total=line_total)
        await self.repo.update(po, total_amount=total)
        return await self.repo.get_by_id(po.id)

    async def get_po(self, po_id: uuid.UUID) -> PurchaseOrder:
        po = await self.repo.get_by_id(po_id)
        if not po:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Purchase order not found")
        return po

    async def update_po(self, po_id: uuid.UUID, data: dict) -> PurchaseOrder:
        po = await self.get_po(po_id)
        return await self.repo.update(po, **data)

    async def approve_po(self, po_id: uuid.UUID, approver_id: uuid.UUID) -> PurchaseOrder:
        po = await self.get_po(po_id)
        return await self.repo.update(po, status="approved", approved_by=approver_id)

    async def list_pos(self, company_id: uuid.UUID | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[PurchaseOrder], int]:
        return await self.repo.list(company_id=company_id, status=status, skip=skip, limit=limit)


class GoodsReceiptService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.po_repo = PurchaseOrderRepository(db)
        self.repo = GoodsReceiptRepository(db)

    async def receive_goods(self, data: dict) -> GoodsReceipt:
        po_id = uuid.UUID(data["purchase_order_id"])
        po = await self.po_repo.get_by_id(po_id)
        if not po:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Purchase order not found")
        lines_data = data.pop("lines", [])
        gr = await self.repo.create(**data)
        for line_data in lines_data:
            po_line_id = uuid.UUID(line_data["po_line_id"])
            qty = line_data["quantity_received"]
            await self.repo.create_line(goods_receipt_id=gr.id, **line_data)
            for po_line in po.lines:
                if po_line.id == po_line_id:
                    po_line.received_quantity += qty
                    break
        all_received = all(abs(l.received_quantity - l.quantity) < 0.001 for l in po.lines)
        if all_received:
            await self.po_repo.update(po, status="received")
        await self.repo.update(gr, status="completed")
        return await self.repo.get_by_id(gr.id)
