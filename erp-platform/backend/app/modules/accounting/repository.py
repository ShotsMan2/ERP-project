import uuid
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.accounting.models import ChartOfAccount, FiscalYear, Journal, JournalEntry, Invoice, InvoiceLine, Payment, TaxRate


class AccountRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, account_id: uuid.UUID) -> Optional[ChartOfAccount]:
        result = await self.db.execute(select(ChartOfAccount).where(ChartOfAccount.id == account_id, ChartOfAccount.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def get_by_code(self, code: str, company_id: uuid.UUID) -> Optional[ChartOfAccount]:
        result = await self.db.execute(select(ChartOfAccount).where(ChartOfAccount.code == code, ChartOfAccount.company_id == company_id, ChartOfAccount.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None, account_type: str | None = None) -> list[ChartOfAccount]:
        query = select(ChartOfAccount).where(ChartOfAccount.deleted_at.is_(None))
        if company_id:
            query = query.where(ChartOfAccount.company_id == company_id)
        if account_type:
            query = query.where(ChartOfAccount.type == account_type)
        result = await self.db.execute(query.order_by(ChartOfAccount.code))
        return result.scalars().all()

    async def create(self, **kwargs) -> ChartOfAccount:
        account = ChartOfAccount(**kwargs)
        self.db.add(account)
        await self.db.flush()
        return account

    async def update(self, account: ChartOfAccount, **kwargs) -> ChartOfAccount:
        for key, value in kwargs.items():
            if value is not None:
                setattr(account, key, value)
        await self.db.flush()
        return account


class JournalRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, journal_id: uuid.UUID) -> Optional[Journal]:
        result = await self.db.execute(select(Journal).where(Journal.id == journal_id, Journal.deleted_at.is_(None)).options(selectinload(Journal.entries)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Journal], int]:
        query = select(Journal).where(Journal.deleted_at.is_(None))
        count_query = select(func.count(Journal.id)).where(Journal.deleted_at.is_(None))
        if company_id:
            query = query.where(Journal.company_id == company_id)
            count_query = count_query.where(Journal.company_id == company_id)
        if status:
            query = query.where(Journal.status == status)
            count_query = count_query.where(Journal.status == status)
        query = query.offset(skip).limit(limit).order_by(Journal.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> Journal:
        journal = Journal(**kwargs)
        self.db.add(journal)
        await self.db.flush()
        return journal

    async def update(self, journal: Journal, **kwargs) -> Journal:
        for key, value in kwargs.items():
            if value is not None:
                setattr(journal, key, value)
        await self.db.flush()
        return journal

    async def create_entry(self, **kwargs) -> JournalEntry:
        entry = JournalEntry(**kwargs)
        self.db.add(entry)
        await self.db.flush()
        return entry


class InvoiceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, invoice_id: uuid.UUID) -> Optional[Invoice]:
        result = await self.db.execute(select(Invoice).where(Invoice.id == invoice_id, Invoice.deleted_at.is_(None)).options(selectinload(Invoice.lines), selectinload(Invoice.payments)))
        return result.scalar_one_or_none()

    async def get_by_number(self, invoice_number: str) -> Optional[Invoice]:
        result = await self.db.execute(select(Invoice).where(Invoice.invoice_number == invoice_number, Invoice.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None, direction: str | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Invoice], int]:
        query = select(Invoice).where(Invoice.deleted_at.is_(None))
        count_query = select(func.count(Invoice.id)).where(Invoice.deleted_at.is_(None))
        if company_id:
            query = query.where(Invoice.company_id == company_id)
            count_query = count_query.where(Invoice.company_id == company_id)
        if direction:
            query = query.where(Invoice.direction == direction)
            count_query = count_query.where(Invoice.direction == direction)
        if status:
            query = query.where(Invoice.status == status)
            count_query = count_query.where(Invoice.status == status)
        query = query.offset(skip).limit(limit).order_by(Invoice.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create(self, **kwargs) -> Invoice:
        inv = Invoice(**kwargs)
        self.db.add(inv)
        await self.db.flush()
        return inv

    async def update(self, inv: Invoice, **kwargs) -> Invoice:
        for key, value in kwargs.items():
            if value is not None:
                setattr(inv, key, value)
        await self.db.flush()
        return inv

    async def create_line(self, **kwargs) -> InvoiceLine:
        line = InvoiceLine(**kwargs)
        self.db.add(line)
        await self.db.flush()
        return line


class PaymentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, **kwargs) -> Payment:
        payment = Payment(**kwargs)
        self.db.add(payment)
        await self.db.flush()
        return payment


class TaxRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, tax_id: uuid.UUID) -> Optional[TaxRate]:
        result = await self.db.execute(select(TaxRate).where(TaxRate.id == tax_id, TaxRate.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None) -> list[TaxRate]:
        query = select(TaxRate).where(TaxRate.deleted_at.is_(None))
        if company_id:
            query = query.where(TaxRate.company_id == company_id)
        result = await self.db.execute(query.order_by(TaxRate.name))
        return result.scalars().all()

    async def create(self, **kwargs) -> TaxRate:
        tax = TaxRate(**kwargs)
        self.db.add(tax)
        await self.db.flush()
        return tax
