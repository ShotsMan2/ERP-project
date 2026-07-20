import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.finance.schemas import BankAccountCreate, BankAccountResponse, BankTransactionResponse, BudgetCreate, BudgetResponse
from app.modules.finance.service import BankService, BudgetService

router = APIRouter(tags=["Finance"])


@router.get("/bank/accounts", response_model=list[BankAccountResponse])
async def list_bank_accounts(company_id: str | None = Query(None), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("finance.read"))):
    service = BankService(db)
    accounts = await service.list_accounts(company_id=uuid.UUID(company_id) if company_id else None)
    return [BankAccountResponse.model_validate(a) for a in accounts]


@router.get("/bank/accounts/{account_id}", response_model=BankAccountResponse)
async def get_bank_account(account_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("finance.read"))):
    service = BankService(db)
    account = await service.get_account(uuid.UUID(account_id))
    return BankAccountResponse.model_validate(account)


@router.post("/bank/accounts", response_model=BankAccountResponse, status_code=201)
async def create_bank_account(body: BankAccountCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("finance.create"))):
    service = BankService(db)
    account = await service.create_account(body.model_dump(exclude_none=True))
    return BankAccountResponse.model_validate(account)


@router.get("/bank/transactions", response_model=list[BankTransactionResponse])
async def list_bank_transactions(bank_account_id: str | None = Query(None), reconciled: bool | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("finance.read"))):
    service = BankService(db)
    items, _ = await service.list_transactions(
        bank_account_id=uuid.UUID(bank_account_id) if bank_account_id else None,
        reconciled=reconciled,
        skip=(page - 1) * size,
        limit=size,
    )
    return [BankTransactionResponse.model_validate(t) for t in items]


@router.post("/bank/reconcile")
async def reconcile_transactions(body: dict, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("finance.update"))):
    service = BankService(db)
    results = await service.reconcile(body.get("transaction_ids", []))
    return {"reconciled": len(results)}


@router.get("/budgets", response_model=list[BudgetResponse])
async def list_budgets(company_id: str | None = Query(None), fiscal_year_id: str | None = Query(None), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("finance.read"))):
    service = BudgetService(db)
    budgets = await service.list_budgets(company_id=uuid.UUID(company_id) if company_id else None, fiscal_year_id=uuid.UUID(fiscal_year_id) if fiscal_year_id else None)
    return [BudgetResponse.model_validate(b) for b in budgets]


@router.post("/budgets", response_model=BudgetResponse, status_code=201)
async def create_budget(body: BudgetCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("finance.create"))):
    service = BudgetService(db)
    budget = await service.create_budget(body.model_dump(exclude_none=True))
    return BudgetResponse.model_validate(budget)


@router.put("/budgets/{budget_id}", response_model=BudgetResponse)
async def update_budget(budget_id: str, body: dict, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("finance.update"))):
    service = BudgetService(db)
    budget = await service.update_budget(uuid.UUID(budget_id), body)
    return BudgetResponse.model_validate(budget)
