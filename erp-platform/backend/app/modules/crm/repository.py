import uuid
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.crm.models import Lead, Opportunity


class LeadRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, lead_id: uuid.UUID) -> Optional[Lead]:
        result = await self.db.execute(select(Lead).where(Lead.id == lead_id, Lead.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None, status: str | None = None, assigned_to: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Lead], int]:
        query = select(Lead).where(Lead.deleted_at.is_(None))
        count_query = select(func.count(Lead.id)).where(Lead.deleted_at.is_(None))
        if company_id:
            query = query.where(Lead.company_id == company_id)
            count_query = count_query.where(Lead.company_id == company_id)
        if status:
            query = query.where(Lead.status == status)
            count_query = count_query.where(Lead.status == status)
        if assigned_to:
            query = query.where(Lead.assigned_to == assigned_to)
            count_query = count_query.where(Lead.assigned_to == assigned_to)
        query = query.offset(skip).limit(limit).order_by(Lead.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> Lead:
        lead = Lead(**kwargs)
        self.db.add(lead)
        await self.db.flush()
        return lead

    async def update(self, lead: Lead, **kwargs) -> Lead:
        for key, value in kwargs.items():
            if value is not None:
                setattr(lead, key, value)
        await self.db.flush()
        return lead


class OpportunityRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, opp_id: uuid.UUID) -> Optional[Opportunity]:
        result = await self.db.execute(select(Opportunity).where(Opportunity.id == opp_id, Opportunity.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, assigned_to: uuid.UUID | None = None, stage: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Opportunity], int]:
        query = select(Opportunity).where(Opportunity.deleted_at.is_(None))
        count_query = select(func.count(Opportunity.id)).where(Opportunity.deleted_at.is_(None))
        if assigned_to:
            query = query.where(Opportunity.assigned_to == assigned_to)
            count_query = count_query.where(Opportunity.assigned_to == assigned_to)
        if stage:
            query = query.where(Opportunity.stage == stage)
            count_query = count_query.where(Opportunity.stage == stage)
        query = query.offset(skip).limit(limit).order_by(Opportunity.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> Opportunity:
        opp = Opportunity(**kwargs)
        self.db.add(opp)
        await self.db.flush()
        return opp

    async def update(self, opp: Opportunity, **kwargs) -> Opportunity:
        for key, value in kwargs.items():
            if value is not None:
                setattr(opp, key, value)
        await self.db.flush()
        return opp
