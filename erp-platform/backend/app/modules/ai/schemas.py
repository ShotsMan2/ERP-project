from typing import Optional

from pydantic import BaseModel


class AIQueryRequest(BaseModel):
    query: str
    context: Optional[dict] = None


class AIQueryResponse(BaseModel):
    answer: str
    confidence: float
    source: str
