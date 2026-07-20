from __future__ import annotations

import uuid
from collections.abc import Awaitable, Callable

from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import settings


class CorrelationIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        correlation_id = request.headers.get(
            settings.LOG_CORRELATION_ID_HEADER,
            str(uuid.uuid4()),
        )
        response = await call_next(request)
        response.headers[settings.LOG_CORRELATION_ID_HEADER] = correlation_id
        return response
