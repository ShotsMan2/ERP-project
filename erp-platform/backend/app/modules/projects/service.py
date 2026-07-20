import uuid
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.projects.models import Project, Task, TimeEntry
from app.modules.projects.repository import ProjectRepository, TaskRepository, TimeEntryRepository


class ProjectService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = ProjectRepository(db)

    async def create_project(self, data: dict) -> Project:
        return await self.repo.create(**data)

    async def get_project(self, project_id: uuid.UUID) -> Project:
        project = await self.repo.get_by_id(project_id)
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        return project

    async def update_project(self, project_id: uuid.UUID, data: dict) -> Project:
        project = await self.get_project(project_id)
        return await self.repo.update(project, **data)

    async def delete_project(self, project_id: uuid.UUID) -> None:
        project = await self.get_project(project_id)
        await self.repo.delete(project)

    async def list_projects(self, company_id: uuid.UUID | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Project], int]:
        return await self.repo.list(company_id=company_id, status=status, skip=skip, limit=limit)

    async def get_gantt_data(self, project_id: uuid.UUID) -> list[dict]:
        project = await self.get_project(project_id)
        return [{"id": str(t.id), "title": t.title, "status": t.status, "start_date": str(t.created_at.date()) if hasattr(t.created_at, 'date') else None, "due_date": str(t.due_date) if t.due_date else None, "assignee_id": str(t.assignee_id) if t.assignee_id else None, "estimated_hours": t.estimated_hours, "actual_hours": t.actual_hours} for t in project.tasks]


class TaskService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = TaskRepository(db)

    async def create_task(self, project_id: uuid.UUID, data: dict) -> Task:
        data["project_id"] = project_id
        if data.get("parent_id"):
            data["parent_id"] = uuid.UUID(data["parent_id"])
        if data.get("assignee_id"):
            data["assignee_id"] = uuid.UUID(data["assignee_id"])
        return await self.repo.create(**data)

    async def get_task(self, task_id: uuid.UUID) -> Task:
        task = await self.repo.get_by_id(task_id)
        if not task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        return task

    async def update_task(self, task_id: uuid.UUID, data: dict) -> Task:
        task = await self.get_task(task_id)
        return await self.repo.update(task, **data)

    async def list_tasks(self, project_id: uuid.UUID) -> list[Task]:
        return await self.repo.list_by_project(project_id)


class TimeEntryService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = TimeEntryRepository(db)

    async def create_entry(self, data: dict) -> TimeEntry:
        return await self.repo.create(**data)

    async def list_entries(self, employee_id: uuid.UUID | None = None, task_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[TimeEntry], int]:
        return await self.repo.list(employee_id=employee_id, task_id=task_id, skip=skip, limit=limit)
