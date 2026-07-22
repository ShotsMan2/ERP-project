import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.notifications.schemas import NotificationResponse, TemplateCreate, TemplateResponse
from app.modules.notifications.service import NotificationService, TemplateService

router = APIRouter(tags=["Notifications"])


@router.get("/notifications", response_model=list[NotificationResponse])
async def list_notifications(unread_only: bool = Query(False), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("notifications.read"))):
    service = NotificationService(db)
    items, _ = await service.list_notifications(uuid.UUID(user_id), unread_only=unread_only, skip=(page - 1) * size, limit=size)
    return [NotificationResponse.model_validate(n) for n in items]


@router.put("/notifications/read-all")
async def mark_all_read(user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("notifications.update"))):
    service = NotificationService(db)
    await service.mark_all_as_read(uuid.UUID(user_id))
    return {"status": "ok"}


@router.put("/notifications/{notif_id}/read", response_model=NotificationResponse)
async def mark_as_read(notif_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("notifications.update"))):
    service = NotificationService(db)
    notif = await service.mark_as_read(uuid.UUID(notif_id))
    return NotificationResponse.model_validate(notif)


@router.get("/notification-templates", response_model=list[TemplateResponse])
async def list_templates(company_id: str | None = Query(None), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("notifications.read"))):
    service = TemplateService(db)
    templates = await service.list_templates(company_id=uuid.UUID(company_id) if company_id else None)
    return [TemplateResponse.model_validate(t) for t in templates]


@router.post("/notification-templates", response_model=TemplateResponse, status_code=201)
async def create_template(body: TemplateCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("notifications.create"))):
    service = TemplateService(db)
    template = await service.create_template(body.model_dump(exclude_none=True))
    return TemplateResponse.model_validate(template)


@router.post("/notification-templates/render")
async def render_template(body: dict, db: AsyncSession = Depends(get_db)):
    service = TemplateService(db)
    return await service.render_template(body["code"], body.get("variables", {}), company_id=uuid.UUID(body.get("company_id")) if body.get("company_id") else None)
