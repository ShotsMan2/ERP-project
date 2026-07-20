import uuid
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.workflows.models import Workflow


class WorkflowService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: dict) -> Workflow:
        workflow = Workflow(**data)
        self.db.add(workflow)
        await self.db.flush()
        return workflow

    async def get(self, workflow_id: uuid.UUID) -> Workflow:
        result = await self.db.execute(select(Workflow).where(Workflow.id == workflow_id, Workflow.deleted_at.is_(None)))
        workflow = result.scalar_one_or_none()
        if not workflow:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found")
        return workflow

    async def update(self, workflow_id: uuid.UUID, data: dict) -> Workflow:
        workflow = await self.get(workflow_id)
        for key, value in data.items():
            if value is not None:
                setattr(workflow, key, value)
        workflow.version += 1
        await self.db.flush()
        return workflow

    async def delete(self, workflow_id: uuid.UUID) -> None:
        workflow = await self.get(workflow_id)
        from datetime import datetime, timezone
        workflow.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()

    async def list(self, company_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Workflow], int]:
        query = select(Workflow).where(Workflow.deleted_at.is_(None))
        count_query = select(func.count(Workflow.id)).where(Workflow.deleted_at.is_(None))
        if company_id:
            query = query.where(Workflow.company_id == company_id)
            count_query = count_query.where(Workflow.company_id == company_id)
        query = query.offset(skip).limit(limit).order_by(Workflow.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def execute(self, workflow_id: uuid.UUID, context: dict) -> dict:
        workflow = await self.get(workflow_id)
        return {"workflow_id": str(workflow.id), "name": workflow.name, "status": "executed", "trigger_type": workflow.trigger_type, "context": context}
