import uuid
from typing import Optional

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.admin.models import SystemBackup, SystemHealthCheck, QueueTask, ActivityLog


class BackupRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, backup_id: uuid.UUID) -> Optional[SystemBackup]:
        result = await self.db.execute(select(SystemBackup).where(SystemBackup.id == backup_id, SystemBackup.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[SystemBackup], int]:
        query = select(SystemBackup).where(SystemBackup.deleted_at.is_(None))
        count_query = select(func.count(SystemBackup.id)).where(SystemBackup.deleted_at.is_(None))
        if company_id:
            query = query.where(SystemBackup.company_id == str(company_id))
            count_query = count_query.where(SystemBackup.company_id == str(company_id))
        if status:
            query = query.where(SystemBackup.status == status)
            count_query = count_query.where(SystemBackup.status == status)
        query = query.offset(skip).limit(limit).order_by(SystemBackup.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> SystemBackup:
        backup = SystemBackup(**kwargs)
        self.db.add(backup)
        await self.db.flush()
        return backup

    async def update(self, backup: SystemBackup, **kwargs) -> SystemBackup:
        for key, value in kwargs.items():
            if value is not None:
                setattr(backup, key, value)
        await self.db.flush()
        return backup

    async def delete(self, backup_id: uuid.UUID) -> bool:
        result = await self.db.execute(select(SystemBackup).where(SystemBackup.id == backup_id, SystemBackup.deleted_at.is_(None)))
        backup = result.scalar_one_or_none()
        if not backup:
            return False
        backup.deleted_at = func.now()
        await self.db.flush()
        return True

    async def restore(self, backup_id: uuid.UUID, restored_by: str) -> Optional[SystemBackup]:
        result = await self.db.execute(select(SystemBackup).where(SystemBackup.id == backup_id, SystemBackup.deleted_at.is_(None)))
        backup = result.scalar_one_or_none()
        if not backup:
            return None
        backup.status = "restoring"
        backup.restored_at = func.now()
        backup.restored_by = restored_by
        await self.db.flush()
        return backup


class HealthCheckRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_latest(self) -> list[SystemHealthCheck]:
        latest_time = select(func.max(SystemHealthCheck.checked_at)).scalar_subquery()
        result = await self.db.execute(
            select(SystemHealthCheck).where(SystemHealthCheck.checked_at == latest_time).order_by(SystemHealthCheck.service_name)
        )
        return result.scalars().all()

    async def create(self, **kwargs) -> SystemHealthCheck:
        check = SystemHealthCheck(**kwargs)
        self.db.add(check)
        await self.db.flush()
        return check

    async def list_history(self, service_name: str | None = None, skip: int = 0, limit: int = 50) -> tuple[list[SystemHealthCheck], int]:
        query = select(SystemHealthCheck)
        count_query = select(func.count(SystemHealthCheck.id))
        if service_name:
            query = query.where(SystemHealthCheck.service_name == service_name)
            count_query = count_query.where(SystemHealthCheck.service_name == service_name)
        query = query.offset(skip).limit(limit).order_by(SystemHealthCheck.checked_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0


class QueueRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_tasks(self, queue_name: str | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[QueueTask], int]:
        query = select(QueueTask)
        count_query = select(func.count(QueueTask.id))
        if queue_name:
            query = query.where(QueueTask.queue_name == queue_name)
            count_query = count_query.where(QueueTask.queue_name == queue_name)
        if status:
            query = query.where(QueueTask.status == status)
            count_query = count_query.where(QueueTask.status == status)
        query = query.offset(skip).limit(limit).order_by(QueueTask.priority.desc(), QueueTask.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def get_summary(self) -> list[dict]:
        query = select(
            QueueTask.queue_name,
            func.count().filter(QueueTask.status == "pending").label("pending"),
            func.count().filter(QueueTask.status == "processing").label("processing"),
            func.count().filter(QueueTask.status == "completed").label("completed"),
            func.count().filter(QueueTask.status == "failed").label("failed"),
            func.count().label("total"),
        ).group_by(QueueTask.queue_name)
        result = await self.db.execute(query)
        rows = result.all()
        return [
            {
                "queue_name": row[0],
                "pending": row[1],
                "processing": row[2],
                "completed": row[3],
                "failed": row[4],
                "total": row[5],
            }
            for row in rows
        ]

    async def get_task(self, task_id: str) -> Optional[QueueTask]:
        result = await self.db.execute(select(QueueTask).where(QueueTask.task_id == task_id))
        return result.scalar_one_or_none()

    async def retry_task(self, task_id: str) -> Optional[QueueTask]:
        result = await self.db.execute(select(QueueTask).where(QueueTask.task_id == task_id))
        task = result.scalar_one_or_none()
        if not task:
            return None
        task.status = "pending"
        task.retry_count += 1
        task.error_message = None
        await self.db.flush()
        return task

    async def cancel_task(self, task_id: str) -> Optional[QueueTask]:
        result = await self.db.execute(select(QueueTask).where(QueueTask.task_id == task_id))
        task = result.scalar_one_or_none()
        if not task or task.status not in ("pending", "processing"):
            return None
        task.status = "cancelled"
        await self.db.flush()
        return task

    async def purge_queue(self, queue_name: str) -> int:
        result = await self.db.execute(
            select(func.count(QueueTask.id)).where(
                QueueTask.queue_name == queue_name,
                QueueTask.status.in_(["pending", "failed"]),
            )
        )
        count = result.scalar() or 0
        await self.db.execute(
            QueueTask.__table__.delete().where(
                QueueTask.queue_name == queue_name,
                QueueTask.status.in_(["pending", "failed"]),
            )
        )
        await self.db.flush()
        return count


class ActivityLogRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_logs(
        self,
        user_id: str | None = None,
        module: str | None = None,
        action: str | None = None,
        status: str | None = None,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[list[ActivityLog], int]:
        query = select(ActivityLog)
        count_query = select(func.count(ActivityLog.id))
        conditions = []
        if user_id:
            conditions.append(ActivityLog.user_id == user_id)
        if module:
            conditions.append(ActivityLog.module == module)
        if action:
            conditions.append(ActivityLog.action == action)
        if status:
            conditions.append(ActivityLog.status == status)
        if conditions:
            query = query.where(and_(*conditions))
            count_query = count_query.where(and_(*conditions))
        query = query.offset(skip).limit(limit).order_by(ActivityLog.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> ActivityLog:
        log = ActivityLog(**kwargs)
        self.db.add(log)
        await self.db.flush()
        return log
