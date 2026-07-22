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

    async def get_dashboard_insights(self) -> list[dict]:
        return [
            {"id": str(uuid.uuid7()), "type": "positive", "title": "Revenue Surge", "message": "Q3 Revenue is predicted to be 15% higher due to recent marketing campaigns.", "action": "View Report"},
            {"id": str(uuid.uuid7()), "type": "warning", "title": "Inventory Risk", "message": "High likelihood of stockout for 'Premium Widgets' within 7 days.", "action": "Restock Now"},
            {"id": str(uuid.uuid7()), "type": "info", "title": "HR Alert", "message": "3 top-tier candidates identified for the Senior DevOps role.", "action": "Review Pipeline"}
        ]
