from __future__ import annotations

from celery import Celery

from app.config import settings

celery_app = Celery(
    "erp_platform",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=["app.core.queue.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,
    task_soft_time_limit=25 * 60,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    task_default_retry_delay=60,
    task_max_retries=3,
    worker_prefetch_multiplier=1,
    result_expires=3600 * 24 * 7,
)
