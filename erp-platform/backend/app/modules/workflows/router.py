import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.workflows.schemas import WorkflowCreate, WorkflowResponse
from app.modules.workflows.service import WorkflowService

router = APIRouter(prefix="/workflows", tags=["Workflows"])


@router.get("", response_model=list[WorkflowResponse])
async def list_workflows(company_id: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("workflows.read"))):
    service = WorkflowService(db)
    items, _ = await service.list(company_id=uuid.UUID(company_id) if company_id else None, skip=(page - 1) * size, limit=size)
    return [WorkflowResponse.model_validate(w) for w in items]


@router.get("/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(workflow_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("workflows.read"))):
    service = WorkflowService(db)
    workflow = await service.get(uuid.UUID(workflow_id))
    return WorkflowResponse.model_validate(workflow)


@router.post("", response_model=WorkflowResponse, status_code=201)
async def create_workflow(body: WorkflowCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("workflows.create"))):
    service = WorkflowService(db)
    workflow = await service.create(body.model_dump(exclude_none=True))
    return WorkflowResponse.model_validate(workflow)


@router.put("/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(workflow_id: str, body: dict, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("workflows.update"))):
    service = WorkflowService(db)
    workflow = await service.update(uuid.UUID(workflow_id), body)
    return WorkflowResponse.model_validate(workflow)


@router.delete("/{workflow_id}", status_code=204)
async def delete_workflow(workflow_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("workflows.delete"))):
    service = WorkflowService(db)
    await service.delete(uuid.UUID(workflow_id))


@router.post("/{workflow_id}/execute")
async def execute_workflow(workflow_id: str, body: dict, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("workflows.update"))):
    service = WorkflowService(db)
    return await service.execute(uuid.UUID(workflow_id), body.get("context", {}))
