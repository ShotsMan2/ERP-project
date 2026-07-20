import uuid
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.employees.models import Employee, EmployeeDocument


class EmployeeRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, employee_id: uuid.UUID) -> Optional[Employee]:
        result = await self.db.execute(select(Employee).where(Employee.id == employee_id, Employee.deleted_at.is_(None)).options(selectinload(Employee.documents)))
        return result.scalar_one_or_none()

    async def get_by_code(self, code: str) -> Optional[Employee]:
        result = await self.db.execute(select(Employee).where(Employee.employee_code == code, Employee.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def get_by_user_id(self, user_id: uuid.UUID) -> Optional[Employee]:
        result = await self.db.execute(select(Employee).where(Employee.user_id == user_id, Employee.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None, department_id: uuid.UUID | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Employee], int]:
        query = select(Employee).where(Employee.deleted_at.is_(None))
        count_query = select(func.count(Employee.id)).where(Employee.deleted_at.is_(None))
        if company_id:
            query = query.where(Employee.company_id == company_id)
            count_query = count_query.where(Employee.company_id == company_id)
        if department_id:
            query = query.where(Employee.department_id == department_id)
            count_query = count_query.where(Employee.department_id == department_id)
        if status:
            query = query.where(Employee.status == status)
            count_query = count_query.where(Employee.status == status)
        query = query.offset(skip).limit(limit).order_by(Employee.hire_date.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> Employee:
        emp = Employee(**kwargs)
        self.db.add(emp)
        await self.db.flush()
        return emp

    async def update(self, emp: Employee, **kwargs) -> Employee:
        for key, value in kwargs.items():
            if value is not None:
                setattr(emp, key, value)
        await self.db.flush()
        return emp

    async def delete(self, emp: Employee) -> None:
        from datetime import datetime, timezone
        emp.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()

    async def get_org_chart(self, company_id: uuid.UUID) -> list[Employee]:
        result = await self.db.execute(select(Employee).where(Employee.company_id == company_id, Employee.deleted_at.is_(None), Employee.is_active == True).order_by(Employee.reports_to, Employee.first_name))
        return result.scalars().all()
