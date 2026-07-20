import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.companies.schemas import CompanyCreate, CompanyUpdate, CompanyResponse, BranchCreate, BranchUpdate, BranchResponse, DepartmentCreate, DepartmentUpdate, DepartmentResponse
from app.modules.companies.service import CompanyService, BranchService, DepartmentService

router = APIRouter(tags=["Companies"])
branch_router = APIRouter(tags=["Branches"])
dept_router = APIRouter(tags=["Departments"])


@router.get("/companies", response_model=list[CompanyResponse])
async def list_companies(page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("companies.read"))):
    service = CompanyService(db)
    items, _ = await service.list_companies(skip=(page - 1) * size, limit=size)
    return [CompanyResponse.model_validate(c) for c in items]


@router.get("/companies/{company_id}", response_model=CompanyResponse)
async def get_company(company_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("companies.read"))):
    service = CompanyService(db)
    company = await service.get_company(uuid.UUID(company_id))
    return CompanyResponse.model_validate(company)


@router.post("/companies", response_model=CompanyResponse, status_code=201)
async def create_company(body: CompanyCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("companies.create"))):
    service = CompanyService(db)
    company = await service.create_company(body.model_dump(exclude_none=True))
    return CompanyResponse.model_validate(company)


@router.put("/companies/{company_id}", response_model=CompanyResponse)
async def update_company(company_id: str, body: CompanyUpdate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("companies.update"))):
    service = CompanyService(db)
    company = await service.update_company(uuid.UUID(company_id), body.model_dump(exclude_none=True))
    return CompanyResponse.model_validate(company)


@router.delete("/companies/{company_id}", status_code=204)
async def delete_company(company_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("companies.delete"))):
    service = CompanyService(db)
    await service.delete_company(uuid.UUID(company_id))


@branch_router.get("/branches", response_model=list[BranchResponse])
async def list_branches(company_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("companies.read"))):
    service = BranchService(db)
    branches = await service.list_branches(uuid.UUID(company_id))
    return [BranchResponse.model_validate(b) for b in branches]


@branch_router.get("/branches/{branch_id}", response_model=BranchResponse)
async def get_branch(branch_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("companies.read"))):
    service = BranchService(db)
    branch = await service.get_branch(uuid.UUID(branch_id))
    return BranchResponse.model_validate(branch)


@branch_router.post("/branches", response_model=BranchResponse, status_code=201)
async def create_branch(body: BranchCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("companies.create"))):
    service = BranchService(db)
    branch = await service.create_branch(body.model_dump(exclude_none=True))
    return BranchResponse.model_validate(branch)


@branch_router.put("/branches/{branch_id}", response_model=BranchResponse)
async def update_branch(branch_id: str, body: BranchUpdate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("companies.update"))):
    service = BranchService(db)
    branch = await service.update_branch(uuid.UUID(branch_id), body.model_dump(exclude_none=True))
    return BranchResponse.model_validate(branch)


@branch_router.delete("/branches/{branch_id}", status_code=204)
async def delete_branch(branch_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("companies.delete"))):
    service = BranchService(db)
    await service.delete_branch(uuid.UUID(branch_id))


@dept_router.get("/departments", response_model=list[DepartmentResponse])
async def list_departments(branch_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("companies.read"))):
    service = DepartmentService(db)
    depts = await service.list_departments(uuid.UUID(branch_id))
    return [DepartmentResponse.model_validate(d) for d in depts]


@dept_router.get("/departments/{dept_id}", response_model=DepartmentResponse)
async def get_department(dept_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("companies.read"))):
    service = DepartmentService(db)
    dept = await service.get_department(uuid.UUID(dept_id))
    return DepartmentResponse.model_validate(dept)


@dept_router.post("/departments", response_model=DepartmentResponse, status_code=201)
async def create_department(body: DepartmentCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("companies.create"))):
    service = DepartmentService(db)
    dept = await service.create_department(body.model_dump(exclude_none=True))
    return DepartmentResponse.model_validate(dept)


@dept_router.put("/departments/{dept_id}", response_model=DepartmentResponse)
async def update_department(dept_id: str, body: DepartmentUpdate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("companies.update"))):
    service = DepartmentService(db)
    dept = await service.update_department(uuid.UUID(dept_id), body.model_dump(exclude_none=True))
    return DepartmentResponse.model_validate(dept)


@dept_router.delete("/departments/{dept_id}", status_code=204)
async def delete_department(dept_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("companies.delete"))):
    service = DepartmentService(db)
    await service.delete_department(uuid.UUID(dept_id))
