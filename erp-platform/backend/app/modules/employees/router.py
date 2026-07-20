import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.employees.schemas import EmployeeCreate, EmployeeUpdate, EmployeeResponse
from app.modules.employees.service import EmployeeService

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("", response_model=list[EmployeeResponse])
async def list_employees(company_id: str | None = Query(None), department_id: str | None = Query(None), status: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("employees.read"))):
    service = EmployeeService(db)
    items, _ = await service.list_employees(
        company_id=uuid.UUID(company_id) if company_id else None,
        department_id=uuid.UUID(department_id) if department_id else None,
        status=status,
        skip=(page - 1) * size,
        limit=size,
    )
    return [EmployeeResponse.model_validate(e) for e in items]


@router.get("/org-chart")
async def get_org_chart(company_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("employees.read"))):
    service = EmployeeService(db)
    return await service.get_org_chart(uuid.UUID(company_id))


@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(employee_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("employees.read"))):
    service = EmployeeService(db)
    emp = await service.get_employee(uuid.UUID(employee_id))
    return EmployeeResponse.model_validate(emp)


@router.post("", response_model=EmployeeResponse, status_code=201)
async def create_employee(body: EmployeeCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("employees.create"))):
    service = EmployeeService(db)
    emp = await service.create_employee(body.model_dump(exclude_none=True))
    return EmployeeResponse.model_validate(emp)


@router.put("/{employee_id}", response_model=EmployeeResponse)
async def update_employee(employee_id: str, body: EmployeeUpdate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("employees.update"))):
    service = EmployeeService(db)
    emp = await service.update_employee(uuid.UUID(employee_id), body.model_dump(exclude_none=True))
    return EmployeeResponse.model_validate(emp)


@router.delete("/{employee_id}", status_code=204)
async def delete_employee(employee_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("employees.delete"))):
    service = EmployeeService(db)
    await service.delete_employee(uuid.UUID(employee_id))
