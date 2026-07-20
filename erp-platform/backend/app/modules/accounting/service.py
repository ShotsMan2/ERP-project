import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.accounting.models import ChartOfAccount, Journal, Invoice, Payment, TaxRate
from app.modules.accounting.repository import AccountRepository, JournalRepository, InvoiceRepository, PaymentRepository, TaxRepository


class AccountService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = AccountRepository(db)

    async def create_account(self, data: dict) -> ChartOfAccount:
        return await self.repo.create(**data)

    async def get_account(self, account_id: uuid.UUID) -> ChartOfAccount:
        account = await self.repo.get_by_id(account_id)
        if not account:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
        return account

    async def update_account(self, account_id: uuid.UUID, data: dict) -> ChartOfAccount:
        account = await self.get_account(account_id)
        return await self.repo.update(account, **data)

    async def list_accounts(self, company_id: uuid.UUID | None = None, account_type: str | None = None) -> list[ChartOfAccount]:
        return await self.repo.list(company_id=company_id, account_type=account_type)


class JournalService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = JournalRepository(db)

    async def create_journal(self, data: dict) -> Journal:
        entries_data = data.pop("entries", [])
        journal = await self.repo.create(**data)
        total_debit = 0.0
        total_credit = 0.0
        for entry_data in entries_data:
            if entry_data.get("account_id"):
                entry_data["account_id"] = uuid.UUID(entry_data["account_id"])
            total_debit += entry_data.get("debit_amount", 0)
            total_credit += entry_data.get("credit_amount", 0)
            await self.repo.create_entry(journal_id=journal.id, **entry_data)
        if abs(total_debit - total_credit) > 0.01:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Debit and credit totals must match")
        await self.repo.update(journal, total_debit=total_debit, total_credit=total_credit)
        return await self.repo.get_by_id(journal.id)

    async def get_journal(self, journal_id: uuid.UUID) -> Journal:
        journal = await self.repo.get_by_id(journal_id)
        if not journal:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal not found")
        return journal

    async def post_journal(self, journal_id: uuid.UUID) -> Journal:
        journal = await self.get_journal(journal_id)
        if journal.status == "posted":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Journal already posted")
        return await self.repo.update(journal, status="posted", posted_at=datetime.now(timezone.utc))

    async def list_journals(self, company_id: uuid.UUID | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Journal], int]:
        return await self.repo.list(company_id=company_id, status=status, skip=skip, limit=limit)


class InvoiceService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = InvoiceRepository(db)

    async def create_invoice(self, data: dict) -> Invoice:
        existing = await self.repo.get_by_number(data["invoice_number"])
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Invoice number already exists")
        lines_data = data.pop("lines", [])
        inv = await self.repo.create(**data)
        total = 0.0
        tax_total = 0.0
        for line_data in lines_data:
            line_total = line_data["quantity"] * line_data["unit_price"]
            line_tax = line_total * line_data.get("tax_rate", 0) / 100
            total += line_total
            tax_total += line_tax
            await self.repo.create_line(invoice_id=inv.id, **line_data, total=line_total)
        await self.repo.update(inv, total_amount=total, tax_amount=tax_total)
        return await self.repo.get_by_id(inv.id)

    async def get_invoice(self, invoice_id: uuid.UUID) -> Invoice:
        inv = await self.repo.get_by_id(invoice_id)
        if not inv:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
        return inv

    async def list_invoices(self, company_id: uuid.UUID | None = None, direction: str | None = None, status: str | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Invoice], int]:
        return await self.repo.list(company_id=company_id, direction=direction, status=status, skip=skip, limit=limit)

    async def record_payment(self, data: dict) -> Payment:
        invoice_id = uuid.UUID(data["invoice_id"])
        inv = await self.get_invoice(invoice_id)
        amount = data["amount"]
        new_paid = inv.paid_amount + amount
        if new_paid > inv.total_amount + 0.01:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Payment exceeds invoice total")
        pay_repo = PaymentRepository(self.db)
        payment = await pay_repo.create(**data)
        inv.paid_amount = new_paid
        if abs(new_paid - inv.total_amount) < 0.01:
            inv.status = "paid"
        else:
            inv.status = "partial"
        await self.db.flush()
        return payment


class TaxService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = TaxRepository(db)

    async def create_tax_rate(self, data: dict) -> TaxRate:
        return await self.repo.create(**data)

    async def list_tax_rates(self, company_id: uuid.UUID | None = None) -> list[TaxRate]:
        return await self.repo.list(company_id=company_id)

    async def get_tax_report(self, company_id: uuid.UUID, from_date: str, to_date: str) -> dict:
        from app.modules.accounting.repository import InvoiceRepository
        inv_repo = InvoiceRepository(self.db)
        invoices, _ = await inv_repo.list(company_id=company_id, direction="AR")
        total_tax = sum(inv.tax_amount for inv in invoices)
        total_sales = sum(inv.total_amount for inv in invoices)
        return {"company_id": str(company_id), "total_sales": total_sales, "total_tax": total_tax, "invoice_count": len(invoices)}
