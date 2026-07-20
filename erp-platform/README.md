# ERP Platform

Enterprise Resource Planning system built with FastAPI, React, and PostgreSQL.

## Tech Stack

| Layer         | Technology                                                    |
| ------------- | ------------------------------------------------------------- |
| Backend       | Python 3.12, FastAPI, SQLAlchemy 2.0, Celery                  |
| Frontend      | React 18, TypeScript, Vite, Ant Design 5, Tailwind CSS        |
| Database      | PostgreSQL 16, Redis 7, Elasticsearch 8                        |
| Queue         | RabbitMQ 4                                                    |
| Storage       | MinIO (S3-compatible)                                         |
| Monitoring    | Prometheus, Grafana, Loki, OpenTelemetry                       |
| Orchestration | Docker Compose (dev), Kubernetes (prod)                        |
| CI/CD         | GitHub Actions / GitLab CI                                    |
| IaC           | Terraform                                                     |

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Client Layer                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ React    │  │ PWA      │  │ Third-   │  │ External         │   │
│  │ SPA      │  │ Mobile   │  │ Party    │  │ Integrations     │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘   │
└───────┼──────────────┼──────────────┼────────────────┼─────────────┘
        │              │              │                │
┌───────┼──────────────┼──────────────┼────────────────┼─────────────┐
│       │         Gateway / API Layer │                │             │
│  ┌────┴─────────────────────────────┴────────────────┴────────┐    │
│  │                   Nginx / API Gateway                      │    │
│  │         Rate Limiting · Auth · Routing · WAF               │    │
│  └────────────────────────────┬───────────────────────────────┘    │
│                               │                                    │
│  ┌────────────────────────────┼───────────────────────────────┐    │
│  │                    Application Layer                      │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │    │
│  │  │FastAPI   │ │FastAPI   │ │ Celery   │ │ WebSocket    │ │    │
│  │  │API       │ │Admin     │ │ Workers  │ │ Server       │ │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘ │    │
│  └──────────────────────────────────────────────────────────┘    │
│                               │                                    │
│  ┌────────────────────────────┼───────────────────────────────┐    │
│  │                    Infrastructure Layer                   │    │
│  │  ┌───────┐ ┌───────┐ ┌──────────┐ ┌──────┐ ┌─────────┐  │    │
│  │  │Postgre│ │Redis  │ │RabbitMQ  │ │MinIO │ │Elastic- │  │    │
│  │  │SQL 16 │ │7      │ │4         │ │(S3)  │ │search 8 │  │    │
│  │  └───────┘ └───────┘ └──────────┘ └──────┘ └─────────┘  │    │
│  └──────────────────────────────────────────────────────────┘    │
│                               │                                    │
│  ┌────────────────────────────┼───────────────────────────────┐    │
│  │                    Monitoring Layer                       │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │    │
│  │  │Prometheus│ │Grafana   │ │Loki      │ │OpenTelemetry │ │    │
│  │  │Metrics   │ │Dashboards│ │Logs      │ │Traces        │ │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘ │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

## Module List

| #  | Module                  | Code    | Description                          |
| -- | ----------------------- | ------- | ------------------------------------ |
| 1  | Authentication          | AUTH    | Login, MFA, SSO, session management  |
| 2  | User Management         | USER    | User CRUD, profiles, preferences     |
| 3  | Role & Permission       | ROLE    | RBAC engine, permission matrix       |
| 4  | Company Management      | CORE    | Multi-tenant company/branch setup    |
| 5  | Dashboard               | DASH    | Role-specific KPIs, charts, widgets  |
| 6  | Employee Management     | EMP     | Employee lifecycle, org chart        |
| 7  | Department Management   | DEPT    | Department hierarchy, cost centers   |
| 8  | Attendance              | ATTN    | Clock in/out, geo-tracking           |
| 9  | Leave Management        | LEAVE   | Leave policies, accruals, approvals  |
| 10 | Payroll                 | PAYR    | Salary computation, deductions, tax  |
| 11 | Recruitment             | RECR    | Job posts, applicants, interviews    |
| 12 | Performance Evaluation  | PERF    | Reviews, OKRs, 360 feedback          |
| 13 | Asset Management        | ASSET   | Fixed assets, depreciation           |
| 14 | Product Management      | PROD    | Product catalog, variants, pricing   |
| 15 | Inventory               | INV     | Stock levels, movements, adjustments |
| 16 | Warehouse               | WH      | Locations, zones, bin management     |
| 17 | Stock Transfer          | XFER    | Inter-warehouse transfers            |
| 18 | Purchase                | PUR     | RFQ, PO, GRN, supplier returns       |
| 19 | Supplier Management     | SUPP    | Supplier registration, rating        |
| 20 | Sales                   | SALE    | Quotes, orders, shipments, returns   |
| 21 | Customer Management     | CUST    | 360 customer view, segmentation      |
| 22 | CRM                     | CRM     | Leads, opportunities, pipeline       |
| 23 | Invoicing               | INV     | AR/AP invoices, credit notes         |
| 24 | Accounting              | ACCT    | Chart of accounts, GL, journals      |
| 25 | Finance                 | FIN     | Budgeting, cash flow, treasury       |
| 26 | Bank Management         | BANK    | Bank accounts, reconciliation        |
| 27 | Tax Engine              | TAX     | Tax codes, calculations, reports     |
| 28 | Project Management      | PROJ    | Projects, tasks, milestones, Gantt   |
| 29 | Task Management         | TASK    | Kanban, assignments, time tracking   |
| 30 | Calendar                | CAL     | Events, meetings, resource booking   |
| 31 | Messaging               | MSG     | Internal chat, threads, files        |
| 32 | Notifications           | NOTIF   | Email, SMS, push, in-app, webhook    |
| 33 | Document Management     | DOC     | Upload, versioning, workflows        |
| 34 | Reports & Analytics     | RPT     | Report builder, OLAP cubes           |
| 35 | Settings                | SETT    | System config, localization, themes  |
| 36 | Audit Log               | AUDIT   | Immutable audit trail                |
| 37 | API Gateway             | API     | Rate limiting, routing, docs         |
| 38 | Workflow Automation     | WFA     | Visual workflow designer, triggers   |
| 39 | Email Templates         | EMAIL   | Drag-drop template editor            |
| 40 | SMS Templates           | SMS     | SMS templates, provider abstraction  |
| 41 | Backup Management       | BACKUP  | Automated backup, restore, retention |
| 42 | System Monitoring       | MON     | Health checks, metrics, alerts       |
| 43 | Activity Logs           | ACTIV   | User activity timeline, analytics    |
| 44 | Integration Hub         | INTEG   | REST/SOAP connectors, webhook, ETL   |
| 45 | Localization Engine     | L10N    | Multi-language, date/number formats  |
| 46 | AI Assistant            | AI      | NLP query, anomaly detection         |

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- Docker Desktop 4+
- PostgreSQL 16 (or use Docker)

### Setup

**Step 1: Clone the repository**

```bash
git clone <repository-url>
cd erp-platform
```

**Step 2: Copy environment file**

```bash
cp .env.example .env
# Edit .env with your configuration
```

**Step 3: Install dependencies**

```bash
make install
```

**Step 4: Start development environment**

```bash
make dev
```

The API will be available at http://localhost:8000/docs and the frontend at http://localhost:3000.

### Docker Quick Start

```bash
# Start all services
make docker-up

# Run migrations
make migrate

# Seed database
make seed
```

### Testing

```bash
make test
```

### Linting

```bash
make lint
```

## Project Structure

```
erp-platform/
├── frontend/              # React SPA
├── backend/               # FastAPI application
│   ├── alembic/           # Database migrations
│   ├── app/               # Application code
│   │   ├── core/          # Cross-cutting: security, database, cache
│   │   ├── modules/       # Feature modules
│   │   └── middleware/     # CORS, auth, audit, rate limiting
│   ├── requirements/      # Dependency files
│   └── tests/             # Test suite
├── shared/                # Shared types, validation, utils
├── database/              # SQL scripts, seeds
├── infrastructure/        # Terraform, K8s, Docker, monitoring
├── docs/                  # Documentation
├── .github/workflows/     # CI/CD pipelines
├── docker-compose.yml     # Local development
└── Makefile               # Command shortcuts
```

## License

Internal use only.
