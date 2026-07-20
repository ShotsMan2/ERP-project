from __future__ import annotations

import uuid
from collections.abc import Awaitable, Callable

from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class AuditMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        if request.method not in ("GET", "HEAD", "OPTIONS"):
            request.state.audit_id = str(uuid.uuid4())
            request.state.audit_action = f"{request.method} {request.url.path}"
        response = await call_next(request)
        return response
