import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.payroll.models import PayrollRun, PayrollItem
from app.modules.payroll.repository import PayrollRepository


class PayrollService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = PayrollRepository(db)

    async def create_run(self, data: dict) -> PayrollRun:
        if data.get("company_id"):
            data["company_id"] = uuid.UUID(data["company_id"])
        return await self.repo.create_run(**data)

    async def get_run(self, run_id: uuid.UUID) -> PayrollRun:
        run = await self.repo.get_run(run_id)
        if not run:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payroll run not found")
        return run

    async def list_runs(self, company_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[PayrollRun], int]:
        return await self.repo.list_runs(company_id=company_id, skip=skip, limit=limit)

    async def process_run(self, run_id: uuid.UUID) -> PayrollRun:
        run = await self.get_run(run_id)
        if run.status != "draft":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Run already processed")
        from app.modules.employees.repository import EmployeeRepository
        emp_repo = EmployeeRepository(self.db)
        employees, _ = await emp_repo.list(company_id=run.company_id)
        total_gross = 0.0
        total_deductions = 0.0
        for emp in employees:
            if not emp.salary:
                continue
            gross = emp.salary
            deductions = gross * 0.12
            net = gross - deductions
            item = await self.repo.create_item(
                payroll_run_id=run.id,
                employee_id=emp.id,
                earnings={"base_salary": gross},
                deductions={"tax": gross * 0.10, "social_security": gross * 0.02},
                total_gross=gross,
                total_deductions=deductions,
                total_net=net,
            )
            total_gross += gross
            total_deductions += deductions
        return await self.repo.update_run(run, status="processed", total_gross=total_gross, total_deductions=total_deductions, total_net=total_gross - total_deductions)

    async def approve_run(self, run_id: uuid.UUID, approver_id: uuid.UUID) -> PayrollRun:
        run = await self.get_run(run_id)
        return await self.repo.update_run(run, status="approved", approved_by=approver_id)

    async def get_item(self, item_id: uuid.UUID) -> PayrollItem:
        item = await self.repo.get_item(item_id)
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payroll item not found")
        return item

    async def list_items(self, run_id: uuid.UUID) -> list[PayrollItem]:
        return await self.repo.list_items(run_id)

    async def get_payslip(self, employee_id: uuid.UUID) -> list[PayrollItem]:
        from sqlalchemy import select
        result = await self.db.execute(
            select(PayrollItem).where(PayrollItem.employee_id == employee_id, PayrollItem.deleted_at.is_(None))
        )
        return result.scalars().all()
