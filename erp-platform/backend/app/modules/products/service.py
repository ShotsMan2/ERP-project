import uuid
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.products.models import Product, ProductVariant, Category
from app.modules.products.repository import ProductRepository, CategoryRepository


class ProductService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = ProductRepository(db)

    async def create_product(self, data: dict) -> Product:
        existing = await self.repo.get_by_sku(data["sku"])
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="SKU already exists")
        if data.get("barcode"):
            existing_barcode = await self.repo.get_by_barcode(data["barcode"])
            if existing_barcode:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Barcode already exists")
        if data.get("category_id"):
            data["category_id"] = uuid.UUID(data["category_id"])
        if data.get("company_id"):
            data["company_id"] = uuid.UUID(data["company_id"])
        return await self.repo.create(**data)

    async def get_product(self, product_id: uuid.UUID) -> Product:
        product = await self.repo.get_by_id(product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return product

    async def update_product(self, product_id: uuid.UUID, data: dict) -> Product:
        product = await self.get_product(product_id)
        if data.get("category_id"):
            data["category_id"] = uuid.UUID(data["category_id"])
        return await self.repo.update(product, **data)

    async def delete_product(self, product_id: uuid.UUID) -> None:
        product = await self.get_product(product_id)
        await self.repo.delete(product)

    async def list_products(self, company_id: uuid.UUID | None = None, category_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Product], int]:
        return await self.repo.list(company_id=company_id, category_id=category_id, skip=skip, limit=limit)

    async def search_products(self, q: str, company_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Product], int]:
        return await self.repo.search(q, company_id=company_id, skip=skip, limit=limit)

    async def create_variant(self, product_id: uuid.UUID, data: dict) -> ProductVariant:
        product = await self.get_product(product_id)
        existing = await self.repo.get_by_sku(data["sku"])
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Variant SKU already exists")
        data["product_id"] = product_id
        return await self.repo.create_variant(**data)


class CategoryService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = CategoryRepository(db)

    async def create_category(self, data: dict) -> Category:
        return await self.repo.create(**data)

    async def get_category(self, cat_id: uuid.UUID) -> Category:
        cat = await self.repo.get_by_id(cat_id)
        if not cat:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        return cat

    async def update_category(self, cat_id: uuid.UUID, data: dict) -> Category:
        cat = await self.get_category(cat_id)
        return await self.repo.update(cat, **data)

    async def delete_category(self, cat_id: uuid.UUID) -> None:
        cat = await self.get_category(cat_id)
        await self.repo.delete(cat)

    async def list_categories(self, company_id: uuid.UUID | None = None) -> list[Category]:
        return await self.repo.list(company_id=company_id)

    async def get_tree(self, company_id: uuid.UUID | None = None) -> list[dict]:
        roots = await self.repo.get_tree(company_id=company_id)
        def build_tree(cats: list[Category]) -> list[dict]:
            return [{"id": str(c.id), "name": c.name, "slug": c.slug, "children": build_tree(c.children)} for c in cats]
        return build_tree(roots)
