import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.roles.schemas import RoleCreate, RoleUpdate, RoleResponse, RolePermissionUpdate, PermissionResponse
from app.modules.roles.service import RBACService

router = APIRouter(prefix="/roles", tags=["Roles"])
perm_router = APIRouter(prefix="/permissions", tags=["Permissions"])


@router.get("", response_model=list[RoleResponse])
async def list_roles(page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("roles.read"))):
    service = RBACService(db)
    items, _ = await service.list_roles(skip=(page - 1) * size, limit=size)
    return [RoleResponse.model_validate(r) for r in items]


@router.get("/{role_id}", response_model=RoleResponse)
async def get_role(role_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("roles.read"))):
    service = RBACService(db)
    role = await service.get_role(uuid.UUID(role_id))
    return RoleResponse.model_validate(role)


@router.post("", response_model=RoleResponse, status_code=201)
async def create_role(body: RoleCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("roles.create"))):
    service = RBACService(db)
    role = await service.create_role(body.model_dump(exclude_none=True))
    return RoleResponse.model_validate(role)


@router.put("/{role_id}", response_model=RoleResponse)
async def update_role(role_id: str, body: RoleUpdate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("roles.update"))):
    service = RBACService(db)
    role = await service.update_role(uuid.UUID(role_id), body.model_dump(exclude_none=True))
    return RoleResponse.model_validate(role)


@router.delete("/{role_id}", status_code=204)
async def delete_role(role_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("roles.delete"))):
    service = RBACService(db)
    await service.delete_role(uuid.UUID(role_id))


@router.put("/{role_id}/permissions", response_model=RoleResponse)
async def set_permissions(role_id: str, body: RolePermissionUpdate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("roles.update"))):
    service = RBACService(db)
    role = await service.set_role_permissions(uuid.UUID(role_id), body.permission_ids)
    return RoleResponse.model_validate(role)


@router.get("/{role_id}/permissions", response_model=list[PermissionResponse])
async def get_role_permissions(role_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("roles.read"))):
    service = RBACService(db)
    role = await service.get_role(uuid.UUID(role_id))
    return [PermissionResponse.model_validate(rp.permission) for rp in role.permissions]


@perm_router.get("", response_model=list[PermissionResponse])
async def list_permissions(db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("roles.read"))):
    service = RBACService(db)
    perms = await service.list_permissions()
    return [PermissionResponse.model_validate(p) for p in perms]
