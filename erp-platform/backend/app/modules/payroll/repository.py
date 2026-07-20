import uuid
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.payroll.models import PayrollRun, PayrollItem


class PayrollRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_run(self, **kwargs) -> PayrollRun:
        run = PayrollRun(**kwargs)
        self.db.add(run)
        await self.db.flush()
        return run

    async def get_run(self, run_id: uuid.UUID) -> Optional[PayrollRun]:
        result = await self.db.execute(select(PayrollRun).where(PayrollRun.id == run_id, PayrollRun.deleted_at.is_(None)).options(selectinload(PayrollRun.items)))
        return result.scalar_one_or_none()

    async def list_runs(self, company_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[PayrollRun], int]:
        query = select(PayrollRun).where(PayrollRun.deleted_at.is_(None))
        count_query = select(func.count(PayrollRun.id)).where(PayrollRun.deleted_at.is_(None))
        if company_id:
            query = query.where(PayrollRun.company_id == company_id)
            count_query = count_query.where(PayrollRun.company_id == company_id)
        query = query.offset(skip).limit(limit).order_by(PayrollRun.run_date.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def update_run(self, run: PayrollRun, **kwargs) -> PayrollRun:
        for key, value in kwargs.items():
            if value is not None:
                setattr(run, key, value)
        await self.db.flush()
        return run

    async def create_item(self, **kwargs) -> PayrollItem:
        item = PayrollItem(**kwargs)
        self.db.add(item)
        await self.db.flush()
        return item

    async def get_item(self, item_id: uuid.UUID) -> Optional[PayrollItem]:
        result = await self.db.execute(select(PayrollItem).where(PayrollItem.id == item_id, PayrollItem.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list_items(self, run_id: uuid.UUID) -> list[PayrollItem]:
        result = await self.db.execute(select(PayrollItem).where(PayrollItem.payroll_run_id == run_id, PayrollItem.deleted_at.is_(None)))
        return result.scalars().all()

    async def update_item(self, item: PayrollItem, **kwargs) -> PayrollItem:
        for key, value in kwargs.items():
            if value is not None:
                setattr(item, key, value)
        await self.db.flush()
        return item
