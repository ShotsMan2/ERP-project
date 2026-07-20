import uuid
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.crm.models import Lead, Opportunity
from app.modules.crm.repository import LeadRepository, OpportunityRepository


class LeadService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = LeadRepository(db)

    async def create_lead(self, data: dict) -> Lead:
        return await self.repo.create(**data)

    async def get_lead(self, lead_id: uuid.UUID) -> Lead:
        lead = await self.repo.get_by_id(lead_id)
        if not lead:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
        return lead

    async def update_lead(self, lead_id: uuid.UUID, data: dict) -> Lead:
        lead = await self.get_lead(lead_id)
        return await self.repo.update(lead, **data)

    async def list_leads(self, company_id: uuid.UUID | None = None, status: str | None = None, assigned_to: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Lead], int]:
        return await self.repo.list(company_id=company_id, status=status, assigned_to=assigned_to, skip=skip, limit=limit)

    async def convert_lead(self, lead_id: uuid.UUID, opportunity_data: dict) -> Opportunity:
        lead = await self.get_lead(lead_id)
        await self.repo.update(lead, status="converted")
        opp = Opportunity(lead_id=lead.id, name=opportunity_data.get("name", lead.company_name or lead.contact_name), stage="qualification", probability=0.1, assigned_to=lead.assigned_to)
        self.db.add(opp)
        await self.db.flush()
        return opp


class OpportunityService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = OpportunityRepository(db)

    async def create_opportunity(self, data: dict) -> Opportunity:
        if data.get("lead_id"):
            data["lead_id"] = uuid.UUID(data["lead_id"])
        if data.get("assigned_to"):
            data["assigned_to"] = uuid.UUID(data["assigned_to"])
        return await self.repo.create(**data)

    async def get_opportunity(self, opp_id: uuid.UUID) -> Opportunity:
        opp = await self.repo.get_by_id(opp_id)
        if not opp:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Opportunity not found")
        return opp

    async def update_opportunity(self, opp_id: uuid.UUID, data: dict) -> Opportunity:
        opp = await self.get_opportunity(opp_id)
        return await self.repo.update(opp, **data)

    async def update_stage(self, opp_id: uuid.UUID, stage: str) -> Opportunity:
        opp = await self.get_opportunity(opp_id)
        return await self.repo.update(opp, stage=stage)

    async def list_opportunities(self, assigned_to: uuid.UUID | None = None, stage: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Opportunity], int]:
        return await self.repo.list(assigned_to=assigned_to, stage=stage, skip=skip, limit=limit)
