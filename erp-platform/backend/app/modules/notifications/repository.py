import uuid
from typing import Optional

from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.notifications.models import Notification, NotificationTemplate


class NotificationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_by_user(self, user_id: uuid.UUID, unread_only: bool = False, skip: int = 0, limit: int = 100) -> tuple[list[Notification], int]:
        query = select(Notification).where(Notification.user_id == user_id, Notification.deleted_at.is_(None))
        count_query = select(func.count(Notification.id)).where(Notification.user_id == user_id, Notification.deleted_at.is_(None))
        if unread_only:
            query = query.where(Notification.read_at.is_(None))
            count_query = count_query.where(Notification.read_at.is_(None))
        query = query.offset(skip).limit(limit).order_by(Notification.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def mark_as_read(self, notification_id: uuid.UUID) -> Optional[Notification]:
        from datetime import datetime, timezone
        result = await self.db.execute(select(Notification).where(Notification.id == notification_id, Notification.deleted_at.is_(None)))
        notif = result.scalar_one_or_none()
        if notif:
            notif.read_at = datetime.now(timezone.utc)
            await self.db.flush()
        return notif

    async def mark_all_as_read(self, user_id: uuid.UUID) -> None:
        from datetime import datetime, timezone
        query = select(Notification).where(
            Notification.user_id == user_id,
            Notification.read_at.is_(None),
            Notification.deleted_at.is_(None),
        )
        result = await self.db.execute(query)
        now = datetime.now(timezone.utc)
        for notif in result.scalars().all():
            notif.read_at = now
        await self.db.flush()

    async def create(self, **kwargs) -> Notification:
        notif = Notification(**kwargs)
        self.db.add(notif)
        await self.db.flush()
        return notif


class TemplateRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_code(self, code: str, company_id: uuid.UUID | None = None) -> Optional[NotificationTemplate]:
        query = select(NotificationTemplate).where(NotificationTemplate.code == code, NotificationTemplate.deleted_at.is_(None))
        if company_id:
            query = query.where(NotificationTemplate.company_id == company_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None) -> list[NotificationTemplate]:
        query = select(NotificationTemplate).where(NotificationTemplate.deleted_at.is_(None))
        if company_id:
            query = query.where(NotificationTemplate.company_id == company_id)
        result = await self.db.execute(query.order_by(NotificationTemplate.code))
        return result.scalars().all()

    async def create(self, **kwargs) -> NotificationTemplate:
        template = NotificationTemplate(**kwargs)
        self.db.add(template)
        await self.db.flush()
        return template

    async def update(self, template: NotificationTemplate, **kwargs) -> NotificationTemplate:
        for key, value in kwargs.items():
            if value is not None:
                setattr(template, key, value)
        await self.db.flush()
        return template
