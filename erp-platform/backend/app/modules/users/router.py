import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.users.schemas import UserCreate, UserUpdate, UserResponse, UserList
from app.modules.users.service import UserService

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=UserList)
async def list_users(page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("users.read"))):
    service = UserService(db)
    items, total = await service.list_users(skip=(page - 1) * size, limit=size)
    return UserList(items=[UserResponse.model_validate(u) for u in items], total=total, page=page, size=size)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("users.read"))):
    service = UserService(db)
    user = await service.get_user(uuid.UUID(user_id))
    return UserResponse.model_validate(user)


@router.post("", response_model=UserResponse, status_code=201)
async def create_user(body: UserCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("users.create"))):
    service = UserService(db)
    user = await service.create_user(body.model_dump(exclude_none=True))
    return UserResponse.model_validate(user)


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, body: UserUpdate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("users.update"))):
    service = UserService(db)
    user = await service.update_user(uuid.UUID(user_id), body.model_dump(exclude_none=True))
    return UserResponse.model_validate(user)


@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("users.delete"))):
    service = UserService(db)
    await service.delete_user(uuid.UUID(user_id))
