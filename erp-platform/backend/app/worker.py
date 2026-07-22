from celery import Celery
import os

# Set default Celery broker (RabbitMQ) and backend (Redis) for the ERP platform
rabbitmq_url = os.getenv("CELERY_BROKER_URL", "amqp://guest:guest@localhost:5672/")
redis_url = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/1")

celery_app = Celery(
    "erp_worker",
    broker=rabbitmq_url,
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
