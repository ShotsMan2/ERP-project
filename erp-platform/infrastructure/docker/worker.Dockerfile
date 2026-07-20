FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements/base.txt /app/backend/requirements/
COPY shared/ /app/shared/

RUN pip install --upgrade pip && \
    pip install --user -r backend/requirements/base.txt

FROM python:3.12-slim AS runner

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/root/.local/bin:$PATH"

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /root/.local /root/.local
COPY --from=builder /app/shared /app/shared

COPY backend/ /app/backend/
COPY shared/ /app/shared/

WORKDIR /app/backend

RUN addgroup --system --gid 1001 erp && \
    adduser --system --uid 1001 --ingroup erp erp && \
    chown -R erp:erp /app

USER erp

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD celery -A app.core.queue.celery_app inspect ping || exit 1

CMD ["celery", "-A", "app.core.queue.celery_app", "worker", \
     "--loglevel=info", "--concurrency=4", "--max-tasks-per-child=100"]
