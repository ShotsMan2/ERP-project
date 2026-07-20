import uuid
from typing import Optional

from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.products.models import Product, ProductVariant, Category


class ProductRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, product_id: uuid.UUID) -> Optional[Product]:
        result = await self.db.execute(select(Product).where(Product.id == product_id, Product.deleted_at.is_(None)).options(selectinload(Product.variants)))
        return result.scalar_one_or_none()

    async def get_by_sku(self, sku: str) -> Optional[Product]:
        result = await self.db.execute(select(Product).where(Product.sku == sku, Product.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def get_by_barcode(self, barcode: str) -> Optional[Product]:
        result = await self.db.execute(select(Product).where(Product.barcode == barcode, Product.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None, category_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Product], int]:
        query = select(Product).where(Product.deleted_at.is_(None))
        count_query = select(func.count(Product.id)).where(Product.deleted_at.is_(None))
        if company_id:
            query = query.where(Product.company_id == company_id)
            count_query = count_query.where(Product.company_id == company_id)
        if category_id:
            query = query.where(Product.category_id == category_id)
            count_query = count_query.where(Product.category_id == category_id)
        query = query.offset(skip).limit(limit).order_by(Product.name)
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def search(self, q: str, company_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Product], int]:
        query = select(Product).where(Product.deleted_at.is_(None), or_(Product.name.ilike(f"%{q}%"), Product.sku.ilike(f"%{q}%"), Product.barcode.ilike(f"%{q}%")))
        count_query = select(func.count(Product.id)).where(Product.deleted_at.is_(None), or_(Product.name.ilike(f"%{q}%"), Product.sku.ilike(f"%{q}%"), Product.barcode.ilike(f"%{q}%")))
        if company_id:
            query = query.where(Product.company_id == company_id)
            count_query = count_query.where(Product.company_id == company_id)
        query = query.offset(skip).limit(limit).order_by(Product.name)
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> Product:
        product = Product(**kwargs)
        self.db.add(product)
        await self.db.flush()
        return product

    async def update(self, product: Product, **kwargs) -> Product:
        for key, value in kwargs.items():
            if value is not None:
                setattr(product, key, value)
        await self.db.flush()
        return product

    async def delete(self, product: Product) -> None:
        from datetime import datetime, timezone
        product.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()

    async def create_variant(self, **kwargs) -> ProductVariant:
        variant = ProductVariant(**kwargs)
        self.db.add(variant)
        await self.db.flush()
        return variant


class CategoryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, cat_id: uuid.UUID) -> Optional[Category]:
        result = await self.db.execute(select(Category).where(Category.id == cat_id, Category.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None) -> list[Category]:
        query = select(Category).where(Category.deleted_at.is_(None))
        if company_id:
            query = query.where(Category.company_id == company_id)
        result = await self.db.execute(query.order_by(Category.name))
        return result.scalars().all()

    async def create(self, **kwargs) -> Category:
        cat = Category(**kwargs)
        self.db.add(cat)
        await self.db.flush()
        return cat

    async def update(self, cat: Category, **kwargs) -> Category:
        for key, value in kwargs.items():
            if value is not None:
                setattr(cat, key, value)
        await self.db.flush()
        return cat

    async def delete(self, cat: Category) -> None:
        from datetime import datetime, timezone
        cat.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()

    async def get_tree(self, company_id: uuid.UUID | None = None) -> list[Category]:
        query = select(Category).where(Category.deleted_at.is_(None), Category.parent_id.is_(None))
        if company_id:
            query = query.where(Category.company_id == company_id)
        result = await self.db.execute(query.options(selectinload(Category.children)).order_by(Category.name))
        return result.scalars().all()
