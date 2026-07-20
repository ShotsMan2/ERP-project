import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.payroll.schemas import PayrollRunCreate, PayrollRunResponse, PayrollItemResponse
from app.modules.payroll.service import PayrollService

router = APIRouter(prefix="/payroll", tags=["Payroll"])


@router.get("/runs", response_model=list[PayrollRunResponse])
async def list_runs(company_id: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("payroll.read"))):
    service = PayrollService(db)
    items, _ = await service.list_runs(company_id=uuid.UUID(company_id) if company_id else None, skip=(page - 1) * size, limit=size)
    return [PayrollRunResponse.model_validate(r) for r in items]


@router.get("/runs/{run_id}", response_model=PayrollRunResponse)
async def get_run(run_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("payroll.read"))):
    service = PayrollService(db)
    run = await service.get_run(uuid.UUID(run_id))
    return PayrollRunResponse.model_validate(run)


@router.post("/runs", response_model=PayrollRunResponse, status_code=201)
async def create_run(body: PayrollRunCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("payroll.create"))):
    service = PayrollService(db)
    run = await service.create_run(body.model_dump(exclude_none=True))
    return PayrollRunResponse.model_validate(run)


@router.post("/runs/{run_id}/process", response_model=PayrollRunResponse)
async def process_run(run_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("payroll.update"))):
    service = PayrollService(db)
    run = await service.process_run(uuid.UUID(run_id))
    return PayrollRunResponse.model_validate(run)


@router.get("/items", response_model=list[PayrollItemResponse])
async def list_items(run_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("payroll.read"))):
    service = PayrollService(db)
    items = await service.list_items(uuid.UUID(run_id))
    return [PayrollItemResponse.model_validate(i) for i in items]


@router.get("/payslips", response_model=list[PayrollItemResponse])
async def get_payslips(employee_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("payroll.read"))):
    service = PayrollService(db)
    items = await service.get_payslip(uuid.UUID(employee_id))
    return [PayrollItemResponse.model_validate(i) for i in items]
