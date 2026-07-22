import uuid
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.integrations.models import IntegrationProvider
from app.modules.integrations.repository import IntegrationProviderRepository, IntegrationLogRepository


class IntegrationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = IntegrationProviderRepository(db)

    async def create_provider(self, data: dict) -> IntegrationProvider:
        encrypted_fields = {}
        if data.get("api_key"):
            encrypted_fields["api_key_encrypted"] = data.pop("api_key")
        if data.get("api_secret"):
            encrypted_fields["api_secret_encrypted"] = data.pop("api_secret")
        data.update(encrypted_fields)
        return await self.repo.create(**data)

    async def get_provider(self, provider_id: uuid.UUID) -> IntegrationProvider:
        provider = await self.repo.get_by_id(provider_id)
        if not provider:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Integration provider not found")
        return provider

    async def update_provider(self, provider_id: uuid.UUID, data: dict) -> IntegrationProvider:
        provider = await self.get_provider(provider_id)
        if data.get("api_key"):
            data["api_key_encrypted"] = data.pop("api_key")
        if data.get("api_secret"):
            data["api_secret_encrypted"] = data.pop("api_secret")
        return await self.repo.update(provider, **data)

    async def list_providers(self, company_id: uuid.UUID | None = None, provider_type: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[IntegrationProvider], int]:
        return await self.repo.list(company_id=company_id, provider_type=provider_type, skip=skip, limit=limit)

    async def toggle_provider(self, provider_id: uuid.UUID) -> IntegrationProvider:
        provider = await self.get_provider(provider_id)
        return await self.repo.update(provider, is_active=not provider.is_active)

    async def sync_provider(self, provider_id: uuid.UUID) -> dict:
        provider = await self.get_provider(provider_id)
        log_repo = IntegrationLogRepository(self.db)
        await log_repo.create(
            provider_id=provider.id,
            direction="outbound",
            status="processing",
            started_at=datetime.now(timezone.utc),
        )
        await self.repo.update(provider, sync_status="syncing", last_sync_at=datetime.now(timezone.utc))
        return {"message": f"Sync initiated for {provider.name}", "provider_id": str(provider.id), "status": "processing"}
