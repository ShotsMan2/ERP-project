import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.accounting.schemas import AccountCreate, AccountResponse, JournalCreate, JournalResponse, InvoiceCreate, InvoiceResponse, PaymentCreate, TaxRateCreate, TaxRateResponse
from app.modules.accounting.service import AccountService, JournalService, InvoiceService, TaxService

router = APIRouter(tags=["Accounting"])


@router.get("/chart-of-accounts", response_model=list[AccountResponse])
async def list_accounts(company_id: str | None = Query(None), account_type: str | None = Query(None), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("accounting.read"))):
    service = AccountService(db)
    accounts = await service.list_accounts(company_id=uuid.UUID(company_id) if company_id else None, account_type=account_type)
    return [AccountResponse.model_validate(a) for a in accounts]


@router.get("/chart-of-accounts/{account_id}", response_model=AccountResponse)
async def get_account(account_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("accounting.read"))):
    service = AccountService(db)
    account = await service.get_account(uuid.UUID(account_id))
    return AccountResponse.model_validate(account)


@router.post("/chart-of-accounts", response_model=AccountResponse, status_code=201)
async def create_account(body: AccountCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("accounting.create"))):
    service = AccountService(db)
    account = await service.create_account(body.model_dump(exclude_none=True))
    return AccountResponse.model_validate(account)


@router.put("/chart-of-accounts/{account_id}", response_model=AccountResponse)
async def update_account(account_id: str, body: dict, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("accounting.update"))):
    service = AccountService(db)
    account = await service.update_account(uuid.UUID(account_id), body)
    return AccountResponse.model_validate(account)


@router.get("/journals", response_model=list[JournalResponse])
async def list_journals(company_id: str | None = Query(None), status: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("accounting.read"))):
    service = JournalService(db)
    items, _ = await service.list_journals(company_id=uuid.UUID(company_id) if company_id else None, status=status, skip=(page - 1) * size, limit=size)
    return [JournalResponse.model_validate(j) for j in items]


@router.get("/journals/{journal_id}", response_model=JournalResponse)
async def get_journal(journal_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("accounting.read"))):
    service = JournalService(db)
    journal = await service.get_journal(uuid.UUID(journal_id))
    return JournalResponse.model_validate(journal)


@router.post("/journals", response_model=JournalResponse, status_code=201)
async def create_journal(body: JournalCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("accounting.create"))):
    service = JournalService(db)
    journal = await service.create_journal(body.model_dump(exclude_none=True))
    return JournalResponse.model_validate(journal)


@router.post("/journals/{journal_id}/post", response_model=JournalResponse)
async def post_journal(journal_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("accounting.post"))):
    service = JournalService(db)
    journal = await service.post_journal(uuid.UUID(journal_id))
    return JournalResponse.model_validate(journal)


@router.get("/invoices", response_model=list[InvoiceResponse])
async def list_invoices(company_id: str | None = Query(None), direction: str | None = Query(None), status: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("accounting.read"))):
    service = InvoiceService(db)
    items, _ = await service.list_invoices(company_id=uuid.UUID(company_id) if company_id else None, direction=direction, status=status, skip=(page - 1) * size, limit=size)
    return [InvoiceResponse.model_validate(inv) for inv in items]


@router.get("/invoices/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice(invoice_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("accounting.read"))):
    service = InvoiceService(db)
    inv = await service.get_invoice(uuid.UUID(invoice_id))
    return InvoiceResponse.model_validate(inv)


@router.post("/invoices", response_model=InvoiceResponse, status_code=201)
async def create_invoice(body: InvoiceCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("accounting.create"))):
    service = InvoiceService(db)
    inv = await service.create_invoice(body.model_dump(exclude_none=True))
    return InvoiceResponse.model_validate(inv)


@router.post("/invoices/{invoice_id}/payment")
async def record_payment(invoice_id: str, body: PaymentCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("accounting.create"))):
    service = InvoiceService(db)
    payment = await service.record_payment(body.model_dump(exclude_none=True))
    return {"id": str(payment.id), "amount": payment.amount, "payment_date": payment.payment_date, "reference": payment.reference}


@router.get("/tax-rates", response_model=list[TaxRateResponse])
async def list_tax_rates(company_id: str | None = Query(None), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("accounting.read"))):
    service = TaxService(db)
    rates = await service.list_tax_rates(company_id=uuid.UUID(company_id) if company_id else None)
    return [TaxRateResponse.model_validate(r) for r in rates]


@router.post("/tax-rates", response_model=TaxRateResponse, status_code=201)
async def create_tax_rate(body: TaxRateCreate, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("accounting.create"))):
    service = TaxService(db)
    tax = await service.create_tax_rate(body.model_dump(exclude_none=True))
    return TaxRateResponse.model_validate(tax)


@router.get("/tax/reports")
async def tax_report(company_id: str, from_date: str, to_date: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("accounting.read"))):
    service = TaxService(db)
    return await service.get_tax_report(uuid.UUID(company_id), from_date, to_date)
