import uuid
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.companies.models import Company, Branch, Department


class CompanyRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, company_id: uuid.UUID) -> Optional[Company]:
        result = await self.db.execute(select(Company).where(Company.id == company_id, Company.deleted_at.is_(None)).options(selectinload(Company.branches)))
        return result.scalar_one_or_none()

    async def get_by_tax_id(self, tax_id: str) -> Optional[Company]:
        result = await self.db.execute(select(Company).where(Company.tax_id == tax_id, Company.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, skip: int = 0, limit: int = 100) -> tuple[list[Company], int]:
        result = await self.db.execute(select(Company).where(Company.deleted_at.is_(None)).offset(skip).limit(limit).order_by(Company.created_at.desc()))
        count_result = await self.db.execute(select(func.count(Company.id)).where(Company.deleted_at.is_(None)))
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> Company:
        company = Company(**kwargs)
        self.db.add(company)
        await self.db.flush()
        return company

    async def update(self, company: Company, **kwargs) -> Company:
        for key, value in kwargs.items():
            if value is not None:
                setattr(company, key, value)
        await self.db.flush()
        return company

    async def delete(self, company: Company) -> None:
        from datetime import datetime, timezone
        company.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()


class BranchRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, branch_id: uuid.UUID) -> Optional[Branch]:
        result = await self.db.execute(select(Branch).where(Branch.id == branch_id, Branch.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list_by_company(self, company_id: uuid.UUID) -> list[Branch]:
        result = await self.db.execute(select(Branch).where(Branch.company_id == company_id, Branch.deleted_at.is_(None)))
        return result.scalars().all()

    async def create(self, **kwargs) -> Branch:
        branch = Branch(**kwargs)
        self.db.add(branch)
        await self.db.flush()
        return branch

    async def update(self, branch: Branch, **kwargs) -> Branch:
        for key, value in kwargs.items():
            if value is not None:
                setattr(branch, key, value)
        await self.db.flush()
        return branch

    async def delete(self, branch: Branch) -> None:
        from datetime import datetime, timezone
        branch.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()


class DepartmentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, dept_id: uuid.UUID) -> Optional[Department]:
        result = await self.db.execute(select(Department).where(Department.id == dept_id, Department.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list_by_branch(self, branch_id: uuid.UUID) -> list[Department]:
        result = await self.db.execute(select(Department).where(Department.branch_id == branch_id, Department.deleted_at.is_(None)))
        return result.scalars().all()

    async def create(self, **kwargs) -> Department:
        dept = Department(**kwargs)
        self.db.add(dept)
        await self.db.flush()
        return dept

    async def update(self, dept: Department, **kwargs) -> Department:
        for key, value in kwargs.items():
            if value is not None:
                setattr(dept, key, value)
        await self.db.flush()
        return dept

    async def delete(self, dept: Department) -> None:
        from datetime import datetime, timezone
        dept.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()
