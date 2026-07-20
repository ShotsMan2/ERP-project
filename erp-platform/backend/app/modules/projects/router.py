import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.projects.schemas import ProjectCreate, ProjectResponse, TaskCreate, TaskUpdate, TaskResponse, TimeEntryCreate, TimeEntryResponse
from app.modules.projects.service import ProjectService, TaskService, TimeEntryService

router = APIRouter(tags=["Projects"])


@router.get("/projects", response_model=list[ProjectResponse])
async def list_projects(company_id: str | None = Query(None), status: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("projects.read"))):
    service = ProjectService(db)
    items, _ = await service.list_projects(company_id=uuid.UUID(company_id) if company_id else None, status=status, skip=(page - 1) * size, limit=size)
    return [ProjectResponse.model_validate(p) for p in items]


@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("projects.read"))):
    service = ProjectService(db)
    project = await service.get_project(uuid.UUID(project_id))
    return ProjectResponse.model_validate(project)


@router.post("/projects", response_model=ProjectResponse, status_code=201)
async def create_project(body: ProjectCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("projects.create"))):
    service = ProjectService(db)
    project = await service.create_project(body.model_dump(exclude_none=True))
    return ProjectResponse.model_validate(project)


@router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: str, body: dict, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("projects.update"))):
    service = ProjectService(db)
    project = await service.update_project(uuid.UUID(project_id), body)
    return ProjectResponse.model_validate(project)


@router.delete("/projects/{project_id}", status_code=204)
async def delete_project(project_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("projects.delete"))):
    service = ProjectService(db)
    await service.delete_project(uuid.UUID(project_id))


@router.get("/projects/{project_id}/tasks", response_model=list[TaskResponse])
async def list_tasks(project_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("projects.read"))):
    service = TaskService(db)
    tasks = await service.list_tasks(uuid.UUID(project_id))
    return [TaskResponse.model_validate(t) for t in tasks]


@router.post("/projects/{project_id}/tasks", response_model=TaskResponse, status_code=201)
async def create_task(project_id: str, body: TaskCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("projects.create"))):
    service = TaskService(db)
    task = await service.create_task(uuid.UUID(project_id), body.model_dump(exclude_none=True))
    return TaskResponse.model_validate(task)


@router.get("/projects/{project_id}/gantt")
async def get_gantt(project_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("projects.read"))):
    service = ProjectService(db)
    return await service.get_gantt_data(uuid.UUID(project_id))


@router.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("projects.read"))):
    service = TaskService(db)
    task = await service.get_task(uuid.UUID(task_id))
    return TaskResponse.model_validate(task)


@router.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, body: TaskUpdate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("projects.update"))):
    service = TaskService(db)
    task = await service.update_task(uuid.UUID(task_id), body.model_dump(exclude_none=True))
    return TaskResponse.model_validate(task)


@router.get("/time-entries", response_model=list[TimeEntryResponse])
async def list_time_entries(employee_id: str | None = Query(None), task_id: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("projects.read"))):
    service = TimeEntryService(db)
    items, _ = await service.list_entries(
        employee_id=uuid.UUID(employee_id) if employee_id else None,
        task_id=uuid.UUID(task_id) if task_id else None,
        skip=(page - 1) * size,
        limit=size,
    )
    return [TimeEntryResponse.model_validate(t) for t in items]


@router.post("/time-entries", response_model=TimeEntryResponse, status_code=201)
async def create_time_entry(body: TimeEntryCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("projects.create"))):
    service = TimeEntryService(db)
    entry = await service.create_entry(body.model_dump(exclude_none=True))
    return TimeEntryResponse.model_validate(entry)
