import uuid
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession


class AIService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def query(self, query_text: str, context: dict | None = None) -> dict:
        return {
            "answer": f"AI processed query: '{query_text}'. This is a stub response. Connect to an NLP service for production use.",
            "confidence": 0.95,
            "source": "ai-stub-engine",
        }

    async def get_predictions(self, model: str | None = None) -> list[dict]:
        return [
            {"id": str(uuid.uuid7()), "model": model or "forecast", "prediction": "sales_growth_5pct", "confidence": 0.82, "period": "next_quarter"},
            {"id": str(uuid.uuid7()), "model": model or "anomaly", "prediction": "no_anomalies_detected", "confidence": 0.91, "period": "last_30_days"},
        ]
