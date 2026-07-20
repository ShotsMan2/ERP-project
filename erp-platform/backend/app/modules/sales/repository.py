import uuid
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.sales.models import Customer, SalesOrder, SOLine, Shipment, ShipmentLine


class CustomerRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, customer_id: uuid.UUID) -> Optional[Customer]:
        result = await self.db.execute(select(Customer).where(Customer.id == customer_id, Customer.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def get_by_code(self, code: str) -> Optional[Customer]:
        result = await self.db.execute(select(Customer).where(Customer.code == code, Customer.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Customer], int]:
        query = select(Customer).where(Customer.deleted_at.is_(None))
        count_query = select(func.count(Customer.id)).where(Customer.deleted_at.is_(None))
        if company_id:
            query = query.where(Customer.company_id == company_id)
            count_query = count_query.where(Customer.company_id == company_id)
        query = query.offset(skip).limit(limit).order_by(Customer.name)
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> Customer:
        customer = Customer(**kwargs)
        self.db.add(customer)
        await self.db.flush()
        return customer

    async def update(self, customer: Customer, **kwargs) -> Customer:
        for key, value in kwargs.items():
            if value is not None:
                setattr(customer, key, value)
        await self.db.flush()
        return customer


class SalesOrderRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, so_id: uuid.UUID) -> Optional[SalesOrder]:
        result = await self.db.execute(select(SalesOrder).where(SalesOrder.id == so_id, SalesOrder.deleted_at.is_(None)).options(selectinload(SalesOrder.lines), selectinload(SalesOrder.customer)))
        return result.scalar_one_or_none()

    async def get_by_order_number(self, order_number: str) -> Optional[SalesOrder]:
        result = await self.db.execute(select(SalesOrder).where(SalesOrder.order_number == order_number, SalesOrder.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None, customer_id: uuid.UUID | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[SalesOrder], int]:
        query = select(SalesOrder).where(SalesOrder.deleted_at.is_(None))
        count_query = select(func.count(SalesOrder.id)).where(SalesOrder.deleted_at.is_(None))
        if company_id:
            query = query.where(SalesOrder.company_id == company_id)
            count_query = count_query.where(SalesOrder.company_id == company_id)
        if customer_id:
            query = query.where(SalesOrder.customer_id == customer_id)
            count_query = count_query.where(SalesOrder.customer_id == customer_id)
        if status:
            query = query.where(SalesOrder.status == status)
            count_query = count_query.where(SalesOrder.status == status)
        query = query.offset(skip).limit(limit).order_by(SalesOrder.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> SalesOrder:
        so = SalesOrder(**kwargs)
        self.db.add(so)
        await self.db.flush()
        return so

    async def update(self, so: SalesOrder, **kwargs) -> SalesOrder:
        for key, value in kwargs.items():
            if value is not None:
                setattr(so, key, value)
        await self.db.flush()
        return so

    async def create_line(self, **kwargs) -> SOLine:
        line = SOLine(**kwargs)
        self.db.add(line)
        await self.db.flush()
        return line


class ShipmentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, shipment_id: uuid.UUID) -> Optional[Shipment]:
        result = await self.db.execute(select(Shipment).where(Shipment.id == shipment_id, Shipment.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def create(self, **kwargs) -> Shipment:
        shipment = Shipment(**kwargs)
        self.db.add(shipment)
        await self.db.flush()
        return shipment

    async def create_line(self, **kwargs) -> ShipmentLine:
        line = ShipmentLine(**kwargs)
        self.db.add(line)
        await self.db.flush()
        return line

    async def list_by_so(self, so_id: uuid.UUID) -> list[Shipment]:
        result = await self.db.execute(select(Shipment).where(Shipment.sales_order_id == so_id, Shipment.deleted_at.is_(None)))
        return result.scalars().all()
