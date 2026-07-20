import uuid
from datetime import date, datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.hr.models import AttendanceRecord, Leave, LeavePolicy, PerformanceReview
from app.modules.hr.repository import AttendanceRepository, LeaveRepository, LeavePolicyRepository, PerformanceRepository


class AttendanceService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = AttendanceRepository(db)

    async def clock_in(self, employee_id: uuid.UUID, data: dict) -> AttendanceRecord:
        data["employee_id"] = employee_id
        return await self.repo.create(**data)

    async def clock_out(self, record_id: uuid.UUID, data: dict) -> AttendanceRecord:
        record = await self.repo.get_by_id(record_id)
        if not record:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found")
        record.clock_out = data.get("clock_out", datetime.now(timezone.utc))
        if record.clock_in and record.clock_out:
            delta = record.clock_out - record.clock_in
            record.total_hours = round(delta.total_seconds() / 3600, 2)
        await self.db.flush()
        return record

    async def list_attendance(self, employee_id: uuid.UUID | None = None, from_date: date | None = None, to_date: date | None = None, skip: int = 0, limit: int = 100) -> tuple[list[AttendanceRecord], int]:
        return await self.repo.list(employee_id=employee_id, from_date=from_date, to_date=to_date, skip=skip, limit=limit)


class LeaveService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = LeaveRepository(db)

    async def create_leave(self, data: dict) -> Leave:
        start = data["start_date"]
        end = data["end_date"]
        data["total_days"] = (end - start).days + 1
        return await self.repo.create(**data)

    async def approve_leave(self, leave_id: uuid.UUID, approver_id: uuid.UUID) -> Leave:
        leave = await self.repo.get_by_id(leave_id)
        if not leave:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Leave not found")
        return await self.repo.update(leave, status="approved", approved_by=approver_id, approved_at=datetime.now(timezone.utc))

    async def reject_leave(self, leave_id: uuid.UUID) -> Leave:
        leave = await self.repo.get_by_id(leave_id)
        if not leave:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Leave not found")
        return await self.repo.update(leave, status="rejected")

    async def list_leaves(self, employee_id: uuid.UUID | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Leave], int]:
        return await self.repo.list(employee_id=employee_id, status=status, skip=skip, limit=limit)


class LeavePolicyService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = LeavePolicyRepository(db)

    async def create_policy(self, data: dict) -> LeavePolicy:
        return await self.repo.create(**data)

    async def list_policies(self, company_id: uuid.UUID | None = None) -> list[LeavePolicy]:
        return await self.repo.list(company_id=company_id)


class PerformanceService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = PerformanceRepository(db)

    async def create_review(self, data: dict) -> PerformanceReview:
        return await self.repo.create(**data)

    async def submit_review(self, review_id: uuid.UUID, data: dict) -> PerformanceReview:
        review = await self.repo.get_by_id(review_id)
        if not review:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
        return await self.repo.update(review, **data, status="completed", completed_at=datetime.now(timezone.utc))

    async def list_reviews(self, employee_id: uuid.UUID | None = None, reviewer_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[PerformanceReview], int]:
        return await self.repo.list(employee_id=employee_id, reviewer_id=reviewer_id, skip=skip, limit=limit)
