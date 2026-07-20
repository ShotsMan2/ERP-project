from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.ai.schemas import AIQueryRequest, AIQueryResponse
from app.modules.ai.service import AIService

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/query", response_model=AIQueryResponse)
async def ai_query(body: AIQueryRequest, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("ai.read"))):
    service = AIService(db)
    result = await service.query(body.query, body.context)
    return AIQueryResponse(**result)


@router.get("/predictions")
async def get_predictions(model: str | None = Query(None), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("ai.read"))):
    service = AIService(db)
    return await service.get_predictions(model=model)
