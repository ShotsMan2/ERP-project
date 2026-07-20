import uuid
from datetime import date
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.employees.models import Employee
from app.modules.employees.repository import EmployeeRepository


class EmployeeService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = EmployeeRepository(db)

    async def create_employee(self, data: dict) -> Employee:
        existing = await self.repo.get_by_code(data["employee_code"])
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Employee code already exists")
        if data.get("department_id"):
            data["department_id"] = uuid.UUID(data["department_id"])
        if data.get("company_id"):
            data["company_id"] = uuid.UUID(data["company_id"])
        if data.get("reports_to"):
            data["reports_to"] = uuid.UUID(data["reports_to"])
        return await self.repo.create(**data)

    async def get_employee(self, employee_id: uuid.UUID) -> Employee:
        emp = await self.repo.get_by_id(employee_id)
        if not emp:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
        return emp

    async def update_employee(self, employee_id: uuid.UUID, data: dict) -> Employee:
        emp = await self.get_employee(employee_id)
        if data.get("department_id"):
            data["department_id"] = uuid.UUID(data["department_id"])
        if data.get("reports_to"):
            data["reports_to"] = uuid.UUID(data["reports_to"])
        return await self.repo.update(emp, **data)

    async def delete_employee(self, employee_id: uuid.UUID) -> None:
        emp = await self.get_employee(employee_id)
        await self.repo.update(emp, status="terminated", termination_date=date.today(), is_active=False)

    async def list_employees(self, company_id: uuid.UUID | None = None, department_id: uuid.UUID | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Employee], int]:
        return await self.repo.list(company_id=company_id, department_id=department_id, status=status, skip=skip, limit=limit)

    async def get_org_chart(self, company_id: uuid.UUID) -> list[dict]:
        employees = await self.repo.get_org_chart(company_id)
        emp_map = {str(e.id): {"id": str(e.id), "name": f"{e.first_name} {e.last_name}", "job_title": e.job_title, "children": []} for e in employees}
        roots = []
        for e in employees:
            node = emp_map[str(e.id)]
            if e.reports_to and str(e.reports_to) in emp_map:
                emp_map[str(e.reports_to)]["children"].append(node)
            else:
                roots.append(node)
        return roots
