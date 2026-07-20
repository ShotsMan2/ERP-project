# Enterprise ERP System — Complete Architecture & Planning Document

> **Prepared by:** Enterprise Software Architecture Team  
> **Version:** 1.0  
> **Status:** Draft for Review  
> **Classification:** Internal — Confidential

---

# Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Functional Requirements](#2-functional-requirements)
3. [Non-functional Requirements](#3-non-functional-requirements)
4. [Complete Module List](#4-complete-module-list)
5. [Module Relationships](#5-module-relationships)
6. [User Roles](#6-user-roles)
7. [Database Plan](#7-database-plan)
8. [System Architecture](#8-system-architecture)
9. [API Design](#9-api-design)
10. [UI Design](#10-ui-design)
11. [Security Plan](#11-security-plan)
12. [Performance Plan](#12-performance-plan)
13. [Folder Structure](#13-folder-structure)
14. [Development Roadmap](#14-development-roadmap)
15. [Risks](#15-risks)
16. [Future Improvements](#16-future-improvements)
17. [AI Integration Opportunities](#17-ai-integration-opportunities)

---

# 1. Executive Summary

## 1.1 Purpose

This document defines the complete architecture, design, and implementation roadmap for an Enterprise Resource Planning (ERP) system. The system is designed to replace fragmented business software with a unified platform covering finance, HR, inventory, sales, procurement, project management, and analytics.

## 1.2 Business Problem

Mid-to-large enterprises operate 8–15 separate software systems (accounting, HR, inventory, CRM, etc.) that do not share data, creating reconciliation overhead, data entry duplication, reporting delays, and visibility gaps for leadership.

## 1.3 Solution

A modular, cloud-native ERP platform with:

| Capability | Approach |
|---|---|
| Core | Modular monolith with microservice extraction points |
| UI | React 18+ with TypeScript, micro-frontend ready |
| API | REST + GraphQL hybrid, OpenAPI 3.1 |
| DB | PostgreSQL 16 with partitioning, read replicas |
| Cache | Redis 7 (multi-tier) |
| Queue | RabbitMQ / Redis Streams |
| Search | Elasticsearch / Meilisearch |
| Storage | S3-compatible object storage |
| Auth | OAuth 2.0 + JWT + Refresh Tokens |
| Deployment | Kubernetes (EKS/AKS/GKE) |
| CI/CD | GitLab CI / GitHub Actions |

## 1.4 Business Value

- 40–60% reduction in cross-system reconciliation time
- Single source of truth for all business data
- Real-time financial and operational reporting
- Scalable from 50 to 50,000+ employees
- 99.95% uptime SLA
---

# 2. Functional Requirements

## 2.1 Core Business Requirements

| ID | Requirement | Priority | Module |
|---|---|---|---|
| FR-001 | Multi-company and multi-branch support with consolidated reporting | Critical | Core |
| FR-002 | Role-based access control with granular permission matrix | Critical | Auth |
| FR-003 | Full audit trail on every data mutation | Critical | Audit |
| FR-004 | Real-time dashboard with KPIs per role | High | Dashboard |
| FR-005 | Employee lifecycle management from hire to retire | Critical | HR |
| FR-006 | Attendance tracking with clock-in/out, geo-fencing | High | HR |
| FR-007 | Leave management with accrual policies and approval workflows | High | HR |
| FR-008 | Payroll processing with tax calculations, social contributions | Critical | Payroll |
| FR-009 | Recruitment pipeline with applicant tracking | Medium | Recruitment |
| FR-010 | Performance evaluation with OKR/KPI alignment | Medium | HR |
| FR-011 | Inventory management with multi-warehouse support | Critical | Inventory |
| FR-012 | Stock transfer between warehouses with approval | High | Inventory |
| FR-013 | Purchase order lifecycle (RFQ to PO to GRN to Invoice) | Critical | Procurement |
| FR-014 | Supplier management with performance scoring | High | Procurement |
| FR-015 | Sales order management (Quote to Order to Ship to Invoice) | Critical | Sales |
| FR-016 | Customer management with 360-degree view | Critical | CRM |
| FR-017 | Full financial accounting (GL, AP, AR, FA) | Critical | Accounting |
| FR-018 | Multi-currency and multi-language support | High | Core |
| FR-019 | Tax engine supporting VAT, GST, Sales Tax, Withholding Tax | Critical | Accounting |
| FR-020 | Cash flow forecasting and bank reconciliation | High | Finance |
| FR-021 | Project management with tasks, Gantt, resource allocation | High | Projects |
| FR-022 | Document management with version control | Medium | Documents |
| FR-023 | Email and SMS notification system with templates | High | Notifications |
| FR-024 | Report builder with drag-and-drop and scheduled exports | High | Reports |
| FR-025 | REST API for third-party integrations | Critical | API |
| FR-026 | Mobile-responsive UI with PWA support | High | Core |
| FR-027 | Workflow automation engine with visual designer | Medium | Automation |
| FR-028 | Backup and disaster recovery automation | Critical | Infra |

## 2.2 Compliance Requirements

| ID | Requirement | Regulation |
|---|---|---|
| CR-001 | Data retention policies with automated purging | GDPR, SOX |
| CR-002 | Consent management for personal data | GDPR, CCPA |
| CR-003 | Electronic signature support for approvals | ESIGN, eIDAS |
| CR-004 | Fiscal year and tax period management | Local GAAP |
| CR-005 | Data residency support | EU, US, TR |
---

# 3. Non-functional Requirements

## 3.1 Performance

| Metric | Target |
|---|---|
| API response time (p95) | <200ms |
| API response time (p99) | <500ms |
| Dashboard load time | <2s |
| Report generation (10k rows) | <5s |
| Concurrent users | 5,000 |
| Concurrent API requests | 50,000/min |
| Database query time (p95) | <50ms |
| Search query time (p95) | <300ms |

## 3.2 Availability

| Metric | Target |
|---|---|
| Uptime SLA | 99.95% |
| Planned downtime | <4h/month |
| RPO (Recovery Point Objective) | 5 minutes |
| RTO (Recovery Time Objective) | 15 minutes |
| Backup frequency | Continuous WAL archiving + daily full |

## 3.3 Scalability

- **Horizontal scaling**: All stateless services scale horizontally
- **Database**: Read replicas (1-5), read-write splitting, partitioning
- **Storage**: S3-compatible, infinite scalability
- **Queue**: Consumer groups for parallel processing
- **Cache**: Redis Cluster with sharding

## 3.4 Security

- OWASP Top 10 compliance
- SOC 2 Type II alignment
- GDPR and KVKK compliance
- Encrypted at rest (AES-256) and in transit (TLS 1.3)
- Secrets rotation: every 90 days
- Password policy: NIST SP 800-63B
- Session timeout: 15 minutes idle
- Maximum login attempts: 5 before lockout

## 3.5 Maintainability

- Modular monolith architecture with clear bounded contexts
- Test coverage: >85% (unit), >70% (integration)
- API versioning via URL path (v1, v2)
- Structured logging with correlation IDs
- OpenTelemetry instrumentation
- Feature flags for gradual rollouts
---

# 4. Complete Module List

## 4.1 Module Catalog

| # | Module | Code | Description | Criticality |
|---|---|---|---|---|
| 1 | Authentication | AUTH | Login, MFA, SSO, session management | Critical |
| 2 | User Management | USER | User CRUD, profiles, preferences | Critical |
| 3 | Role & Permission | ROLE | RBAC engine, permission matrix | Critical |
| 4 | Company Management | CORE | Multi-tenant company/branch setup | Critical |
| 5 | Dashboard | DASH | Role-specific KPIs, charts, widgets | High |
| 6 | Employee Management | EMP | Employee lifecycle, documents, org chart | Critical |
| 7 | Department Management | DEPT | Department hierarchy, cost centers | High |
| 8 | Attendance | ATTN | Clock in/out, geo-tracking, calendar | High |
| 9 | Leave Management | LEAVE | Leave policies, accruals, approvals | High |
| 10 | Payroll | PAYR | Salary computation, deductions, tax | Critical |
| 11 | Recruitment | RECR | Job posts, applicants, interviews | Medium |
| 12 | Performance Evaluation | PERF | Reviews, OKRs, 360 feedback | Medium |
| 13 | Asset Management | ASSET | Fixed assets, depreciation, tracking | Medium |
| 14 | Product Management | PROD | Product catalog, variants, pricing | Critical |
| 15 | Inventory | INV | Stock levels, movements, adjustments | Critical |
| 16 | Warehouse | WH | Locations, zones, bin management | High |
| 17 | Stock Transfer | XFER | Inter-warehouse transfers, approvals | High |
| 18 | Purchase | PUR | RFQ, PO, GRN, supplier returns | Critical |
| 19 | Supplier Management | SUPP | Supplier registration, rating, contracts | High |
| 20 | Sales | SALE | Quotes, orders, shipments, returns | Critical |
| 21 | Customer Management | CUST | 360 customer view, segmentation | Critical |
| 22 | CRM | CRM | Leads, opportunities, pipeline, activities | High |
| 23 | Invoicing | INV | AR/AP invoices, credit notes, e-invoice | Critical |
| 24 | Accounting | ACCT | Chart of accounts, GL, journals | Critical |
| 25 | Finance | FIN | Budgeting, cash flow, treasury | Critical |
| 26 | Bank Management | BANK | Bank accounts, reconciliation, statements | High |
| 27 | Tax Engine | TAX | Tax codes, calculations, filing reports | Critical |
| 28 | Project Management | PROJ | Projects, tasks, milestones, Gantt | High |
| 29 | Task Management | TASK | Kanban, assignments, time tracking | High |
| 30 | Calendar | CAL | Events, meetings, resource booking | Medium |
| 31 | Messaging | MSG | Internal chat, threads, file sharing | Medium |
| 32 | Notifications | NOTIF | Email, SMS, push, in-app, webhook | High |
| 33 | Document Management | DOC | Upload, versioning, approval workflows | Medium |
| 34 | Reports & Analytics | RPT | Report builder, OLAP cubes, dashboards | High |
| 35 | Settings | SETT | System configuration, localization, themes | Medium |
| 36 | Audit Log | AUDIT | Immutable audit trail, compliance reports | Critical |
| 37 | API Gateway | API | Rate limiting, routing, documentation | Critical |
| 38 | Workflow Automation | WFA | Visual workflow designer, triggers | Medium |
| 39 | Email Templates | EMAIL | Drag-drop template editor, variables | Medium |
| 40 | SMS Templates | SMS | SMS templates, provider abstraction | Low |
| 41 | Backup Management | BACKUP | Automated backup, restore, retention | Critical |
| 42 | System Monitoring | MON | Health checks, metrics, alerts | Critical |
| 43 | Activity Logs | ACTIV | User activity timeline, analytics | High |
| 44 | Integration Hub | INTEG | REST/SOAP connectors, webhook, ETL | High |
| 45 | Localization Engine | L10N | Multi-language, date/number formats | Medium |
| 46 | AI Assistant | AI | NLP query, anomaly detection, predictions | Low |


# 5. Module Relationships

## 5.1 Dependency Graph

`
CORE
  +-- AUTH, USER, ROLE (depends on CORE for company context)
  +-- EMP, DEPT (depends on CORE + USER)
  +-- PROD (standalone, depends on CORE)
  +-- INV, WH (depends on PROD + CORE)
  +-- PUR (depends on PROD + SUPP + CORE)
  +-- SALE (depends on PROD + CUST + CORE)
  +-- ACCT (depends on CORE, referenced by all financial modules)
  +-- PAYR (depends on EMP + ATTN + LEAVE + ACCT)
  +-- All modules AUDIT (immutable, depends on nothing)
`

## 5.2 Information Flow

`
                    +-----------------------------+
                    |      CORE / TENANCY          |
                    |  Company, Branch, Settings   |
                    +------+----------------------+
                           | context
          +----------------+-------------------+
          v                v                    v
   +----------+    +------------+    +--------------+
   |  AUTH    |--->|  USER/ROLE |    |  L10N/SETT   |
   +----------+    +-----+------+    +--------------+
                         | identity
          +--------------+--------------+
          v              v              v
   +----------+   +----------+   +----------+
   |   HR     |   |  SALES   |   | INVENTORY|
   | (EMP,    |   | (CUST,   |   | (PROD,   |
   |  ATTN,   |   |  CRM,    |   |  WH,     |
   |  LEAVE,  |   |  SALE)   |   |  XFER)   |
   |  PERF)   |   +----+-----+   +----+-----+
   +----+-----+        |              |
        |              |              |
        v              v              v
   +--------------------------------------+
   |           ACCOUNTING / FINANCE       |
   |  (ACCT, INV, TAX, BANK, CASH)       |
   +--------------------------------------+
        |
        v
   +----------+    +----------+    +----------+
   |  REPORTS |    |   AUDIT  |    |  ANALYTICS|
   +----------+    +----------+    +----------+
`

## 5.3 Business Workflows

### 5.3.1 Procure-to-Pay

Requisition to Approval to RFQ to PO to Goods Receipt to Invoice to Payment

### 5.3.2 Order-to-Cash

Lead to Quote to Order to Shipment to Invoice to Payment to Reconciliation

### 5.3.3 Hire-to-Retire

Recruitment to Onboarding to Time Tracking to Payroll to Performance to Offboarding

### 5.3.4 Financial Close

Sub-ledger Close to GL Journal to Revaluation to Consolidation to Report to Archive

## 5.4 Cross-Module Interaction Points

| Source Module | Target Module | Interaction | Event |
|---|---|---|---|
| Sales Order | Inventory | Reserve stock on order approval | stock.reserved |
| Sales Order | Accounting | Create AR invoice on shipment | invoice.created |
| Purchase Order | Inventory | Increase stock on GRN | stock.received |
| Purchase Order | Accounting | Create AP invoice on receipt | invoice.created |
| Payroll | Accounting | Post payroll journal entries | journal.posted |
| Attendance | Payroll | Compute overtime and deductions | payroll.calculated |
| Projects | Accounting | Track project costs and billings | cost.allocated |
| CRM | Sales | Convert lead to opportunity to order | lead.converted |


# 6. User Roles

## 6.1 Role Definitions

### 6.1.1 Super Admin

| Aspect | Detail |
|---|---|
| Purpose | System-wide administration, tenant management |
| Scope | ALL companies, branches, modules |
| Permissions | Full CRUD on every resource, no restrictions |
| Dashboard | System health, usage stats, audit overview, license compliance |
| Pages | All pages + System panel (backup, monitoring, queues, logs) |
| Restrictions | Cannot view employee salary details unless explicitly granted |

### 6.1.2 Company Owner

| Aspect | Detail |
|---|---|
| Purpose | Owns a single company/tenant |
| Scope | All data within their company, all branches, all modules |
| Permissions | Full CRUD within company; cannot access system configuration |
| Dashboard | Company financial health, department performance, pending approvals |
| Pages | All pages within company scope |
| Restrictions | Cannot modify system settings, cannot access other companies |

### 6.1.3 HR Manager

| Aspect | Detail |
|---|---|
| Scope | HR module, Employee data, Payroll (read-only), Recruitment |
| Permissions | CRUD on employees, attendance, leaves, performance; read payroll |
| Dashboard | Headcount, turnover, attendance summary, pending leave approvals |
| Pages | HR Dashboard, Employees, Departments, Attendance, Leaves, Performance, Recruitment |
| Restrictions | Cannot modify salaries/payroll; cannot access financial/accounting data |

### 6.1.4 Accountant

| Aspect | Detail |
|---|---|
| Scope | Accounting, Finance, Invoicing, Tax, Bank |
| Permissions | CRUD on journals, invoices, bank transactions; read-only on projects |
| Dashboard | Pending reconciliations, AR/AP aging, cash position, tax calendar |
| Pages | Accounting Dashboard, Chart of Accounts, Journals, Invoices, Tax Reports, Bank Reconciliation |
| Restrictions | Cannot modify employee data; cannot approve purchase orders |

### 6.1.5 Sales Manager

| Aspect | Detail |
|---|---|
| Scope | CRM, Sales Orders, Customers, Invoices (read) |
| Permissions | CRUD on leads, opportunities, quotes, orders; read inventory |
| Dashboard | Pipeline value, conversion rate, revenue forecast, team targets |
| Pages | Sales Dashboard, CRM Pipeline, Customers, Sales Orders, Quotes, Invoices (read) |
| Restrictions | Cannot modify inventory; cannot approve high-value discounts (>threshold) |

### 6.1.6 Warehouse Manager

| Aspect | Detail |
|---|---|
| Scope | Inventory, Warehouse, Stock Transfers, Purchase Receipts |
| Permissions | CRUD on stock, warehouses, bins; read purchase orders; execute transfers |
| Dashboard | Stock levels, low stock alerts, pending transfers, receiving schedule |
| Pages | Inventory Dashboard, Products, Warehouses, Stock Transfers, GRN |
| Restrictions | Cannot create purchase orders; cannot modify product prices |

### 6.1.7 Purchasing Manager

| Aspect | Detail |
|---|---|
| Scope | Procurement, Supplier Management, Purchase Orders |
| Permissions | CRUD on RFQs, POs, suppliers; read inventory levels |
| Dashboard | PO aging, supplier performance, budget consumption, pending approvals |
| Pages | Procurement Dashboard, Purchase Orders, Suppliers, RFQs, Contracts |
| Restrictions | Cannot approve POs above their delegated budget limit |

### 6.1.8 Project Manager

| Aspect | Detail |
|---|---|
| Scope | Projects, Tasks, Calendar, Time Tracking |
| Permissions | CRUD on projects, tasks; read employee data; manage task assignments |
| Dashboard | Project timelines, task completion, resource allocation, budget vs actual |
| Pages | PM Dashboard, Projects, Tasks, Gantt Chart, Calendar, Time Reports |
| Restrictions | Cannot modify salaries; cannot create purchase orders |

### 6.1.9 Employee

| Aspect | Detail |
|---|---|
| Scope | Self-service: own profile, attendance, leaves, payslips, tasks |
| Permissions | Read own data; create leave requests; mark attendance; update profile |
| Dashboard | My tasks, upcoming leaves, attendance summary, notifications |
| Pages | My Profile, My Attendance, My Leaves, My Payslips, My Tasks |
| Restrictions | Cannot view other employees data; cannot access financial modules |

### 6.1.10 Customer

| Aspect | Detail |
|---|---|
| Scope | Self-service portal: quotes, orders, invoices, support tickets |
| Permissions | Read own quotes/orders/invoices; create support tickets |
| Dashboard | My orders, open invoices, recent tickets |
| Pages | Customer Portal: Orders, Invoices, Tickets, Profile |
| Restrictions | Cannot view other customers data; no access to internal modules |

### 6.1.11 Supplier

| Aspect | Detail |
|---|---|
| Scope | Supplier portal: RFQs, POs, invoices, delivery schedules |
| Permissions | Read POs assigned to them; create invoices; update delivery status |
| Dashboard | New RFQs, pending deliveries, paid/unpaid invoices |
| Pages | Supplier Portal: RFQs, Purchase Orders, Invoices, Deliveries |
| Restrictions | Cannot view other suppliers data; no access to internal modules |

### 6.1.12 Auditor

| Aspect | Detail |
|---|---|
| Scope | Read-only access to all modules for compliance auditing |
| Permissions | Read all data; no create/update/delete on any resource |
| Dashboard | Audit trail, recent changes, compliance scorecard |
| Pages | All pages in read-only mode; special Audit Console |
| Restrictions | No write access to any system; explicit flag prevents any mutation |

### 6.1.13 Guest

| Aspect | Detail |
|---|---|
| Scope | Public pages only |
| Permissions | None; no authenticated access |
| Pages | Login, Password Reset, Public Knowledge Base |
| Restrictions | No data access; cannot view any business data |


## 6.2 Permission Matrix (Simplified)

| Module | Super Admin | Company Owner | HR Mgr | Acct | Sales Mgr | WH Mgr | Pur Mgr | Proj Mgr | Employee | Auditor |
|---|---|---|---|---|---|---|---|---|---|---|
| Users | CRUD | CRUD | R | R | R | R | R | R | R | R |
| Employees | CRUD | CRUD | CRUD | R | R | R | R | R | own R | R |
| Products | CRUD | CRUD | - | - | R | CRUD | R | - | - | R |
| Inventory | CRUD | CRUD | - | - | R | CRUD | R | - | - | R |
| Sales Orders | CRUD | CRUD | - | - | CRUD | - | - | - | - | R |
| POs | CRUD | CRUD | - | - | - | - | CRUD | - | - | R |
| Invoices | CRUD | CRUD | - | CRUD | R | - | - | - | - | R |
| Accounting | CRUD | CRUD | - | CRUD | - | - | - | - | - | R |
| Projects | CRUD | CRUD | - | - | - | - | - | CRUD | assignee | R |
| Reports | CRUD | CRUD | module | module | module | module | module | module | own | R |
| Settings | CRUD | company | - | - | - | - | - | - | - | - |
| Audit | CRUD | R | R | R | R | R | R | R | R | CRUD |

---

# 7. Database Plan

## 7.1 Database Philosophy

- **Database**: PostgreSQL 16 (primary) + Redis 7 (cache/queue) + Elasticsearch (search)
- **Schema**: Multi-tenant via company_id column (shared table, row-level security)
- **Naming**: snake_case, singular table names, plural join tables
- **Migration**: Liquibase or Flyway (version-controlled, repeatable)
- **IDs**: UUID v7 (time-sortable) for all primary keys
- **Soft delete**: deleted_at TIMESTAMPTZ on all business tables
- **Audit fields**: created_at, updated_at, created_by, updated_by on all tables
- **Optimization**: Composite indexes on (company_id, status), (company_id, deleted_at)

## 7.2 Entity Catalog

### 7.2.1 Core and Tenancy

| Entity | Purpose | Key Relationships | Key Fields | Indexes |
|---|---|---|---|---|
| companies | Multi-tenant companies | 1 to * branches, 1 to * users | id, name, tax_id, legal_name, address, country, language, timezone, fiscal_year_start, is_active | uk_tax_id, idx_country |
| branches | Company branches | * to 1 company, 1 to * departments | id, company_id, name, code, address, phone, email, is_active | idx_company_branch |
| departments | Department hierarchy | * to 1 branch, 1 to * employees | id, branch_id, parent_id, name, code, cost_center, manager_id, is_active | idx_branch_dept, idx_parent |
| users | System users | * to 1 company, 1 to 1 employee | id, company_id, email, password_hash, is_active, mfa_enabled, last_login | uk_email_company, idx_company_user |
| roles | Role definitions | * to * permissions | id, company_id, name, code, description, is_system, is_active | idx_company_role |
| permissions | Granular permissions | * to * roles | id, name, code, module, action, description | uk_permission_code |
| role_permissions | Role-permission mapping | * to 1 role, * to 1 permission | role_id, permission_id | pk(role_id, permission_id) |
| user_roles | User-role assignment | * to 1 user, * to 1 role | user_id, role_id, company_id, assigned_at | pk(user_id, role_id) |

### 7.2.2 HR

| Entity | Purpose | Key Relationships | Key Fields | Indexes |
|---|---|---|---|---|
| employees | Employee master | * to 1 company, * to 1 department, * to 1 user | id, company_id, user_id, department_id, employee_code, first_name, last_name, email, phone, hire_date, termination_date, status, job_title, grade, reports_to | uk_emp_code, idx_dept, idx_reports_to |
| employee_documents | Employee files | * to 1 employee | id, employee_id, document_type, file_path, expiry_date, verified_at | idx_employee |
| attendance_records | Daily clock data | * to 1 employee | id, employee_id, date, clock_in, clock_out, total_hours, break_minutes, geo_lat, geo_lng, method | idx_employee_date, idx_date |
| leaves | Leave requests | * to 1 employee, * to 1 approver | id, employee_id, leave_type, start_date, end_date, total_days, status, approved_by, reason, attachment | idx_employee_status, idx_dates |
| leave_policies | Leave accrual rules | * to 1 company | id, company_id, name, type, days_per_year, carry_forward_limit, requires_approval, applicable_grades | idx_company |
| payroll_runs | Payroll execution | * to 1 company, * to * employees | id, company_id, period_start, period_end, run_date, status, total_amount, approved_by | idx_company_period |
| payroll_items | Payslip lines | * to 1 payroll_run, * to 1 employee | id, payroll_run_id, employee_id, earnings_json, deductions_json, total_gross, total_net, bank_account, paid_at | idx_payroll, idx_employee |
| performance_reviews | Evaluation records | * to 1 employee, * to 1 reviewer | id, employee_id, reviewer_id, period, rating, goals_json, feedback, status, completed_at | idx_employee_reviewer |
| recruitment_candidates | Applicant tracking | * to 1 job_post | id, job_post_id, name, email, phone, resume_path, status, stage, rating, applied_at | idx_job_post, idx_status |

### 7.2.3 Product and Inventory

| Entity | Purpose | Key Relationships | Key Fields | Indexes |
|---|---|---|---|---|
| products | Product catalog | 1 to * variants, * to * categories | id, company_id, name, sku, barcode, product_type, unit, tax_rate_id, sale_price, cost_price, image_url, is_active | uk_sku_company, uk_barcode |
| product_variants | Product options | * to 1 product | id, product_id, name, sku, attributes_json, price_adjustment, is_active | uk_variant_sku |
| categories | Product categories | 1 to * products, self-referential | id, company_id, parent_id, name, slug, description, is_active | idx_company_category |
| warehouses | Physical storage | * to 1 branch, 1 to * locations | id, branch_id, name, code, address, type, is_active | idx_branch_warehouse |
| locations | Warehouse zones | * to 1 warehouse, 1 to * bins | id, warehouse_id, name, code, type | idx_warehouse |
| bins | Storage positions | * to 1 location | id, location_id, name, code, max_capacity, is_active | idx_location |
| stock_levels | Current stock | * to 1 product, * to 1 bin | id, product_id, bin_id, quantity, reserved_quantity, available_quantity, last_counted_at | uk_product_bin, idx_product |
| stock_movements | Inventory transactions | * to 1 product, * to 1 source_bin, * to 1 dest_bin | id, product_id, from_bin_id, to_bin_id, quantity, type, reference_type, reference_id, reason, created_by | idx_product, idx_reference, idx_created |

### 7.2.4 Procurement

| Entity | Purpose | Key Relationships | Key Fields | Indexes |
|---|---|---|---|---|
| suppliers | Vendor master | * to 1 company, 1 to * contacts | id, company_id, name, code, tax_id, email, phone, payment_terms, currency, rating, is_active | uk_supplier_code, idx_company |
| purchase_orders | PO documents | * to 1 supplier, * to 1 company, 1 to * po_lines | id, company_id, supplier_id, order_number, status, order_date, expected_date, total_amount, currency, approved_by, notes | uk_order_number, idx_supplier, idx_status |
| po_lines | PO line items | * to 1 purchase_order, * to 1 product | id, purchase_order_id, product_id, description, quantity, unit_price, tax_rate, received_quantity, total | idx_po, idx_product |
| goods_receipts | GRN documents | * to 1 purchase_order, 1 to * grn_lines | id, purchase_order_id, receipt_number, received_date, status, created_by | uk_receipt_number, idx_po |
| grn_lines | GRN line items | * to 1 goods_receipt, * to 1 po_line | id, goods_receipt_id, po_line_id, product_id, quantity_received, bin_id | idx_grn, idx_po_line |


### 7.2.5 Sales and CRM

| Entity | Purpose | Key Relationships | Key Fields | Indexes |
|---|---|---|---|---|
| customers | Customer master | * to 1 company, 1 to * contacts | id, company_id, name, code, tax_id, email, phone, payment_terms, currency, credit_limit, segment, is_active | uk_customer_code, idx_company |
| leads | Sales leads | * to 1 company, * to 1 assigned_to | id, company_id, source, status, score, contact_name, contact_email, company_name, budget, timeline, assigned_to | idx_assigned, idx_status |
| opportunities | Sales pipeline | * to 1 lead, * to 1 assigned_to | id, lead_id, name, stage, probability, expected_revenue, close_date, assigned_to | idx_lead, idx_stage |
| sales_orders | Customer orders | * to 1 customer, 1 to * so_lines | id, company_id, customer_id, order_number, status, order_date, delivery_date, total_amount, discount, tax_amount, approved_by | uk_order_number, idx_customer, idx_status |
| so_lines | Order line items | * to 1 sales_order, * to 1 product | id, sales_order_id, product_id, description, quantity, unit_price, discount_percent, tax_rate, total, delivered_quantity | idx_so, idx_product |
| shipments | Delivery documents | * to 1 sales_order, 1 to * shipment_lines | id, sales_order_id, shipment_number, shipped_date, carrier, tracking_number, status | uk_shipment_number, idx_so |

### 7.2.6 Accounting and Finance

| Entity | Purpose | Key Relationships | Key Fields | Indexes |
|---|---|---|---|---|
| chart_of_accounts | GL account list | * to 1 company, 1 to * journal_entries | id, company_id, code, name, type, is_active, parent_id, tax_code | uk_account_code, idx_company_type |
| fiscal_years | Accounting periods | * to 1 company | id, company_id, name, start_date, end_date, is_closed, closed_at | idx_company_year |
| journals | Journal batches | * to 1 company, 1 to * journal_entries | id, company_id, journal_type, reference, description, total_debit, total_credit, status, posted_at, created_by | idx_company_status |
| journal_entries | Individual entries | * to 1 journal, * to 1 account | id, journal_id, account_id, debit_amount, credit_amount, description, cost_center_id, project_id | idx_journal, idx_account, idx_project |
| invoices | AR/AP invoices | * to 1 company, * to 1 customer/supplier | id, company_id, invoice_number, type, direction, status, issue_date, due_date, total_amount, tax_amount, paid_amount, currency | uk_invoice_number, idx_company_type, idx_due_date |
| invoice_lines | Invoice details | * to 1 invoice, * to 1 product | id, invoice_id, product_id, description, quantity, unit_price, tax_rate, total | idx_invoice |
| payments | Payment transactions | * to 1 invoice, * to 1 bank_account | id, invoice_id, bank_account_id, amount, payment_date, reference, status, reconciled_at | idx_invoice, idx_date |
| bank_accounts | Company bank accounts | * to 1 company | id, company_id, name, account_number, iban, swift, currency, is_active, balance | idx_company_currency |
| bank_transactions | Bank statement lines | * to 1 bank_account, * to 1 payment | id, bank_account_id, payment_id, transaction_date, description, debit, credit, balance, status, reconciled | idx_account_date, idx_reconciled |
| tax_rates | Tax configuration | * to 1 company | id, company_id, name, code, rate_percent, type, is_active, effective_from, effective_to | idx_company_active |
| budgets | Budget planning | * to 1 company, * to 1 account, * to 1 department | id, company_id, account_id, department_id, fiscal_year_id, budgeted_amount, actual_amount, notes | idx_company_fiscal |

### 7.2.7 Projects

| Entity | Purpose | Key Relationships | Key Fields | Indexes |
|---|---|---|---|---|
| projects | Project definitions | * to 1 company, 1 to * tasks | id, company_id, name, code, description, start_date, end_date, status, budget, project_manager_id, priority | idx_company_status, idx_manager |
| project_members | Project team | * to 1 project, * to 1 employee | id, project_id, employee_id, role, allocation_percent | pk(project_id, employee_id) |
| tasks | Task items | * to 1 project, * to 1 assignee, * to 1 parent | id, project_id, parent_id, title, description, status, priority, assignee_id, due_date, estimated_hours, actual_hours | idx_project, idx_assignee, idx_status |
| time_entries | Time logs | * to 1 task, * to 1 employee | id, task_id, employee_id, date, hours, description, billable, approved_by | idx_task, idx_employee_date |

### 7.2.8 System

| Entity | Purpose | Key Relationships | Key Fields | Indexes |
|---|---|---|---|---|
| audit_logs | Immutable audit trail | polymorphic reference | id, company_id, user_id, event_type, resource_type, resource_id, changes_json, ip_address, user_agent, created_at | idx_resource, idx_user, idx_created, idx_event |
| notifications | Notification records | * to 1 user | id, company_id, user_id, type, channel, title, body, data_json, read_at, created_at | idx_user_read, idx_created |
| notification_templates | Message templates | * to 1 company | id, company_id, code, channel, subject, body, variables_json, is_active | uk_code_company |
| documents | File metadata | polymorphic reference | id, company_id, documentable_type, documentable_id, file_name, file_path, mime_type, size_bytes, version, uploaded_by | idx_documentable |
| workflows | Automation rules | * to 1 company | id, company_id, name, trigger_type, trigger_config_json, conditions_json, actions_json, is_active, version | idx_company_active |
| sessions | User sessions | * to 1 user | id, user_id, token_hash, refresh_token_hash, ip_address, user_agent, expires_at, created_at | idx_user, idx_token |
| failed_jobs | Dead letter queue | - | id, job_type, payload_json, error_message, failed_at, retry_count | idx_failed_at |
| system_config | Global configuration | - | id, key, value_json, description, updated_by | uk_key |


# 8. System Architecture

## 8.1 High-Level Architecture

The system follows a layered architecture with clear separation of concerns:

**Client Layer**: React SPA, PWA mobile app, third-party integrations
**Gateway Layer**: API Gateway (Kong/Envoy) handling rate limiting, auth, routing, WAF
**Application Layer**: FastAPI modular monolith with service modules, WebSocket server
**Queue Layer**: RabbitMQ for async jobs, Celery workers
**Cache Layer**: Redis Cluster for session storage, caching, rate limiting
**Data Layer**: PostgreSQL (primary + read replicas), Elasticsearch (search), S3 (files)

## 8.2 Technology Stack

### 8.2.1 Frontend

| Layer | Technology | Reasoning |
|---|---|---|
| Framework | React 18+ with TypeScript | Mature ecosystem, largest community, excellent tooling |
| Build Tool | Vite | Fast HMR, native ESM support |
| State Management | Zustand + TanStack Query | Zustand for client state; TanStack for server cache |
| Routing | React Router v6 | Standard, lazy loading, nested layouts |
| UI Library | Ant Design 5 | Comprehensive enterprise component library with i18n |
| Styling | Tailwind CSS v3 + CSS Modules | Utility-first for speed, Modules for isolation |
| Charts | Apache ECharts | Enterprise-grade, millions of data points |
| Forms | React Hook Form + Zod | Performant forms with schema validation |
| API Client | Axios + tRPC | Typed API calls, interceptors |
| i18n | i18next | Pluralization, interpolation, lazy loading |
| Testing | Vitest + Playwright | Unit tests + E2E testing |
| PWA | Workbox | Offline support, push notifications |

### 8.2.2 Backend

| Layer | Technology | Reasoning |
|---|---|---|
| Framework | FastAPI (Python 3.12) | Async-native, automatic OpenAPI, Pydantic validation |
| ORM | SQLAlchemy 2.0 + Alembic | Mature, async support, migration framework |
| Serialization | Pydantic v2 | Fast validation, JSON Schema generation |
| Auth | python-jose + passlib + OAuthLib | JWT, OAuth2, bcrypt hashing |
| Task Queue | Celery + RabbitMQ | Distributed task queue, periodic tasks, retries |
| Search | Elasticsearch DSL | Full-text search, aggregations |
| Testing | Pytest + pytest-asyncio | Async test support, fixtures, coverage |
| Linting | Ruff + mypy | Speed, strict typing |
| API Docs | Swagger UI + ReDoc | Auto-generated from FastAPI |

### 8.2.3 Infrastructure

| Layer | Technology | Reasoning |
|---|---|---|
| Container | Docker + Docker Compose (dev) | Standard, reproducible |
| Orchestration | Kubernetes (EKS/AKS/GKE) | Auto-scaling, self-healing |
| Service Mesh | Istio | Traffic management, mTLS, observability |
| CI/CD | GitLab CI / GitHub Actions | Pipeline-as-code, parallel jobs |
| Monitoring | Prometheus + Grafana | Metrics, dashboards, alerting |
| Logging | Loki + Grafana | Centralized log aggregation |
| Tracing | OpenTelemetry + Jaeger | Distributed tracing |
| Secrets | HashiCorp Vault | Dynamic secrets, rotation, audit |
| CDN | CloudFront / Cloudflare | Global content delivery, DDoS protection |
| DB Backup | pgBackRest | WAL archiving, point-in-time recovery |
| IaC | Terraform | Version-controlled infrastructure |

## 8.3 Authentication Flow

The authentication flow uses JWT access tokens (15min TTL) with rotating refresh tokens (7 day TTL):

1. Client sends credentials to /auth/login
2. Auth service validates credentials against database
3. On success, generates access token (signed RS256) and refresh token
4. Access token cached in Redis for quick validation
5. Client stores tokens (access in memory, refresh in httpOnly cookie)
6. On 401, client uses refresh token to get new access token
7. Old refresh token invalidated on each rotation
8. MFA enforced for all admin roles (TOTP-based)

## 8.4 Background Job Architecture

Jobs are processed asynchronously via Celery with RabbitMQ:

- Email/SMS notifications
- Report generation
- Data import/export
- Payroll batch processing
- Backup execution
- Cache warming after writes
- Elasticsearch index synchronization
- Webhook delivery to third parties

Each job has automatic retry (3 attempts), dead letter queue for failures, and monitoring via Flower.

## 8.5 Caching Strategy

| Layer | Cache Type | TTL | Eviction |
|---|---|---|---|
| L1 Browser | HTTP Cache (static assets) | 1 year | LRU |
| L2 Redis | Application data (permissions, products) | 15 min | LRU |
| L3 Redis | Query cache (frequent reads) | 5 min | TTL |
| L4 DB | Materialized views (reports) | 30 min | Refresh |
| CDN | Edge cache (public content) | 1 day | TTL |

Cache invalidation: On write, related keys are invalidated in Redis. Materialized views refreshed on schedule.

## 8.6 Deployment Strategy

Environments: local, dev, staging, production

- Kubernetes cluster with namespace isolation
- HPA for auto-scaling API and worker pods
- Blue-green deployment for zero-downtime releases
- Canary releases for high-risk changes
- Rolling updates with health check gates
- PodDisruptionBudget for availability during maintenance

K8s architecture: API pods (HPA 2-10), Worker pods (HPA 1-5), Frontend pods (HPA 2-5), PostgreSQL StatefulSet with replicas, Redis StatefulSet cluster, MinIO for S3-compatible storage.
# 9. API Design

## 9.1 API Philosophy

- **REST-first** with GraphQL for complex queries/reports
- **Versioned**: /api/v1/, /api/v2/
- **Standardized responses**: { success, data, error, meta, request_id }
- **Pagination**: cursor-based for lists, page-based for search
- **OpenAPI 3.1** spec auto-generated from FastAPI
- **Idempotency keys** for mutating endpoints (prevent duplicate processing)
- **Rate limiting**: per endpoint group, per user, per company

## 9.2 API Groups

### 9.2.1 Authentication

| Method | Endpoint | Purpose | Auth | Rate Limit |
|---|---|---|---|---|
| POST | /auth/login | Email + password login | None | 10/min |
| POST | /auth/login/mfa | MFA verification | Partial | 5/min |
| POST | /auth/refresh | Refresh access token | Refresh Token | 20/min |
| POST | /auth/logout | Invalidate session | JWT | 30/min |
| POST | /auth/forgot-password | Send reset email | None | 3/min |
| POST | /auth/reset-password | Reset password | Reset Token | 3/min |
| GET | /auth/me | Current user profile | JWT | 60/min |
| PUT | /auth/me | Update profile | JWT | 10/min |

### 9.2.2 Users

| Method | Endpoint | Purpose | Permissions |
|---|---|---|---|
| GET | /users | List users | users.read |
| GET | /users/{id} | Get user details | users.read |
| POST | /users | Create user | users.create |
| PUT | /users/{id} | Update user | users.update |
| DELETE | /users/{id} | Soft-delete user | users.delete |
| GET | /users/{id}/roles | User role assignments | users.read |
| PUT | /users/{id}/roles | Assign roles | users.update |

### 9.2.3 Roles and Permissions

| Method | Endpoint | Purpose | Permissions |
|---|---|---|---|
| GET | /roles | List roles | roles.read |
| POST | /roles | Create role | roles.create |
| PUT | /roles/{id} | Update role | roles.update |
| DELETE | /roles/{id} | Delete role | roles.delete |
| GET | /roles/{id}/permissions | Permission matrix | roles.read |
| PUT | /roles/{id}/permissions | Set permissions | roles.update |
| GET | /permissions | List all permissions | roles.read |

### 9.2.4 Employees

| Method | Endpoint | Purpose | Permissions |
|---|---|---|---|
| GET | /employees | List employees | employees.read |
| GET | /employees/{id} | Employee detail | employees.read |
| POST | /employees | Create employee | employees.create |
| PUT | /employees/{id} | Update employee | employees.update |
| DELETE | /employees/{id} | Terminate employee | employees.delete |
| GET | /employees/org-chart | Organization chart | employees.read |

### 9.2.5 Products

| Method | Endpoint | Purpose | Permissions |
|---|---|---|---|
| GET | /products | List products | products.read |
| GET | /products/{id} | Product detail | products.read |
| POST | /products | Create product | products.create |
| PUT | /products/{id} | Update product | products.update |
| DELETE | /products/{id} | Soft-delete product | products.delete |
| GET | /products/search | Full-text search | products.read |
| POST | /products/import | Bulk CSV import | products.create |

### 9.2.6 Inventory

| Method | Endpoint | Purpose | Permissions |
|---|---|---|---|
| GET | /inventory/stock-levels | Current stock levels | inventory.read |
| GET | /inventory/stock-levels/{product_id} | Stock by product | inventory.read |
| POST | /inventory/adjustments | Stock adjustment | inventory.update |
| POST | /inventory/transfers | Inter-warehouse transfer | inventory.create |
| GET | /inventory/movements | Stock movement history | inventory.read |
| GET | /inventory/low-stock | Low stock alerts | inventory.read |
| POST | /inventory/counts | Physical count entry | inventory.create |
| GET | /inventory/valuation | Inventory valuation | inventory.read |

### 9.2.7 Purchasing

| Method | Endpoint | Purpose | Permissions |
|---|---|---|---|
| GET | /purchase-orders | List POs | purchasing.read |
| GET | /purchase-orders/{id} | PO detail with lines | purchasing.read |
| POST | /purchase-orders | Create PO | purchasing.create |
| PUT | /purchase-orders/{id} | Update PO | purchasing.update |
| POST | /purchase-orders/{id}/approve | Approve PO | purchasing.approve |
| POST | /purchase-orders/{id}/receive | Goods receipt | purchasing.receive |
| GET | /suppliers | List suppliers | purchasing.read |
| POST | /suppliers | Create supplier | purchasing.create |

### 9.2.8 Sales and CRM

| Method | Endpoint | Purpose | Permissions |
|---|---|---|---|
| GET | /sales-orders | List SOs | sales.read |
| POST | /sales-orders | Create SO | sales.create |
| PUT | /sales-orders/{id} | Update SO | sales.update |
| POST | /sales-orders/{id}/approve | Approve SO | sales.approve |
| POST | /sales-orders/{id}/ship | Create shipment | sales.ship |
| GET | /customers | List customers | sales.read |
| GET | /customers/{id}/360 | 360-degree view | sales.read |
| GET | /leads | List leads | crm.read |
| POST | /leads | Create lead | crm.create |
| GET | /opportunities | Pipeline view | crm.read |
| PUT | /opportunities/{id}/stage | Move stage | crm.update |

### 9.2.9 Accounting and Finance

| Method | Endpoint | Purpose | Permissions |
|---|---|---|---|
| GET | /chart-of-accounts | Full COA | accounting.read |
| POST | /chart-of-accounts | Create account | accounting.create |
| GET | /journals | List journal batches | accounting.read |
| POST | /journals | Create journal | accounting.create |
| POST | /journals/{id}/post | Post journal | accounting.post |
| GET | /invoices | List invoices | accounting.read |
| POST | /invoices | Create invoice | accounting.create |
| POST | /invoices/{id}/payment | Record payment | accounting.create |
| GET | /tax/reports | Tax reports | accounting.read |

### 9.2.10 Projects

| Method | Endpoint | Purpose | Permissions |
|---|---|---|---|
| GET | /projects | List projects | projects.read |
| POST | /projects | Create project | projects.create |
| GET | /projects/{id}/tasks | Project tasks | projects.read |
| POST | /projects/{id}/tasks | Create task | projects.create |
| PUT | /tasks/{id} | Update task | projects.update |
| POST | /time-entries | Log time | projects.create |
| GET | /projects/{id}/gantt | Gantt data | projects.read |

### 9.2.11 System

| Method | Endpoint | Purpose | Permissions |
|---|---|---|---|
| GET | /notifications | User notifications | notifications.read |
| PUT | /notifications/{id}/read | Mark as read | notifications.update |
| GET | /reports | Available reports | reports.read |
| POST | /reports/generate | Generate report | reports.create |
| GET | /audit-logs | Audit trail | audit.read |
| GET | /monitoring/health | Health check | None |
| POST | /documents/upload | Upload file | documents.create |
| GET | /search?q= | Global search | search |
---

# 10. UI Design

## 10.1 Navigation Architecture

The UI follows a standard enterprise layout with:

- **Header**: Logo, global search, notifications, user menu, theme toggle, language selector
- **Sidebar**: Collapsible menu with module groups, icons, badges for pending items
- **Content Area**: Breadcrumb, page title, action buttons, main content
- **Footer**: Version, copyright, support link

## 10.2 Sidebar Menu Structure

Dashboard
  +-- Executive Dashboard
  +-- My Dashboard
  +-- Analytics

Human Resources
  +-- Employees (list, org chart, documents)
  +-- Attendance (daily records, calendar, reports)
  +-- Leaves (my leaves, team leaves, policies)
  +-- Payroll (runs, payslips, tax reports)
  +-- Recruitment (job posts, candidates, pipeline)
  +-- Performance (reviews, OKRs, feedback)

Inventory and Warehouse
  +-- Products (list, categories, variants, barcodes)
  +-- Stock (levels, movements, adjustments, low stock)
  +-- Warehouses (list, locations, bins)
  +-- Transfers (orders, pending receipts, history)

Procurement
  +-- Purchase Orders (all, pending, goods receipts)
  +-- Suppliers (list, contracts, performance)
  +-- RFQs

Sales and CRM
  +-- CRM (leads, opportunities, pipeline)
  +-- Customers (list, 360 view, segments)
  +-- Sales Orders (quotes, orders, shipments, returns)

Accounting and Finance
  +-- Chart of Accounts
  +-- Journals
  +-- Invoices (sales, purchase, credit notes)
  +-- Payments
  +-- Bank (accounts, reconciliation)
  +-- Taxes (rates, reports, returns)
  +-- Budgets
  +-- Financial Reports (balance sheet, income statement, trial balance, GL)

Projects
  +-- Projects
  +-- Tasks
  +-- Gantt Chart
  +-- Time Tracking

Reports and Analytics
  +-- Report Builder
  +-- Scheduled Reports
  +-- Export Center

Settings
  +-- Company Settings
  +-- Users and Roles
  +-- Permissions
  +-- Workflows
  +-- Email/SMS Templates
  +-- Integrations
  +-- Localization

System Administration
  +-- Audit Logs
  +-- Activity Logs
  +-- Backup and Restore
  +-- Queue Monitor
  +-- Health Check
  +-- API Docs

## 10.3 Component Design Patterns

**Data Table**: Search bar, filter dropdown, column visibility toggle, export button, add button, sortable columns, row selection, bulk actions, pagination with page size selector.

**Detail Form**: Avatar/image upload, tabbed content sections, edit/save/cancel actions, validation feedback, auto-save for some fields.

**Dashboard**: Grid of KPI stat cards (4-6), chart panels, recent activity feed, pending approvals list, quick action buttons.

**Kanban Board**: Draggable cards across pipeline stages, card detail preview, inline editing.

**Modal/Drawer**: Used for quick-create, detail view, confirmation dialogs. Drawer for side-panel detail views.

## 10.4 Responsive Behavior

| Breakpoint | Width | Layout | Sidebar |
|---|---|---|---|
| Desktop XL | >1440px | Full | Expanded |
| Desktop | 1024-1440px | Full | Collapsible |
| Tablet | 768-1024px | Condensed | Icon-only |
| Mobile | <768px | Single column | Drawer overlay |

## 10.5 Design System

**Colors**: Primary (#1677ff), Success (#52c41a), Warning (#faad14), Error (#ff4d4f), Dark mode variant for each.

**Typography**: System font stack, sizes from 12px to 32px.

**Spacing**: 4px base unit, up to 64px.

**Shadows**: 3 levels (sm, md, lg) for elevation.

**Border Radius**: 4px (sm), 8px (md), 12px (lg).

## 10.6 Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation for all interactive elements
- ARIA labels and roles
- Screen reader announcements via aria-live
- Color contrast ratio >= 4.5:1
- Focus indicators (3px outline)
- Skip-to-content link
- Form errors linked via aria-describedby

---

# 11. Security Plan

## 11.1 Authentication and Authorization

| Layer | Mechanism | Detail |
|---|---|---|
| Password Hashing | bcrypt (cost=12) | Salted, computationally expensive |
| JWT Signing | RS256 (RSA 2048-bit) | Asymmetric: private key signs, public key verifies |
| JWT Lifetime | Access: 15 min | Short-lived to limit exposure |
| Refresh Token | 7 days, rotating | Old token invalidated on refresh |
| MFA | TOTP (RFC 6238) | Google Authenticator, Authy |
| SSO | OAuth 2.0 + OIDC | Azure AD, Google Workspace, Okta |
| Session Storage | Redis (encrypted) | TTL-based auto-cleanup |
| RBAC Engine | Pre-computed permission set | Cached in Redis per user |
| Row-Level Security | company_id filter on all queries | Enforced at ORM and DB level |

## 11.2 Permission System Design

Permission structure: User has Roles, Roles have Permissions
Each permission = (module, action, scope)
Scope: own, department, company, all
Negative overrides supported (explicit deny takes precedence)

Check flow:
1. Extract user, roles from JWT
2. Get cached permission set from Redis
3. Check (module, action, scope) against set
4. If negative override exists, deny
5. If match found, allow
6. If no match, deny

## 11.3 Data Protection

| Category | Measure |
|---|---|
| At Rest (DB) | AES-256 encryption |
| At Rest (Files) | Server-side S3 encryption (AES-256) |
| In Transit | TLS 1.3 minimum, HSTS enabled |
| Secrets | HashiCorp Vault, auto-rotation every 90 days |
| PII | Pseudonymization for reporting; encryption for storage |
| Passwords | Never logged, never returned in API responses |

## 11.4 Password Policy (NIST SP 800-63B)

| Rule | Value |
|---|---|
| Minimum length | 12 characters |
| Maximum length | 128 characters |
| Complexity | No composition rules (encourage passphrases) |
| Failed attempts before lockout | 5 |
| Lockout duration | 15 minutes (auto-reset) |
| Password history | 5 previous passwords |
| Max password age | 365 days |
| MFA enforcement | Required for all admin roles |

## 11.5 Rate Limiting

| Endpoint Group | Rate (per IP/User) | Burst |
|---|---|---|
| Login | 10/min | 5 |
| Password reset | 3/min | 3 |
| API standard | 1000/min | 100 |
| API reports | 100/min | 10 |
| API exports | 20/min | 5 |
| File upload | 50/min | 10 |

## 11.6 Audit Logging

Every mutation captures: user_id, company_id, event_type, resource_type, resource_id, changes_json (before/after diff), ip_address, user_agent, timestamp (microsecond), correlation_id.

Retention:
- Hot (PostgreSQL): 90 days
- Warm (Elasticsearch): 1 year
- Cold (S3 Parquet): 7 years (compliance)

## 11.7 API Security

| Measure | Implementation |
|---|---|
| CORS | Whitelist of allowed origins, restricted methods |
| CSRF | SameSite=Strict cookies + CSRF token header |
| XSS Protection | Content-Security-Policy header, input sanitization |
| SQL Injection | Parameterized queries via SQLAlchemy (no raw SQL) |
| Request Size Limit | 10MB per request |
| File Upload Validation | MIME type check, magic byte verification, AV scan |
| API Keys | Hashed at rest, prefix for identification |
| Webhook Secrets | HMAC-SHA256 signature verification |

## 11.8 Secure by Default

- All new users created as inactive; must be activated
- Debug endpoints disabled in production
- Stack traces never returned to client
- CORS restricted per environment
- Admin endpoints support IP whitelist
- Database connections use SSL/TLS

---

# 12. Performance Plan

## 12.1 Database Optimization

| Technique | Application | Expected Gain |
|---|---|---|
| Composite Indexes | (company_id, status), (company_id, created_at) | 50-200x for filtered queries |
| Partial Indexes | WHERE deleted_at IS NULL | 2-3x for active reads |
| Covering Indexes | Include all selected columns in index | Avoid heap lookups |
| Table Partitioning | By company_id or created_at for large tables | 10x for range scans |
| Read Replicas | Reports, analytics to replica | Offload primary by 60% |
| Connection Pooling | PgBouncer (transaction pooling) | 5x connection throughput |
| Materialized Views | Sales summaries, inventory snapshots | 100x for aggregate queries |
| Query Optimization | EXPLAIN ANALYZE on all slow queries | Variable 10-1000x |

## 12.2 Caching Architecture

Four-tier caching:
1. Browser Cache: Static assets with hash-based filenames (immutable, 1 year)
2. CDN Cache: Public content, static files
3. Redis Cache: Application data (permissions, products, config) - Cache-Aside pattern
4. Database: Materialized views refreshed periodically

Cache invalidation: On write, delete related Redis keys. On schema change, refresh materialized views.

## 12.3 Frontend Performance

| Technique | Implementation |
|---|---|
| Code Splitting | React.lazy() + Suspense per module route |
| Bundle Optimization | Vite tree-shaking, manual chunk splitting |
| Image Optimization | WebP format, srcset, lazy loading |
| Virtual Scrolling | TanStack Virtual for tables >10k rows |
| Debounced Search | 300ms debounce, cancel previous requests |
| Memoization | React.memo, useMemo, useCallback |
| Prefetching | TanStack Query prefetch on hover |
| Bundle Analysis | Regular audits with vite-bundle-analyzer |

## 12.4 Backend Performance

| Technique | Implementation |
|---|---|
| Async I/O | FastAPI async endpoints for I/O-bound operations |
| Connection Pool | SQLAlchemy pool_size=20, max_overflow=10 |
| Response Compression | gzip/brotli middleware for responses >1KB |
| Pagination | Cursor-based for large datasets (no OFFSET) |
| Bulk Operations | Batch endpoints (/bulk-create, /bulk-update) |
| Lazy Loading | SQLAlchemy selectinload for related data |
| N+1 Detection | SQLAlchemy echo + slow query logging in dev |
| Background Processing | Celery for all non-realtime operations |

## 12.5 Monitoring and Alerting

| Metric | Alert Threshold | Action |
|---|---|---|
| API p95 latency >500ms | Warning | Scale up, investigate slow query |
| API error rate >1% | Critical | Rollback, page on-call |
| DB query time >200ms | Warning | Optimize query, add index |
| CPU >80% for 5 min | Warning | Scale horizontally |
| Memory >85% for 5 min | Warning | Increase resources |
| Disk space <20% | Critical | Cleanup, increase volume |
| Redis memory >80% | Warning | Review eviction, scale cluster |
| Queue backlog >10k | Warning | Add workers, optimize consumer |
| 5xx errors >0.5% | Critical | Immediate investigation |

---

# 13. Folder Structure

## 13.1 Top-Level Repository (Monorepo)

`
erp-platform/
+-- frontend/                    # React SPA
+-- backend/                     # FastAPI application
+-- shared/                      # Shared types, validation, utils
+-- database/                    # Migrations, seeds, scripts
+-- infrastructure/              # Terraform, K8s manifests, Docker
+-- docs/                        # Architecture, API, user guides
+-- tests/                       # E2E, integration, load tests
+-- scripts/                     # Build, deploy, utility scripts
+-- ci/                          # CI/CD pipeline definitions
+-- .github/                     # GitHub templates, workflows
+-- docker-compose.yml           # Local development
+-- docker-compose.prod.yml      # Production simulation
+-- Makefile                     # Command shortcuts
+-- .env.example                 # Environment templates
+-- README.md
`

## 13.2 Frontend Structure

`
frontend/
+-- public/
|   +-- locales/                 # i18n JSON files (en, tr, de, fr)
|   +-- assets/                  # images, icons, fonts
+-- src/
|   +-- main.tsx                 # Entry point
|   +-- App.tsx                  # Root with providers
|   +-- routes.tsx               # Lazy-loaded route definitions
|   +-- providers/               # Auth, Theme, Locale, Query providers
|   +-- layouts/                 # MainLayout, AuthLayout, PortalLayout
|   |   +-- components/          # Sidebar, Header, Breadcrumbs, Footer
|   +-- modules/                 # Feature modules (lazy loaded)
|   |   +-- auth/                # Login, ForgotPassword, MFA
|   |   +-- dashboard/           # Executive, My Dashboard, Analytics
|   |   +-- hr/                  # Employees, Attendance, Leaves, Payroll
|   |   +-- inventory/           # Products, Stock, Warehouses
|   |   +-- procurement/         # PurchaseOrders, Suppliers
|   |   +-- sales/               # SalesOrders, Customers, CRM
|   |   +-- accounting/          # COA, Journals, Invoices, Tax, Budget
|   |   +-- projects/            # Projects, Tasks, Gantt, Time
|   |   +-- reports/             # ReportBuilder, Schedule
|   |   +-- settings/            # Company, Users, Roles, Workflows
|   |   +-- admin/               # Audit, Backup, Queue, Health
|   |   +-- portal/              # Customer/Supplier portal
|   +-- components/              # Shared UI components
|   |   +-- ui/                  # Atomic: Button, Input, Table, Modal
|   |   +-- data/                # DataTable, Kanban, TreeSelect
|   |   +-- charts/              # Bar, Line, Pie, Area, Gauge
|   +-- hooks/                   # useAuth, usePermission, usePagination
|   +-- services/                # API client, endpoints, websocket
|   +-- store/                   # Zustand stores (auth, ui, notifications)
|   +-- utils/                   # format, validators, permissions, helpers
|   +-- styles/                  # globals, variables, antd-overrides
+-- vite.config.ts
+-- tailwind.config.js
+-- tsconfig.json
+-- package.json
`

## 13.3 Backend Structure

`
backend/
+-- alembic/                     # Migration versions
+-- app/
|   +-- main.py                  # FastAPI app factory
|   +-- config.py                # pydantic-settings config
|   +-- dependencies.py          # DI container
|   +-- core/                    # Cross-cutting concerns
|   |   +-- security/            # jwt, password, permissions, rate_limit, mfa
|   |   +-- database/            # session, base, mixins, types
|   |   +-- cache/               # redis client, decorators
|   |   +-- queue/               # celery_app, task definitions
|   |   +-- logging/             # logger, correlation middleware
|   |   +-- audit/               # audit log tracker
|   |   +-- search/              # elasticsearch client
|   |   +-- storage/             # s3 file operations
|   |   +-- i18n/                # translator
|   |   +-- events/              # dispatcher, handlers
|   +-- modules/                 # Feature modules
|   |   +-- auth/                # router, schemas, service, repository, models
|   |   +-- users/               # router, schemas, service, repository, models
|   |   +-- roles/               # router, schemas, service, repository, models
|   |   +-- companies/           # router, schemas, service, repository, models
|   |   +-- employees/           # router, schemas, service, repository, models
|   |   +-- hr/                  # Attendance, Leaves, Performance
|   |   +-- payroll/             # Payroll processing, payslips
|   |   +-- products/            # Product catalog, variants
|   |   +-- inventory/           # Stock, warehouses, transfers
|   |   +-- purchasing/          # Purchase orders, suppliers
|   |   +-- sales/               # Sales orders, shipments
|   |   +-- crm/                 # Leads, opportunities
|   |   +-- accounting/          # COA, journals, invoices
|   |   +-- finance/             # Budget, cash flow, bank
|   |   +-- projects/            # Projects, tasks, time
|   |   +-- notifications/       # Email, SMS, push
|   |   +-- reports/             # Report generation
|   |   +-- documents/           # File management
|   |   +-- audit/               # Audit log
|   |   +-- settings/            # Configuration
|   |   +-- workflows/           # Automation engine
|   |   +-- integrations/        # Third-party connectors
|   |   +-- ai/                  # NLP, predictions
|   +-- middleware/               # cors, auth, audit, rate_limit, correlation_id
|   +-- schemas/                  # Shared Pydantic schemas, enums
|   +-- utils/                    # pagination, export, import, barcode
+-- tests/                        # conftest, factories, integration, fixtures
+-- requirements/                 # base, dev, staging, prod
+-- Dockerfile
+-- pyproject.toml
+-- ruff.toml
+-- mypy.ini
`

## 13.4 Infrastructure Structure

`
infrastructure/
+-- terraform/
|   +-- environments/ (dev, staging, prod)
|   +-- modules/ (networking, database, kubernetes, storage)
+-- kubernetes/
|   +-- namespaces/
|   +-- deployments/ (api, worker, frontend, flower)
|   +-- services/
|   +-- hpa/
|   +-- configmaps/
|   +-- ingress/
|   +-- pv/
+-- monitoring/
|   +-- prometheus/ (config, rules)
|   +-- grafana/ (dashboards, datasources)
|   +-- loki/
|   +-- jaeger/
+-- docker/ (Dockerfiles)
+-- scripts/ (init, deploy, rollback, seed, backup)
`

---

# 14. Development Roadmap

## 14.1 Phase Overview

`
Phase 1 (Foundation)                    Weeks 1-8
Phase 2 (Core Business)                 Weeks 9-16
Phase 3 (Operations)                    Weeks 17-24
Phase 4 (Finance and Intelligence)      Weeks 25-32
Phase 5 (Collaboration and Automation)  Weeks 33-40
Phase 6 (Integration and Optimization)  Weeks 41-48
Phase 7 (Governance and Scale)          Weeks 49-52
`

## 14.2 Detailed Phase Plan

### Phase 1: Foundation (Weeks 1-8)

| Weeks | Tasks | Deliverables |
|---|---|---|
| 1-2 | Project setup, repo structure, CI/CD, Docker Compose | Running dev environment, green CI |
| 2-3 | Database schema (core), Alembic migrations, seeds | Migration chain, seed data |
| 3-4 | Authentication (login, JWT, refresh, MFA) | Auth API, login page |
| 4-5 | User, Role, Permission system, RBAC engine | User/role CRUD, permission check |
| 5-6 | Company/Branch/Department, multi-tenancy | Company setup, branch management |
| 6-7 | Base UI: layout, sidebar, header, theme, i18n, routing | Main layout, navigation |
| 7-8 | Dashboard, KPI widgets, API client, error handling | Role-specific dashboards |

**Dependencies**: None (foundation). **Complexity**: Medium.

### Phase 2: Core Business (Weeks 9-16)

| Weeks | Tasks | Deliverables |
|---|---|---|
| 9-10 | Employee module (CRUD, org chart, documents) | Employee API, pages |
| 10-11 | Product catalog (variants, categories, barcodes) | Product API, table, form |
| 11-12 | Inventory (stock levels, movements, adjustments) | Stock API, level indicator |
| 12-13 | Warehouse (locations, bins, transfers) | Warehouse API, transfer workflow |
| 13-14 | Customer and Supplier master data | Customer/supplier API, pages |
| 14-15 | File upload/download, document management | Document API, uploader |
| 15-16 | Audit log, activity log | Audit API, viewer |

**Dependencies**: Phase 1. **Complexity**: Medium-High.

### Phase 3: Operations (Weeks 17-24)

| Weeks | Tasks | Deliverables |
|---|---|---|
| 17-18 | Sales Orders (quotes, orders, shipments) | SO lifecycle, API, pages |
| 18-19 | CRM (leads, opportunities, pipeline) | CRM API, Kanban pipeline |
| 19-20 | Purchase Orders (RFQ, PO, GRN) | Purchase lifecycle, approval |
| 20-21 | Invoicing (AR/AP, credit notes, e-invoice) | Invoice API, PDF generation |
| 21-22 | Attendance (clock-in/out, geo) | Attendance API, calendar |
| 22-23 | Leave management (policies, accruals) | Leave API, balance, approvals |
| 23-24 | Payroll (runs, payslips, deductions) | Payroll API, batch processing |

**Dependencies**: Phase 2. **Complexity**: High.

### Phase 4: Finance and Intelligence (Weeks 25-32)

| Weeks | Tasks | Deliverables |
|---|---|---|
| 25-26 | Chart of Accounts, Journals, GL | COA API, journal entry, GL viewer |
| 26-27 | Tax engine (VAT, GST, Withholding) | Tax API, reports, filing data |
| 27-28 | Bank management, reconciliation | Bank API, reconciliation engine |
| 29-29 | Budgeting, cash flow, financial reports | Budget API, P&L, balance sheet |
| 29-30 | Projects, Tasks, Gantt | Project API, Kanban, Gantt |
| 30-31 | Time tracking, resource allocation | Time entry API, reports |
| 31-32 | Reports builder, scheduled reports | Report API, drag-drop builder |

**Dependencies**: Phase 3. **Complexity**: Very High.

### Phase 5: Collaboration and Automation (Weeks 33-40)

| Weeks | Tasks | Deliverables |
|---|---|---|
| 33-34 | Notifications (email, SMS, push, in-app) | Notification API, templates |
| 34-35 | Workflow automation engine | Workflow designer, execution engine |
| 35-36 | Email/SMS template editors | Drag-drop template editor |
| 36-37 | Internal messaging, chat | Chat API, real-time WebSocket |
| 37-38 | Calendar, resource booking | Calendar API, scheduling |
| 38-39 | Recruitment, performance management | Recruitment API, review forms |
| 39-40 | Asset management, fixed assets | Asset API, depreciation engine |

**Dependencies**: Phase 2, 3. **Complexity**: Medium.

### Phase 6: Integration and Optimization (Weeks 41-48)

| Weeks | Tasks | Deliverables |
|---|---|---|
| 41-42 | Integration hub (REST/SOAP connectors) | Integration API, webhook system |
| 43-44 | Third-party connectors (Stripe, Shopify, QuickBooks) | Connector implementations |
| 45-46 | Performance optimization, load testing | Caching improvements, CDN setup |
| 47-48 | Customer and Supplier portals | Portal pages, self-service flows |

**Dependencies**: Phase 4. **Complexity**: Medium.

### Phase 7: Governance and Scale (Weeks 49-52)

| Weeks | Tasks | Deliverables |
|---|---|---|
| 49-50 | AI Assistant (NLP queries, anomaly detection) | AI API, chatbot, predictions |
| 50-51 | System monitoring, alerting, runbooks | Grafana dashboards, PagerDuty |
| 51-52 | Security audit, penetration testing, compliance | Security report, compliance docs |

**Dependencies**: All previous phases. **Complexity**: Medium.

## 14.3 Resource Allocation

| Role | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 | Phase 6 | Phase 7 |
|---|---|---|---|---|---|---|---|
| Backend Engineer | 2 | 3 | 3 | 3 | 2 | 2 | 2 |
| Frontend Engineer | 2 | 2 | 2 | 2 | 2 | 1 | 1 |
| DevOps Engineer | 1 | 0.5 | 0.5 | 0.5 | 0.5 | 1 | 1 |
| QA Engineer | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Business Analyst | 0.5 | 0.5 | 1 | 1 | 0.5 | 0.5 | 0 |
| Security Engineer | 0.5 | 0 | 0 | 0 | 0 | 0 | 1 |
| **Total** | **7** | **7** | **7.5** | **7.5** | **6** | **5.5** | **6** |

---

# 15. Risks

## 15.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Database migration conflicts in multi-tenant schema | Medium | High | Careful migration review, staging rollback testing |
| API performance degradation under concurrent load | Medium | High | Load testing from Phase 1, auto-scaling, caching |
| Frontend bundle size growth with 46 modules | Medium | Medium | Code splitting, lazy loading, bundle analysis |
| Third-party integration API breaking changes | High | Medium | Abstract connector layer, integration tests, version pinning |
| Real-time notification system reliability | Medium | Medium | Queue persistence, dead letter handling, monitoring |
| Search index inconsistency with database | Medium | Medium | Scheduled re-indexing, sync verification jobs |

## 15.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Scope creep during implementation | High | Very High | Strict phased approach, change control process |
| Requirements misinterpretation between modules | Medium | High | Cross-module design reviews, BA involvement |
| User adoption resistance to new system | Medium | High | UI/UX prioritization, training program, gradual rollout |
| Localization complexity across 10+ countries | Medium | Medium | Locale module from Phase 1, translation workflow |

## 15.3 Scaling Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Database becoming bottleneck at 50k+ users | Medium | High | Read replicas, partitioning, connection pooling |
| File storage costs growing exponentially | Medium | Medium | Lifecycle policies, compression, archival to cold storage |
| Cache stampede on cache miss for popular data | Low | High | Cache warming, mutex locking on regeneration |

## 15.4 Security Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Data leakage between tenants (multi-tenancy) | Low | Critical | Row-level security, regular penetration testing |
| Compromised JWT signing key | Low | Critical | Short token TTL, key rotation, Vault storage |
| Insider threat from privileged users | Medium | High | Audit logging, separation of duties, anomaly detection |
| API abuse via rate limit bypass | Low | Medium | Multiple rate limit layers, monitoring, WAF |

## 15.5 Maintenance Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Knowledge loss when team members leave | Medium | High | Comprehensive documentation, code reviews, pair programming |
| Dependency outdated/compromised libraries | High | Medium | Dependabot/Renovate, regular dependency audits |
| Technical debt accumulation in early phases | High | Medium | Code quality gates, refactoring budget in each phase |

---

# 16. Future Improvements

## 16.1 Phase 8+ Candidates

| Feature | Value | Effort | Notes |
|---|---|---|---|
| Microservice extraction from modular monolith | High | Very High | Extract high-traffic modules (Inventory, Accounting) |
| Event sourcing for audit-critical modules | High | High | Replace audit logs with event store |
| CQRS pattern for reporting | Medium | High | Separate read/write models for complex queries |
| Multi-region active-active deployment | High | Very High | Global companies need data residency |
| Mobile native apps (iOS/Android) | Medium | High | PWA may suffice for most use cases |
| E-commerce storefront integration | Medium | Medium | Pre-built connector for web sales |
| BI tool integration (PowerBI, Tableau) | Medium | Low | Direct database connection or ODBC |
| Advanced reporting with OLAP cubes | Medium | High | Dedicated analytics database (ClickHouse) |
| Document template engine (contracts, invoices) | Medium | Medium | Replace static PDF generation |
| OCR for document scanning | Low | Medium | Receipt scanning, invoice auto-processing |
| Blockchain for supply chain traceability | Low | Very High | Long-term, if regulatory requirement arises |
| Voice commands and voice-based reporting | Low | Medium | AI integration opportunity |

## 16.2 Technical Debt Items

- Migrate from REST to GraphQL for complex queries when needed
- Replace Celery with temporal.io or similar for complex workflows
- Implement feature flags system (LaunchDarkly/Unleash)
- Add canary deployment for frontend modules
- Implement proper chaos engineering practices

---

# 17. AI Integration Opportunities

## 17.1 Near-Term AI Features (Low Effort, High Value)

| Feature | Description | Module | Estimated Effort |
|---|---|---|---|
| Smart Search | Natural language search across all entities | Global | 2 weeks |
| Anomaly Detection | Unusual transaction patterns (fraud detection) | Accounting | 3 weeks |
| Predictive Inventory | Demand forecasting for stock replenishment | Inventory | 4 weeks |
| Cash Flow Prediction | Forecast cash position based on AR/AP aging | Finance | 3 weeks |
| Smart Notifications | Intelligent alert prioritization | Notifications | 2 weeks |

## 17.2 Medium-Term AI Features (Medium Effort)

| Feature | Description | Module | Estimated Effort |
|---|---|---|---|
| AI Assistant Chatbot | Natural language query interface (similar to GitHub Copilot Chat) | All | 8 weeks |
| Document Classification | Auto-categorize uploaded documents using NLP | Documents | 4 weeks |
| Resume Parsing | Extract candidate information from resumes | Recruitment | 3 weeks |
| Invoice Auto-Matching | Match invoices to POs and receipts using ML | Accounting | 6 weeks |
| Customer Churn Prediction | Analyze CRM data to predict churn risk | CRM | 4 weeks |
| Employee Attrition Risk | Predict turnover based on patterns | HR | 4 weeks |
| Lead Scoring | Prioritize leads based on conversion probability | CRM | 3 weeks |

## 17.3 Architecture for AI Integration

`
+------------------+
|  User Query      |
+--------+---------+
         |
         v
+------------------+
|  NLP Engine      |  (OpenAI API / Local LLM)
|  Intent Parsing  |
+--------+---------+
         |
         v
+------------------+
|  Query Router    |
|  + SQL Generator |
+--------+---------+
         |
         v
+------------------+
|  Data Sources    |
|  + PostgreSQL    |
|  + Elasticsearch |
|  + S3 Docs       |
+--------+---------+
         |
         v
+------------------+
|  Response        |
|  + Natural Lang  |
|  + Chart Data    |
|  + Actions       |
+------------------+
`

**Key principles for AI integration**:
- All AI features are **add-on**, never blocking core functionality
- AI responses include confidence scores and disclaimers
- User must approve any AI-triggered mutations
- Audit log captures all AI interactions
- Rate limits apply to AI endpoints separately
- Models can be swapped (OpenAI / Anthropic / Open Source)

---

# Appendix A: Architecture Decision Records (ADRs)

## ADR-001: Monorepo with Modular Monolith

**Context**: Need to balance development speed with future scalability.
**Decision**: Start with modular monolith. Clear bounded contexts with strict module boundaries.
**Consequences**: Faster development, easier refactoring. Extraction to microservices possible later.

## ADR-002: PostgreSQL over NewSQL

**Context**: Need ACID compliance, complex joins, and mature tooling.
**Decision**: PostgreSQL 16 with partitioning and read replicas.
**Consequences**: Excellent reliability, rich ecosystem. Vertical scaling ceiling requires partitioning.

## ADR-003: FastAPI over Django

**Context**: Need async performance, automatic OpenAPI, and type safety.
**Decision**: FastAPI with SQLAlchemy async.
**Consequences**: Better performance for I/O operations, automatic API docs. Less built-in admin UI.

## ADR-004: Ant Design over MUI

**Context**: Need enterprise-grade components with built-in i18n and complex tables.
**Decision**: Ant Design 5 with Tailwind CSS.
**Consequences**: Rich component library, excellent table component. Larger bundle size (mitigated by code splitting).

## ADR-005: UUID v7 over Auto-increment IDs

**Context**: Need globally unique, time-sortable IDs for multi-tenant distributed system.
**Decision**: UUID v7 for all primary keys.
**Consequences**: No sequential guessing, merge-friendly across shards. 16 bytes vs 4 bytes for integer.

---

# Appendix B: Glossary

| Term | Definition |
|---|---|
| AR | Accounts Receivable |
| AP | Accounts Payable |
| COA | Chart of Accounts |
| CRM | Customer Relationship Management |
| ERP | Enterprise Resource Planning |
| GL | General Ledger |
| GRN | Goods Receipt Note |
| HPA | Horizontal Pod Autoscaler |
| JWT | JSON Web Token |
| MFA | Multi-Factor Authentication |
| PO | Purchase Order |
| PWA | Progressive Web Application |
| RBAC | Role-Based Access Control |
| RFQ | Request for Quotation |
| RPO | Recovery Point Objective |
| RTO | Recovery Time Objective |
| SO | Sales Order |
| SSO | Single Sign-On |
| TOTP | Time-based One-Time Password |
| WAF | Web Application Firewall |
| WAL | Write-Ahead Logging |

---

# Appendix C: Key Metrics and KPIs

| KPI | Formula | Module |
|---|---|---|
| Inventory Turnover | COGS / Average Inventory | Inventory |
| Days Sales Outstanding | (AR / Revenue) x 365 | Accounting |
| Days Payable Outstanding | (AP / COGS) x 365 | Accounting |
| Order-to-Cash Cycle | Order date to Payment date | Sales/Accounting |
| Procure-to-Pay Cycle | Requisition to Payment date | Procurement |
| Employee Turnover Rate | Departures / Avg Headcount | HR |
| Leave Utilization | Days Taken / Days Allowed | HR |
| Project Completion Rate | Completed / Total Projects | Projects |
| Sales Conversion Rate | Won Opportunities / Total | CRM |
| Customer Acquisition Cost | Sales Cost / New Customers | CRM |
| Gross Margin | (Revenue - COGS) / Revenue | Accounting |
| Net Promoter Score | Customer survey data | CRM |

---

*This document represents the complete architecture blueprint for the Enterprise ERP System. All 14 design phases have been addressed. The document is intended for review by the architecture team before development commences on Phase 1.*

**Document Version**: 1.0
**Last Updated**: July 2026
**Prepared By**: Enterprise Software Architecture Team
**Review Status**: Pending Architecture Review Board approval
