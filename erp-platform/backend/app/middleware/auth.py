from __future__ import annotations

import json
from collections.abc import Awaitable, Callable
from typing import Any

from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.security.jwt import decode_token


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
            payload = decode_token(token)
            if payload:
                request.state.user = payload
                request.state.user_id = payload.get("sub")
                request.state.company_id = payload.get("company_id")
                request.state.is_authenticated = True
            else:
                request.state.user = None
                request.state.user_id = None
                request.state.company_id = None
                request.state.is_authenticated = False
        else:
            request.state.user = None
            request.state.user_id = None
            request.state.company_id = None
            request.state.is_authenticated = False
        response = await call_next(request)
        return response
