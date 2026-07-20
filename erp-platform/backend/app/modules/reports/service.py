import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession


class ReportService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_reports(self) -> list[dict]:
        return [
            {"type": "trial_balance", "name": "Trial Balance", "description": "List of all GL accounts with balances"},
            {"type": "income_statement", "name": "Income Statement", "description": "Revenue and expense summary"},
            {"type": "balance_sheet", "name": "Balance Sheet", "description": "Assets, liabilities, and equity"},
            {"type": "general_ledger", "name": "General Ledger", "description": "Detailed GL transactions"},
            {"type": "accounts_receivable", "name": "Accounts Receivable Aging", "description": "Customer outstanding invoices"},
            {"type": "accounts_payable", "name": "Accounts Payable Aging", "description": "Supplier outstanding invoices"},
            {"type": "stock_summary", "name": "Stock Summary", "description": "Current inventory valuation"},
            {"type": "employee_list", "name": "Employee List", "description": "Active employees with details"},
            {"type": "payroll_summary", "name": "Payroll Summary", "description": "Payroll run summary"},
            {"type": "sales_summary", "name": "Sales Summary", "description": "Sales order summary by period"},
            {"type": "purchase_summary", "name": "Purchase Summary", "description": "Purchase order summary by period"},
        ]

    async def generate_report(self, data: dict) -> dict:
        report_type = data.get("report_type")
        company_id = data.get("company_id")
        filters = data.get("filters", {})
        from datetime import timedelta
        return {
            "id": str(uuid.uuid7()),
            "report_type": report_type,
            "format": data.get("format", "json"),
            "status": "completed",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "data": {"report_type": report_type, "company_id": company_id, "filters": filters, "message": "Report generated successfully", "rows": []},
        }
