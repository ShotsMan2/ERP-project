import uuid
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.finance.models import BankAccount, BankTransaction, Budget


class BankRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_account_by_id(self, account_id: uuid.UUID) -> Optional[BankAccount]:
        result = await self.db.execute(select(BankAccount).where(BankAccount.id == account_id, BankAccount.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list_accounts(self, company_id: uuid.UUID | None = None) -> list[BankAccount]:
        query = select(BankAccount).where(BankAccount.deleted_at.is_(None))
        if company_id:
            query = query.where(BankAccount.company_id == company_id)
        result = await self.db.execute(query.order_by(BankAccount.name))
        return result.scalars().all()

    async def create_account(self, **kwargs) -> BankAccount:
        account = BankAccount(**kwargs)
        self.db.add(account)
        await self.db.flush()
        return account

    async def update_account(self, account: BankAccount, **kwargs) -> BankAccount:
        for key, value in kwargs.items():
            if value is not None:
                setattr(account, key, value)
        await self.db.flush()
        return account

    async def list_transactions(self, bank_account_id: uuid.UUID | None = None, reconciled: bool | None = None, skip: int = 0, limit: int = 100) -> tuple[list[BankTransaction], int]:
        query = select(BankTransaction)
        count_query = select(func.count(BankTransaction.id))
        if bank_account_id:
            query = query.where(BankTransaction.bank_account_id == bank_account_id)
            count_query = count_query.where(BankTransaction.bank_account_id == bank_account_id)
        if reconciled is not None:
            query = query.where(BankTransaction.reconciled == reconciled)
            count_query = count_query.where(BankTransaction.reconciled == reconciled)
        query = query.offset(skip).limit(limit).order_by(BankTransaction.transaction_date.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0

    async def create_transaction(self, **kwargs) -> BankTransaction:
        txn = BankTransaction(**kwargs)
        self.db.add(txn)
        await self.db.flush()
        return txn

    async def update_transaction(self, txn: BankTransaction, **kwargs) -> BankTransaction:
        for key, value in kwargs.items():
            if value is not None:
                setattr(txn, key, value)
        await self.db.flush()
        return txn


class BudgetRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, budget_id: uuid.UUID) -> Optional[Budget]:
        result = await self.db.execute(select(Budget).where(Budget.id == budget_id, Budget.deleted_at.is_(None)))
        return result.scalar_one_or_none()

    async def list(self, company_id: uuid.UUID | None = None, fiscal_year_id: uuid.UUID | None = None) -> list[Budget]:
        query = select(Budget).where(Budget.deleted_at.is_(None))
        if company_id:
            query = query.where(Budget.company_id == company_id)
        if fiscal_year_id:
            query = query.where(Budget.fiscal_year_id == fiscal_year_id)
        result = await self.db.execute(query.order_by(Budget.budgeted_amount.desc()))
        return result.scalars().all()

    async def create(self, **kwargs) -> Budget:
        budget = Budget(**kwargs)
        self.db.add(budget)
        await self.db.flush()
        return budget

    async def update(self, budget: Budget, **kwargs) -> Budget:
        for key, value in kwargs.items():
            if value is not None:
                setattr(budget, key, value)
        await self.db.flush()
        return budget
