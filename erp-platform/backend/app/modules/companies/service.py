import uuid
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.companies.models import Company, Branch, Department
from app.modules.companies.repository import CompanyRepository, BranchRepository, DepartmentRepository


class CompanyService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.company_repo = CompanyRepository(db)

    async def create_company(self, data: dict) -> Company:
        if data.get("tax_id"):
            existing = await self.company_repo.get_by_tax_id(data["tax_id"])
            if existing:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Tax ID already exists")
        return await self.company_repo.create(**data)

    async def get_company(self, company_id: uuid.UUID) -> Company:
        company = await self.company_repo.get_by_id(company_id)
        if not company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        return company

    async def update_company(self, company_id: uuid.UUID, data: dict) -> Company:
        company = await self.get_company(company_id)
        return await self.company_repo.update(company, **data)

    async def delete_company(self, company_id: uuid.UUID) -> None:
        company = await self.get_company(company_id)
        await self.company_repo.delete(company)

    async def list_companies(self, skip: int = 0, limit: int = 100) -> tuple[list[Company], int]:
        return await self.company_repo.list(skip=skip, limit=limit)


class BranchService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.branch_repo = BranchRepository(db)

    async def create_branch(self, data: dict) -> Branch:
        return await self.branch_repo.create(**data)

    async def get_branch(self, branch_id: uuid.UUID) -> Branch:
        branch = await self.branch_repo.get_by_id(branch_id)
        if not branch:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Branch not found")
        return branch

    async def update_branch(self, branch_id: uuid.UUID, data: dict) -> Branch:
        branch = await self.get_branch(branch_id)
        return await self.branch_repo.update(branch, **data)

    async def delete_branch(self, branch_id: uuid.UUID) -> None:
        branch = await self.get_branch(branch_id)
        await self.branch_repo.delete(branch)

    async def list_branches(self, company_id: uuid.UUID) -> list[Branch]:
        return await self.branch_repo.list_by_company(company_id)


class DepartmentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.dept_repo = DepartmentRepository(db)

    async def create_department(self, data: dict) -> Department:
        if data.get("parent_id"):
            data["parent_id"] = uuid.UUID(data["parent_id"])
        return await self.dept_repo.create(**data)

    async def get_department(self, dept_id: uuid.UUID) -> Department:
        dept = await self.dept_repo.get_by_id(dept_id)
        if not dept:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found")
        return dept

    async def update_department(self, dept_id: uuid.UUID, data: dict) -> Department:
        dept = await self.get_department(dept_id)
        if data.get("parent_id"):
            data["parent_id"] = uuid.UUID(data["parent_id"])
        return await self.dept_repo.update(dept, **data)

    async def delete_department(self, dept_id: uuid.UUID) -> None:
        dept = await self.get_department(dept_id)
        await self.dept_repo.delete(dept)

    async def list_departments(self, branch_id: uuid.UUID) -> list[Department]:
        return await self.dept_repo.list_by_branch(branch_id)
