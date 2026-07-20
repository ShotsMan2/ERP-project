import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.hr.schemas import AttendanceCreate, AttendanceResponse, LeaveCreate, LeaveResponse, LeavePolicyCreate, LeavePolicyResponse, PerformanceReviewCreate, PerformanceReviewResponse
from app.modules.hr.service import AttendanceService, LeaveService, LeavePolicyService, PerformanceService

router = APIRouter(tags=["HR"])


@router.get("/attendance", response_model=list[AttendanceResponse])
async def list_attendance(employee_id: str | None = Query(None), from_date: str | None = Query(None), to_date: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("hr.read"))):
    service = AttendanceService(db)
    from datetime import date
    fd = date.fromisoformat(from_date) if from_date else None
    td = date.fromisoformat(to_date) if to_date else None
    items, _ = await service.list_attendance(employee_id=uuid.UUID(employee_id) if employee_id else None, from_date=fd, to_date=td, skip=(page - 1) * size, limit=size)
    return [AttendanceResponse.model_validate(a) for a in items]


@router.post("/attendance", response_model=AttendanceResponse, status_code=201)
async def create_attendance(body: AttendanceCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("hr.create"))):
    service = AttendanceService(db)
    record = await service.clock_in(uuid.UUID(body.employee_id), body.model_dump(exclude_none=True))
    return AttendanceResponse.model_validate(record)


@router.get("/leaves", response_model=list[LeaveResponse])
async def list_leaves(employee_id: str | None = Query(None), status: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("hr.read"))):
    service = LeaveService(db)
    items, _ = await service.list_leaves(employee_id=uuid.UUID(employee_id) if employee_id else None, status=status, skip=(page - 1) * size, limit=size)
    return [LeaveResponse.model_validate(l) for l in items]


@router.post("/leaves", response_model=LeaveResponse, status_code=201)
async def create_leave(body: LeaveCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("hr.create"))):
    service = LeaveService(db)
    leave = await service.create_leave(body.model_dump(exclude_none=True))
    return LeaveResponse.model_validate(leave)


@router.post("/leaves/{leave_id}/approve", response_model=LeaveResponse)
async def approve_leave(leave_id: str, user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("hr.update"))):
    service = LeaveService(db)
    leave = await service.approve_leave(uuid.UUID(leave_id), uuid.UUID(user_id))
    return LeaveResponse.model_validate(leave)


@router.get("/leave-policies", response_model=list[LeavePolicyResponse])
async def list_leave_policies(company_id: str | None = Query(None), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("hr.read"))):
    service = LeavePolicyService(db)
    policies = await service.list_policies(company_id=uuid.UUID(company_id) if company_id else None)
    return [LeavePolicyResponse.model_validate(p) for p in policies]


@router.post("/leave-policies", response_model=LeavePolicyResponse, status_code=201)
async def create_leave_policy(body: LeavePolicyCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("hr.create"))):
    service = LeavePolicyService(db)
    policy = await service.create_policy(body.model_dump(exclude_none=True))
    return LeavePolicyResponse.model_validate(policy)


@router.get("/performance-reviews", response_model=list[PerformanceReviewResponse])
async def list_reviews(employee_id: str | None = Query(None), reviewer_id: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("hr.read"))):
    service = PerformanceService(db)
    items, _ = await service.list_reviews(employee_id=uuid.UUID(employee_id) if employee_id else None, reviewer_id=uuid.UUID(reviewer_id) if reviewer_id else None, skip=(page - 1) * size, limit=size)
    return [PerformanceReviewResponse.model_validate(r) for r in items]


@router.post("/performance-reviews", response_model=PerformanceReviewResponse, status_code=201)
async def create_review(body: PerformanceReviewCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("hr.create"))):
    service = PerformanceService(db)
    review = await service.create_review(body.model_dump(exclude_none=True))
    return PerformanceReviewResponse.model_validate(review)
