from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.settings.schemas import SystemConfigUpdate, SystemConfigResponse
from app.modules.settings.service import SettingsService

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("", response_model=list[SystemConfigResponse])
async def get_settings(db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("settings.read"))):
    service = SettingsService(db)
    return await service.get_all()


@router.get("/{key}", response_model=SystemConfigResponse)
async def get_setting(key: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("settings.read"))):
    service = SettingsService(db)
    return await service.get(key)


@router.put("/{key}", response_model=SystemConfigResponse)
async def update_setting(key: str, body: SystemConfigUpdate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("settings.update"))):
    service = SettingsService(db)
    return await service.update(key, body.value)
