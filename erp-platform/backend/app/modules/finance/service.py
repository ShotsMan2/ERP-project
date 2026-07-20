import uuid
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.finance.models import BankAccount, Budget
from app.modules.finance.repository import BankRepository, BudgetRepository


class BankService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = BankRepository(db)

    async def create_account(self, data: dict) -> BankAccount:
        return await self.repo.create_account(**data)

    async def get_account(self, account_id: uuid.UUID) -> BankAccount:
        account = await self.repo.get_account_by_id(account_id)
        if not account:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bank account not found")
        return account

    async def list_accounts(self, company_id: uuid.UUID | None = None) -> list[BankAccount]:
        return await self.repo.list_accounts(company_id=company_id)

    async def list_transactions(self, bank_account_id: uuid.UUID | None = None, reconciled: bool | None = None, skip: int = 0, limit: int = 100) -> tuple[list, int]:
        return await self.repo.list_transactions(bank_account_id=bank_account_id, reconciled=reconciled, skip=skip, limit=limit)

    async def reconcile(self, transaction_ids: list[str]) -> list:
        results = []
        for txn_id in transaction_ids:
            txn = await self.repo.get_by_id(uuid.UUID(txn_id))
            if txn:
                txn = await self.repo.update_transaction(txn, reconciled=True, status="cleared")
                results.append(txn)
        return results


class BudgetService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = BudgetRepository(db)

    async def create_budget(self, data: dict) -> Budget:
        return await self.repo.create(**data)

    async def get_budget(self, budget_id: uuid.UUID) -> Budget:
        budget = await self.repo.get_by_id(budget_id)
        if not budget:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
        return budget

    async def update_budget(self, budget_id: uuid.UUID, data: dict) -> Budget:
        budget = await self.get_budget(budget_id)
        return await self.repo.update(budget, **data)

    async def list_budgets(self, company_id: uuid.UUID | None = None, fiscal_year_id: uuid.UUID | None = None) -> list[Budget]:
        return await self.repo.list(company_id=company_id, fiscal_year_id=fiscal_year_id)
