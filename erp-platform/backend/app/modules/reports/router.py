from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.reports.schemas import ReportRequest, ReportResponse
from app.modules.reports.service import ReportService

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("")
async def list_reports(db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("reports.read"))):
    service = ReportService(db)
    return await service.list_reports()


@router.post("/generate", response_model=ReportResponse)
async def generate_report(body: ReportRequest, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("reports.create"))):
    service = ReportService(db)
    result = await service.generate_report(body.model_dump(exclude_none=True))
    return ReportResponse(**result)
