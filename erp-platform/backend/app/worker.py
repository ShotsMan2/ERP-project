from celery import Celery
import os

# Set default Celery broker and backend for the ERP platform
# Redis is typically used for both
redis_url = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "worker",
    broker=redis_url,
    backend=redis_url
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

@celery_app.task(name="dummy_task")
def dummy_task():
    return "Task complete"
