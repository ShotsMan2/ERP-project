import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.crm.schemas import LeadCreate, LeadResponse, OpportunityCreate, OpportunityUpdate, OpportunityResponse
from app.modules.crm.service import LeadService, OpportunityService

router = APIRouter(tags=["CRM"])


@router.get("/leads", response_model=list[LeadResponse])
async def list_leads(company_id: str | None = Query(None), status: str | None = Query(None), assigned_to: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("crm.read"))):
    service = LeadService(db)
    items, _ = await service.list_leads(
        company_id=uuid.UUID(company_id) if company_id else None,
        status=status,
        assigned_to=uuid.UUID(assigned_to) if assigned_to else None,
        skip=(page - 1) * size,
        limit=size,
    )
    return [LeadResponse.model_validate(l) for l in items]


@router.get("/leads/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("crm.read"))):
    service = LeadService(db)
    lead = await service.get_lead(uuid.UUID(lead_id))
    return LeadResponse.model_validate(lead)


@router.post("/leads", response_model=LeadResponse, status_code=201)
async def create_lead(body: LeadCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("crm.create"))):
    service = LeadService(db)
    lead = await service.create_lead(body.model_dump(exclude_none=True))
    return LeadResponse.model_validate(lead)


@router.put("/leads/{lead_id}", response_model=LeadResponse)
async def update_lead(lead_id: str, body: dict, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("crm.update"))):
    service = LeadService(db)
    lead = await service.update_lead(uuid.UUID(lead_id), body)
    return LeadResponse.model_validate(lead)


@router.post("/leads/{lead_id}/convert", response_model=OpportunityResponse)
async def convert_lead(lead_id: str, body: dict, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("crm.create"))):
    service = LeadService(db)
    opp = await service.convert_lead(uuid.UUID(lead_id), body)
    return OpportunityResponse.model_validate(opp)


@router.get("/opportunities", response_model=list[OpportunityResponse])
async def list_opportunities(assigned_to: str | None = Query(None), stage: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("crm.read"))):
    service = OpportunityService(db)
    items, _ = await service.list_opportunities(
        assigned_to=uuid.UUID(assigned_to) if assigned_to else None,
        stage=stage,
        skip=(page - 1) * size,
        limit=size,
    )
    return [OpportunityResponse.model_validate(o) for o in items]


@router.get("/opportunities/{opp_id}", response_model=OpportunityResponse)
async def get_opportunity(opp_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("crm.read"))):
    service = OpportunityService(db)
    opp = await service.get_opportunity(uuid.UUID(opp_id))
    return OpportunityResponse.model_validate(opp)


@router.post("/opportunities", response_model=OpportunityResponse, status_code=201)
async def create_opportunity(body: OpportunityCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("crm.create"))):
    service = OpportunityService(db)
    opp = await service.create_opportunity(body.model_dump(exclude_none=True))
    return OpportunityResponse.model_validate(opp)


@router.put("/opportunities/{opp_id}", response_model=OpportunityResponse)
async def update_opportunity(opp_id: str, body: OpportunityUpdate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("crm.update"))):
    service = OpportunityService(db)
    opp = await service.update_opportunity(uuid.UUID(opp_id), body.model_dump(exclude_none=True))
    return OpportunityResponse.model_validate(opp)


@router.put("/opportunities/{opp_id}/stage", response_model=OpportunityResponse)
async def update_opportunity_stage(opp_id: str, body: dict, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("crm.update"))):
    service = OpportunityService(db)
    opp = await service.update_stage(uuid.UUID(opp_id), body.get("stage", ""))
    return OpportunityResponse.model_validate(opp)
