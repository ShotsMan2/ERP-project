import uuid
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.notifications.models import Notification, NotificationTemplate
from app.modules.notifications.repository import NotificationRepository, TemplateRepository


class NotificationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = NotificationRepository(db)

    async def list_notifications(self, user_id: uuid.UUID, unread_only: bool = False, skip: int = 0, limit: int = 100) -> tuple[list[Notification], int]:
        return await self.repo.list_by_user(user_id, unread_only=unread_only, skip=skip, limit=limit)

    async def mark_as_read(self, notification_id: uuid.UUID) -> Notification:
        notif = await self.repo.mark_as_read(notification_id)
        if not notif:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
        return notif

    async def send_notification(self, user_id: uuid.UUID, type: str, title: str, body: str | None = None, data: dict | None = None, channel: str = "in_app") -> Notification:
        return await self.repo.create(user_id=user_id, type=type, title=title, body=body, data=data, channel=channel)


class TemplateService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = TemplateRepository(db)

    async def create_template(self, data: dict) -> NotificationTemplate:
        return await self.repo.create(**data)

    async def list_templates(self, company_id: uuid.UUID | None = None) -> list[NotificationTemplate]:
        return await self.repo.list(company_id=company_id)

    async def render_template(self, code: str, variables: dict, company_id: uuid.UUID | None = None) -> dict:
        template = await self.repo.get_by_code(code, company_id=company_id)
        if not template:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
        subject = template.subject
        body = template.body
        for key, value in variables.items():
            placeholder = "{{" + key + "}}"
            if subject:
                subject = subject.replace(placeholder, str(value))
            body = body.replace(placeholder, str(value))
        return {"subject": subject, "body": body, "channel": template.channel}
