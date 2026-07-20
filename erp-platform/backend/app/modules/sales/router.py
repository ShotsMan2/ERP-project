import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.sales.schemas import CustomerCreate, CustomerResponse, SalesOrderCreate, SalesOrderUpdate, SalesOrderResponse, ShipmentCreate, ShipmentResponse
from app.modules.sales.service import CustomerService, SalesOrderService, ShipmentService

router = APIRouter(tags=["Sales"])


@router.get("/customers", response_model=list[CustomerResponse])
async def list_customers(company_id: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("sales.read"))):
    service = CustomerService(db)
    items, _ = await service.list_customers(company_id=uuid.UUID(company_id) if company_id else None, skip=(page - 1) * size, limit=size)
    return [CustomerResponse.model_validate(c) for c in items]


@router.get("/customers/{customer_id}", response_model=CustomerResponse)
async def get_customer(customer_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("sales.read"))):
    service = CustomerService(db)
    customer = await service.get_customer(uuid.UUID(customer_id))
    return CustomerResponse.model_validate(customer)


@router.get("/customers/{customer_id}/360")
async def customer_360(customer_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("sales.read"))):
    service = CustomerService(db)
    return await service.get_360_view(uuid.UUID(customer_id))


@router.post("/customers", response_model=CustomerResponse, status_code=201)
async def create_customer(body: CustomerCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("sales.create"))):
    service = CustomerService(db)
    customer = await service.create_customer(body.model_dump(exclude_none=True))
    return CustomerResponse.model_validate(customer)


@router.put("/customers/{customer_id}", response_model=CustomerResponse)
async def update_customer(customer_id: str, body: dict, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("sales.update"))):
    service = CustomerService(db)
    customer = await service.update_customer(uuid.UUID(customer_id), body)
    return CustomerResponse.model_validate(customer)


@router.get("/sales-orders", response_model=list[SalesOrderResponse])
async def list_sos(company_id: str | None = Query(None), customer_id: str | None = Query(None), status: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("sales.read"))):
    service = SalesOrderService(db)
    items, _ = await service.list_sos(
        company_id=uuid.UUID(company_id) if company_id else None,
        customer_id=uuid.UUID(customer_id) if customer_id else None,
        status=status,
        skip=(page - 1) * size,
        limit=size,
    )
    return [SalesOrderResponse.model_validate(so) for so in items]


@router.get("/sales-orders/{so_id}", response_model=SalesOrderResponse)
async def get_so(so_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("sales.read"))):
    service = SalesOrderService(db)
    so = await service.get_so(uuid.UUID(so_id))
    return SalesOrderResponse.model_validate(so)


@router.post("/sales-orders", response_model=SalesOrderResponse, status_code=201)
async def create_so(body: SalesOrderCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("sales.create"))):
    service = SalesOrderService(db)
    so = await service.create_so(body.model_dump(exclude_none=True))
    return SalesOrderResponse.model_validate(so)


@router.put("/sales-orders/{so_id}", response_model=SalesOrderResponse)
async def update_so(so_id: str, body: SalesOrderUpdate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("sales.update"))):
    service = SalesOrderService(db)
    so = await service.update_so(uuid.UUID(so_id), body.model_dump(exclude_none=True))
    return SalesOrderResponse.model_validate(so)


@router.post("/sales-orders/{so_id}/approve", response_model=SalesOrderResponse)
async def approve_so(so_id: str, user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("sales.approve"))):
    service = SalesOrderService(db)
    so = await service.approve_so(uuid.UUID(so_id), uuid.UUID(user_id))
    return SalesOrderResponse.model_validate(so)


@router.post("/sales-orders/{so_id}/ship", response_model=ShipmentResponse)
async def ship_so(so_id: str, body: ShipmentCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("sales.ship"))):
    service = ShipmentService(db)
    shipment = await service.create_shipment(body.model_dump(exclude_none=True))
    return ShipmentResponse.model_validate(shipment)
