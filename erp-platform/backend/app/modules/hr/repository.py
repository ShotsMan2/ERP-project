import uuid
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.hr.models import AttendanceRecord, Leave, LeavePolicy, PerformanceReview


class AttendanceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, att_id: uuid.UUID) -> Optional[AttendanceRecord]:
        result = await self.db.execute(select(AttendanceRecord).where(AttendanceRecord.id == att_id, AttendanceRecord.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, employee_id: uuid.UUID | None = None, from_date: date | None = None, to_date: date | None = None, skip: int = 0, limit: int = 100) -> tuple[list[AttendanceRecord], int]:
        query = select(AttendanceRecord).where(AttendanceRecord.deleted_at.is_(None))
        count_query = select(func.count(AttendanceRecord.id)).where(AttendanceRecord.deleted_at.is_(None))
        if employee_id:
            query = query.where(AttendanceRecord.employee_id == employee_id)
            count_query = count_query.where(AttendanceRecord.employee_id == employee_id)
        if from_date:
            query = query.where(AttendanceRecord.date >= from_date)
            count_query = count_query.where(AttendanceRecord.date >= from_date)
        if to_date:
            query = query.where(AttendanceRecord.date <= to_date)
            count_query = count_query.where(AttendanceRecord.date <= to_date)
        query = query.offset(skip).limit(limit).order_by(AttendanceRecord.date.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> AttendanceRecord:
        record = AttendanceRecord(**kwargs)
        self.db.add(record)
        await self.db.flush()
        return record


class LeaveRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, leave_id: uuid.UUID) -> Optional[Leave]:
        result = await self.db.execute(select(Leave).where(Leave.id == leave_id, Leave.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, employee_id: uuid.UUID | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Leave], int]:
        query = select(Leave).where(Leave.deleted_at.is_(None))
        count_query = select(func.count(Leave.id)).where(Leave.deleted_at.is_(None))
        if employee_id:
            query = query.where(Leave.employee_id == employee_id)
            count_query = count_query.where(Leave.employee_id == employee_id)
        if status:
            query = query.where(Leave.status == status)
            count_query = count_query.where(Leave.status == status)
        query = query.offset(skip).limit(limit).order_by(Leave.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> Leave:
        leave = Leave(**kwargs)
        self.db.add(leave)
        await self.db.flush()
        return leave

    async def update(self, leave: Leave, **kwargs) -> Leave:
        for key, value in kwargs.items():
            if value is not None:
                setattr(leave, key, value)
        await self.db.flush()
        return leave


class LeavePolicyRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, policy_id: uuid.UUID) -> Optional[LeavePolicy]:
        result = await self.db.execute(select(LeavePolicy).where(LeavePolicy.id == policy_id, LeavePolicy.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None) -> list[LeavePolicy]:
        query = select(LeavePolicy).where(LeavePolicy.deleted_at.is_(None))
        if company_id:
            query = query.where(LeavePolicy.company_id == company_id)
        result = await self.db.execute(query.order_by(LeavePolicy.name))
        return result.scalars().all()

    async def create(self, **kwargs) -> LeavePolicy:
        policy = LeavePolicy(**kwargs)
        self.db.add(policy)
        await self.db.flush()
        return policy

    async def update(self, policy: LeavePolicy, **kwargs) -> LeavePolicy:
        for key, value in kwargs.items():
            if value is not None:
                setattr(policy, key, value)
        await self.db.flush()
        return policy


class PerformanceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, review_id: uuid.UUID) -> Optional[PerformanceReview]:
        result = await self.db.execute(select(PerformanceReview).where(PerformanceReview.id == review_id, PerformanceReview.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, employee_id: uuid.UUID | None = None, reviewer_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[PerformanceReview], int]:
        query = select(PerformanceReview).where(PerformanceReview.deleted_at.is_(None))
        count_query = select(func.count(PerformanceReview.id)).where(PerformanceReview.deleted_at.is_(None))
        if employee_id:
            query = query.where(PerformanceReview.employee_id == employee_id)
            count_query = count_query.where(PerformanceReview.employee_id == employee_id)
        if reviewer_id:
            query = query.where(PerformanceReview.reviewer_id == reviewer_id)
            count_query = count_query.where(PerformanceReview.reviewer_id == reviewer_id)
        query = query.offset(skip).limit(limit).order_by(PerformanceReview.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> PerformanceReview:
        review = PerformanceReview(**kwargs)
        self.db.add(review)
        await self.db.flush()
        return review

    async def update(self, review: PerformanceReview, **kwargs) -> PerformanceReview:
        for key, value in kwargs.items():
            if value is not None:
                setattr(review, key, value)
        await self.db.flush()
        return review
