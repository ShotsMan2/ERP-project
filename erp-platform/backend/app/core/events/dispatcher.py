from __future__ import annotations

import asyncio
import logging
from collections.abc import Callable
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger(__name__)


class EventDispatcher:
    def __init__(self) -> None:
        self._handlers: dict[str, list[Callable[..., Any]]] = {}

    async def initialize(self) -> None:
        pass

    def register(self, event_type: str, handler: Callable[..., Any]) -> None:
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)
        logger.debug("Registered handler %s for event '%s'", handler.__name__, event_type)

    def unregister(self, event_type: str, handler: Callable[..., Any]) -> None:
        if event_type in self._handlers:
            self._handlers[event_type] = [
                h for h in self._handlers[event_type] if h != handler
            ]
            if not self._handlers[event_type]:
                del self._handlers[event_type]

    async def dispatch(self, event_type: str, data: dict[str, Any] | None = None) -> list[Any]:
        if data is None:
            data = {}
        event = {
            "type": event_type,
            "data": data,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        results: list[Any] = []
        handlers = self._handlers.get(event_type, [])
        if not handlers:
            logger.debug("No handlers registered for event '%s'", event_type)
            return results
        tasks = [self._safe_call(h, event) for h in handlers]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error(
                    "Handler %s for event '%s' failed: %s",
                    handlers[i].__name__,
                    event_type,
                    result,
                )
        return results

    async def _safe_call(self, handler: Callable[..., Any], event: dict[str, Any]) -> Any:
        if asyncio.iscoroutinefunction(handler):
            return await handler(event)
        return handler(event)


event_dispatcher = EventDispatcher()
