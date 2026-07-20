import uuid
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.sales.models import Customer, SalesOrder, Shipment
from app.modules.sales.repository import CustomerRepository, SalesOrderRepository, ShipmentRepository


class CustomerService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = CustomerRepository(db)

    async def create_customer(self, data: dict) -> Customer:
        existing = await self.repo.get_by_code(data["code"])
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Customer code already exists")
        return await self.repo.create(**data)

    async def get_customer(self, customer_id: uuid.UUID) -> Customer:
        customer = await self.repo.get_by_id(customer_id)
        if not customer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
        return customer

    async def update_customer(self, customer_id: uuid.UUID, data: dict) -> Customer:
        customer = await self.get_customer(customer_id)
        return await self.repo.update(customer, **data)

    async def list_customers(self, company_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Customer], int]:
        return await self.repo.list(company_id=company_id, skip=skip, limit=limit)

    async def get_360_view(self, customer_id: uuid.UUID) -> dict:
        customer = await self.get_customer(customer_id)
        so_repo = SalesOrderRepository(self.db)
        orders, _ = await so_repo.list(customer_id=customer_id)
        return {
            "customer": {"id": str(customer.id), "name": customer.name, "code": customer.code, "email": customer.email, "phone": customer.phone, "segment": customer.segment, "credit_limit": customer.credit_limit, "currency": customer.currency},
            "orders": [{"id": str(o.id), "order_number": o.order_number, "status": o.status, "total_amount": o.total_amount, "order_date": o.order_date} for o in orders],
            "total_orders": len(orders),
            "total_revenue": sum(o.total_amount for o in orders),
        }


class SalesOrderService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = SalesOrderRepository(db)

    async def create_so(self, data: dict) -> SalesOrder:
        existing = await self.repo.get_by_order_number(data["order_number"])
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Order number already exists")
        lines_data = data.pop("lines", [])
        so = await self.repo.create(**data)
        total = 0.0
        for line_data in lines_data:
            line_total = line_data["quantity"] * line_data["unit_price"] * (1 - line_data.get("discount_percent", 0) / 100)
            total += line_total
            await self.repo.create_line(sales_order_id=so.id, **line_data, total=line_total)
        tax_amount = total * 0.0
        await self.repo.update(so, total_amount=total - data.get("discount", 0), tax_amount=tax_amount)
        return await self.repo.get_by_id(so.id)

    async def get_so(self, so_id: uuid.UUID) -> SalesOrder:
        so = await self.repo.get_by_id(so_id)
        if not so:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sales order not found")
        return so

    async def update_so(self, so_id: uuid.UUID, data: dict) -> SalesOrder:
        so = await self.get_so(so_id)
        return await self.repo.update(so, **data)

    async def approve_so(self, so_id: uuid.UUID, approver_id: uuid.UUID) -> SalesOrder:
        so = await self.get_so(so_id)
        return await self.repo.update(so, status="approved", approved_by=approver_id)

    async def list_sos(self, company_id: uuid.UUID | None = None, customer_id: uuid.UUID | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[SalesOrder], int]:
        return await self.repo.list(company_id=company_id, customer_id=customer_id, status=status, skip=skip, limit=limit)


class ShipmentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.so_repo = SalesOrderRepository(db)
        self.repo = ShipmentRepository(db)

    async def create_shipment(self, data: dict) -> Shipment:
        so_id = uuid.UUID(data["sales_order_id"])
        so = await self.so_repo.get_by_id(so_id)
        if not so:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sales order not found")
        line_items = data.pop("line_items", [])
        shipment = await self.repo.create(**data)
        for item in line_items:
            so_line_id = uuid.UUID(item["so_line_id"])
            await self.repo.create_line(shipment_id=shipment.id, so_line_id=so_line_id, quantity=item["quantity"])
            for sol in so.lines:
                if sol.id == so_line_id:
                    sol.delivered_quantity += item["quantity"]
                    break
        all_delivered = all(abs(l.delivered_quantity - l.quantity) < 0.001 for l in so.lines)
        if all_delivered:
            await self.so_repo.update(so, status="shipped")
        return shipment
