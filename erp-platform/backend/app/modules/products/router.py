import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.products.schemas import ProductCreate, ProductUpdate, ProductResponse, VariantCreate, VariantResponse, CategoryCreate, CategoryResponse, CategoryTree
from app.modules.products.service import ProductService, CategoryService

router = APIRouter(tags=["Products"])
cat_router = APIRouter(tags=["Categories"])


@router.get("/products", response_model=list[ProductResponse])
async def list_products(category_id: str | None = Query(None), company_id: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("products.read"))):
    service = ProductService(db)
    items, _ = await service.list_products(
        company_id=uuid.UUID(company_id) if company_id else None,
        category_id=uuid.UUID(category_id) if category_id else None,
        skip=(page - 1) * size,
        limit=size,
    )
    return [ProductResponse.model_validate(p) for p in items]


@router.get("/products/search", response_model=list[ProductResponse])
async def search_products(q: str, company_id: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("products.read"))):
    service = ProductService(db)
    items, _ = await service.search_products(q, company_id=uuid.UUID(company_id) if company_id else None, skip=(page - 1) * size, limit=size)
    return [ProductResponse.model_validate(p) for p in items]


@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("products.read"))):
    service = ProductService(db)
    product = await service.get_product(uuid.UUID(product_id))
    return ProductResponse.model_validate(product)


@router.post("/products", response_model=ProductResponse, status_code=201)
async def create_product(body: ProductCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("products.create"))):
    service = ProductService(db)
    product = await service.create_product(body.model_dump(exclude_none=True))
    return ProductResponse.model_validate(product)


@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, body: ProductUpdate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("products.update"))):
    service = ProductService(db)
    product = await service.update_product(uuid.UUID(product_id), body.model_dump(exclude_none=True))
    return ProductResponse.model_validate(product)


@router.delete("/products/{product_id}", status_code=204)
async def delete_product(product_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("products.delete"))):
    service = ProductService(db)
    await service.delete_product(uuid.UUID(product_id))


@router.post("/products/{product_id}/variants", response_model=VariantResponse, status_code=201)
async def create_variant(product_id: str, body: VariantCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("products.create"))):
    service = ProductService(db)
    variant = await service.create_variant(uuid.UUID(product_id), body.model_dump(exclude_none=True))
    return VariantResponse.model_validate(variant)


@cat_router.get("/categories", response_model=list[CategoryResponse])
async def list_categories(company_id: str | None = Query(None), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("products.read"))):
    service = CategoryService(db)
    cats = await service.list_categories(company_id=uuid.UUID(company_id) if company_id else None)
    return [CategoryResponse.model_validate(c) for c in cats]


@cat_router.get("/categories/tree")
async def category_tree(company_id: str | None = Query(None), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("products.read"))):
    service = CategoryService(db)
    return await service.get_tree(company_id=uuid.UUID(company_id) if company_id else None)


@cat_router.get("/categories/{cat_id}", response_model=CategoryResponse)
async def get_category(cat_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("products.read"))):
    service = CategoryService(db)
    cat = await service.get_category(uuid.UUID(cat_id))
    return CategoryResponse.model_validate(cat)


@cat_router.post("/categories", response_model=CategoryResponse, status_code=201)
async def create_category(body: CategoryCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("products.create"))):
    service = CategoryService(db)
    cat = await service.create_category(body.model_dump(exclude_none=True))
    return CategoryResponse.model_validate(cat)


@cat_router.put("/categories/{cat_id}", response_model=CategoryResponse)
async def update_category(cat_id: str, body, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("products.update"))):
    service = CategoryService(db)
    cat = await service.update_category(uuid.UUID(cat_id), body.model_dump(exclude_none=True) if hasattr(body, 'model_dump') else {})
    return CategoryResponse.model_validate(cat)


@cat_router.delete("/categories/{cat_id}", status_code=204)
async def delete_category(cat_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("products.delete"))):
    service = CategoryService(db)
    await service.delete_category(uuid.UUID(cat_id))
