from __future__ import annotations

from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.middleware.auth import AuthMiddleware
from app.middleware.audit import AuditMiddleware
from app.core.logging.middleware import CorrelationIDMiddleware
from app.core.logging.logger import setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    setup_logging()
    from app.core.cache.redis import redis_client
    try:
        await redis_client.initialize()
    except Exception:
        pass
    from app.core.search.elastic import es_client
    try:
        await es_client.initialize()
    except Exception:
        pass
    from app.core.events import event_bus
    try:
        await event_bus.initialize()
    except Exception:
        pass
    yield
    try:
        await redis_client.close()
    except Exception:
        pass
    try:
        await es_client.close()
    except Exception:
        pass
    try:
        await event_bus.close()
    except Exception:
        pass


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description=settings.APP_DESCRIPTION,
        docs_url=f"{settings.API_V1_PREFIX}/docs",
        redoc_url=f"{settings.API_V1_PREFIX}/redoc",
        openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
        allow_methods=settings.CORS_ALLOW_METHODS,
        allow_headers=settings.CORS_ALLOW_HEADERS,
    )
    app.add_middleware(CorrelationIDMiddleware)
    app.add_middleware(AuthMiddleware)
    app.add_middleware(AuditMiddleware)

    from app.middleware.cors import setup_cors
    setup_cors(app)

    api_prefix = settings.API_V1_PREFIX

    @app.get(f"{api_prefix}/health", tags=["System"])
    async def health_check() -> dict:
        return {
            "status": "healthy",
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT,
        }

    @app.get("/", tags=["System"])
    async def root() -> dict:
        return {
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT,
            "docs": f"{api_prefix}/docs",
        }

    # ── Core / System Modules ───────────────────────────────────────
    from app.modules.auth.router import router as auth_router
    app.include_router(auth_router, prefix=f"{api_prefix}/auth", tags=["Authentication"])

    from app.modules.admin.router import router as admin_router
    app.include_router(admin_router, prefix=f"{api_prefix}/admin", tags=["Admin"])

    from app.modules.audit.router import router as audit_router
    app.include_router(audit_router, prefix=api_prefix)

    from app.modules.notifications.router import router as notifications_router
    app.include_router(notifications_router, prefix=f"{api_prefix}/notifications", tags=["Notifications"])

    from app.modules.documents.router import router as documents_router
    app.include_router(documents_router, prefix=api_prefix)

    from app.modules.companies.router import router as companies_router
    app.include_router(companies_router, prefix=f"{api_prefix}/companies", tags=["Companies"])
    from app.modules.companies.router import branch_router, dept_router
    app.include_router(branch_router, prefix=f"{api_prefix}/branches")
    app.include_router(dept_router, prefix=f"{api_prefix}/departments")

    from app.modules.integrations.router import router as integrations_router
    app.include_router(integrations_router, prefix=f"{api_prefix}/integrations", tags=["Integrations"])

    from app.modules.ai.router import router as ai_router
    app.include_router(ai_router, prefix=api_prefix)

    # ── IAM Modules ─────────────────────────────────────────────────
    from app.modules.users.router import router as users_router
    app.include_router(users_router, prefix=api_prefix)

    from app.modules.roles.router import router as roles_router
    app.include_router(roles_router, prefix=api_prefix)
    from app.modules.roles.router import perm_router
    app.include_router(perm_router, prefix=api_prefix)

    from app.modules.settings.router import router as settings_router
    app.include_router(settings_router, prefix=api_prefix)

    # ── HR Modules ──────────────────────────────────────────────────
    from app.modules.employees.router import router as employees_router
    app.include_router(employees_router, prefix=api_prefix)

    from app.modules.hr.router import router as hr_router
    app.include_router(hr_router, prefix=f"{api_prefix}/hr", tags=["HR"])

    from app.modules.payroll.router import router as payroll_router
    app.include_router(payroll_router, prefix=api_prefix)

    # ── Product & Inventory Modules ─────────────────────────────────
    from app.modules.products.router import router as products_router
    app.include_router(products_router, prefix=f"{api_prefix}/products", tags=["Products"])
    from app.modules.products.router import cat_router
    app.include_router(cat_router, prefix=f"{api_prefix}/categories")

    from app.modules.inventory.router import router as inventory_router
    app.include_router(inventory_router, prefix=api_prefix)

    # ── Procurement & Sales Modules ─────────────────────────────────
    from app.modules.purchasing.router import router as purchasing_router
    app.include_router(purchasing_router, prefix=f"{api_prefix}/purchasing", tags=["Purchasing"])

    from app.modules.sales.router import router as sales_router
    app.include_router(sales_router, prefix=f"{api_prefix}/sales", tags=["Sales"])

    from app.modules.crm.router import router as crm_router
    app.include_router(crm_router, prefix=f"{api_prefix}/crm", tags=["CRM"])

    # ── Financial Modules ───────────────────────────────────────────
    from app.modules.accounting.router import router as accounting_router
    app.include_router(accounting_router, prefix=f"{api_prefix}/accounting", tags=["Accounting"])

    from app.modules.finance.router import router as finance_router
    app.include_router(finance_router, prefix=f"{api_prefix}/finance", tags=["Finance"])

    # ── Project & Workflow Modules ──────────────────────────────────
    from app.modules.projects.router import router as projects_router
    app.include_router(projects_router, prefix=f"{api_prefix}/projects", tags=["Projects"])

    from app.modules.workflows.router import router as workflows_router
    app.include_router(workflows_router, prefix=api_prefix)

    from app.modules.reports.router import router as reports_router
    app.include_router(reports_router, prefix=api_prefix)

    return app


app = create_app()
