import uuid
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.projects.models import Project, ProjectMember, Task, TimeEntry


class ProjectRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, project_id: uuid.UUID) -> Optional[Project]:
        result = await self.db.execute(select(Project).where(Project.id == project_id, Project.deleted_at.is_(None)).options(selectinload(Project.tasks), selectinload(Project.members)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Project], int]:
        query = select(Project).where(Project.deleted_at.is_(None))
        count_query = select(func.count(Project.id)).where(Project.deleted_at.is_(None))
        if company_id:
            query = query.where(Project.company_id == company_id)
            count_query = count_query.where(Project.company_id == company_id)
        if status:
            query = query.where(Project.status == status)
            count_query = count_query.where(Project.status == status)
        query = query.offset(skip).limit(limit).order_by(Project.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> Project:
        project = Project(**kwargs)
        self.db.add(project)
        await self.db.flush()
        return project

    async def update(self, project: Project, **kwargs) -> Project:
        for key, value in kwargs.items():
            if value is not None:
                setattr(project, key, value)
        await self.db.flush()
        return project

    async def delete(self, project: Project) -> None:
        from datetime import datetime, timezone
        project.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()


class TaskRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, task_id: uuid.UUID) -> Optional[Task]:
        result = await self.db.execute(select(Task).where(Task.id == task_id, Task.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list_by_project(self, project_id: uuid.UUID) -> list[Task]:
        result = await self.db.execute(select(Task).where(Task.project_id == project_id, Task.deleted_at.is_(None)).order_by(Task.created_at))
        return result.scalars().all()

    async def create(self, **kwargs) -> Task:
        task = Task(**kwargs)
        self.db.add(task)
        await self.db.flush()
        return task

    async def update(self, task: Task, **kwargs) -> Task:
        for key, value in kwargs.items():
            if value is not None:
                setattr(task, key, value)
        await self.db.flush()
        return task

    async def delete(self, task: Task) -> None:
        from datetime import datetime, timezone
        task.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()


class TimeEntryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, entry_id: uuid.UUID) -> Optional[TimeEntry]:
        result = await self.db.execute(select(TimeEntry).where(TimeEntry.id == entry_id, TimeEntry.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, employee_id: uuid.UUID | None = None, task_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[TimeEntry], int]:
        query = select(TimeEntry).where(TimeEntry.deleted_at.is_(None))
        count_query = select(func.count(TimeEntry.id)).where(TimeEntry.deleted_at.is_(None))
        if employee_id:
            query = query.where(TimeEntry.employee_id == employee_id)
            count_query = count_query.where(TimeEntry.employee_id == employee_id)
        if task_id:
            query = query.where(TimeEntry.task_id == task_id)
            count_query = count_query.where(TimeEntry.task_id == task_id)
        query = query.offset(skip).limit(limit).order_by(TimeEntry.date.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> TimeEntry:
        entry = TimeEntry(**kwargs)
        self.db.add(entry)
        await self.db.flush()
        return entry

    async def update(self, entry: TimeEntry, **kwargs) -> TimeEntry:
        for key, value in kwargs.items():
            if value is not None:
                setattr(entry, key, value)
        await self.db.flush()
        return entry
