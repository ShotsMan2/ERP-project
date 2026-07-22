import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { Loading } from './components/ui/Loading';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import PublicLayout from './layouts/PublicLayout';
import PortalLayout from './layouts/PortalLayout';

const LazyLoad = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <ErrorBoundary>
    <Suspense fallback={<Loading type="page" />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

// ── Public Pages ──────────────────────────────────────────────────
const LandingPage = lazy(() => import('./modules/public/LandingPage'));
const FeaturesPage = lazy(() => import('./modules/public/FeaturesPage'));
const PricingPage = lazy(() => import('./modules/public/PricingPage'));
const AboutPage = lazy(() => import('./modules/public/AboutPage'));
const ContactPage = lazy(() => import('./modules/public/ContactPage'));
const BlogPage = lazy(() => import('./modules/public/BlogPage'));
const BlogDetail = lazy(() => import('./modules/public/BlogDetail'));

// ── Auth Pages ────────────────────────────────────────────────────
const LoginPage = lazy(() => import('./modules/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./modules/auth/ForgotPasswordPage'));
const MFAPage = lazy(() => import('./modules/auth/MFAPage'));

// ── Dashboard Pages ───────────────────────────────────────────────
const ExecutiveDashboard = lazy(() => import('./modules/dashboard/pages/ExecutiveDashboard'));
const MyDashboard = lazy(() => import('./modules/dashboard/pages/MyDashboard'));
const AnalyticsPage = lazy(() => import('./modules/dashboard/pages/Analytics'));

// ── HR Pages ──────────────────────────────────────────────────────
const EmployeeList = lazy(() => import('./modules/hr/EmployeeList'));
const EmployeeDetail = lazy(() => import('./modules/hr/EmployeeDetail'));
const AttendancePage = lazy(() => import('./modules/hr/AttendancePage'));
const LeavePage = lazy(() => import('./modules/hr/LeavePage'));
const PayrollPage = lazy(() => import('./modules/hr/PayrollPage'));
const RecruitmentPage = lazy(() => import('./modules/hr/RecruitmentPage'));
const PerformancePage = lazy(() => import('./modules/hr/PerformancePage'));

// ── Inventory Pages ───────────────────────────────────────────────
const ProductList = lazy(() => import('./modules/inventory/ProductList'));
const StockPage = lazy(() => import('./modules/inventory/StockPage'));
const WarehousePage = lazy(() => import('./modules/inventory/WarehousePage'));
const TransferPage = lazy(() => import('./modules/inventory/TransferPage'));

// ── Procurement Pages ─────────────────────────────────────────────
const PurchaseOrderList = lazy(() => import('./modules/procurement/PurchaseOrderList'));
const SupplierList = lazy(() => import('./modules/procurement/SupplierList'));
const RFQPage = lazy(() => import('./modules/procurement/RFQPage'));

// ── Sales Pages ───────────────────────────────────────────────────
const CRMPage = lazy(() => import('./modules/sales/CRMPage'));
const CustomerList = lazy(() => import('./modules/sales/CustomerList'));
const SalesOrderList = lazy(() => import('./modules/sales/SalesOrderList'));

// ── Accounting Pages ──────────────────────────────────────────────
const ChartOfAccounts = lazy(() => import('./modules/accounting/ChartOfAccounts'));
const JournalPage = lazy(() => import('./modules/accounting/JournalPage'));
const InvoiceList = lazy(() => import('./modules/accounting/InvoiceList'));
const PaymentPage = lazy(() => import('./modules/accounting/PaymentPage'));
const BankPage = lazy(() => import('./modules/accounting/BankPage'));
const TaxPage = lazy(() => import('./modules/accounting/TaxPage'));
const BudgetPage = lazy(() => import('./modules/accounting/BudgetPage'));
const FinancialReports = lazy(() => import('./modules/accounting/FinancialReports'));

// ── Projects Pages ────────────────────────────────────────────────
const ProjectList = lazy(() => import('./modules/projects/ProjectList'));
const TaskBoard = lazy(() => import('./modules/projects/TaskBoard'));
const GanttChart = lazy(() => import('./modules/projects/GanttChart'));
const TimeTracking = lazy(() => import('./modules/projects/TimeTracking'));

// ── Reports Pages ─────────────────────────────────────────────────
const ReportBuilder = lazy(() => import('./modules/reports/ReportBuilder'));
const ScheduledReports = lazy(() => import('./modules/reports/ScheduledReports'));
const ExportCenter = lazy(() => import('./modules/reports/ExportCenter'));

// ── Settings Pages ────────────────────────────────────────────────
const CompanySettings = lazy(() => import('./modules/settings/CompanySettings'));
const UsersRoles = lazy(() => import('./modules/settings/UsersRoles'));
const PermissionsPage = lazy(() => import('./modules/settings/PermissionsPage'));
const WorkflowsPage = lazy(() => import('./modules/settings/WorkflowsPage'));
const TemplatesPage = lazy(() => import('./modules/settings/TemplatesPage'));
const IntegrationsPage = lazy(() => import('./modules/settings/IntegrationsPage'));
const LocalizationPage = lazy(() => import('./modules/settings/LocalizationPage'));

// ── Admin Pages ───────────────────────────────────────────────────
const AuditLogs = lazy(() => import('./modules/admin/pages/AuditLogViewer'));
const ActivityLogs = lazy(() => import('./modules/admin/ActivityLogs'));
const BackupPage = lazy(() => import('./modules/admin/pages/BackupManager'));
const QueueMonitor = lazy(() => import('./modules/admin/pages/QueueMonitor'));
const HealthCheck = lazy(() => import('./modules/admin/pages/HealthCheck'));
const ApiDocs = lazy(() => import('./modules/admin/ApiDocs'));

// ── Portal Pages ──────────────────────────────────────────────────
const CustomerPortal = lazy(() => import('./modules/portal/CustomerPortal'));
const SupplierPortal = lazy(() => import('./modules/portal/SupplierPortal'));

const NotFound = lazy(() => import('./modules/NotFound'));

export const routes: RouteObject[] = [
  // ── Public Routes ─────────────────────────────────────────────
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: LazyLoad(LandingPage) },
      { path: 'features', element: LazyLoad(FeaturesPage) },
      { path: 'pricing', element: LazyLoad(PricingPage) },
      { path: 'about', element: LazyLoad(AboutPage) },
      { path: 'contact', element: LazyLoad(ContactPage) },
      { path: 'blog', element: LazyLoad(BlogPage) },
      { path: 'blog/:id', element: LazyLoad(BlogDetail) },
    ],
  },
  // ── Auth Routes ──────────────────────────────────────────────
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: LazyLoad(LoginPage) },
      { path: 'forgot-password', element: LazyLoad(ForgotPasswordPage) },
      { path: 'mfa', element: LazyLoad(MFAPage) },
    ],
  },
  // ── Portal Routes ────────────────────────────────────────────
  {
    path: '/portal',
    element: <PortalLayout />,
    children: [
      { index: true, element: LazyLoad(CustomerPortal) },
      { path: 'supplier', element: LazyLoad(SupplierPortal) },
    ],
  },
  // ── Authenticated App Routes ─────────────────────────────────
  {
    path: '/app',
    element: <MainLayout />,
    children: [
      { index: true, element: LazyLoad(ExecutiveDashboard) },
      { path: 'dashboard/executive', element: LazyLoad(ExecutiveDashboard) },
      { path: 'dashboard/my', element: LazyLoad(MyDashboard) },
      { path: 'dashboard/analytics', element: LazyLoad(AnalyticsPage) },

      { path: 'hr/employees', element: LazyLoad(EmployeeList) },
      { path: 'hr/employees/:id', element: LazyLoad(EmployeeDetail) },
      { path: 'hr/attendance', element: LazyLoad(AttendancePage) },
      { path: 'hr/leaves', element: LazyLoad(LeavePage) },
      { path: 'hr/payroll', element: LazyLoad(PayrollPage) },
      { path: 'hr/recruitment', element: LazyLoad(RecruitmentPage) },
      { path: 'hr/performance', element: LazyLoad(PerformancePage) },

      { path: 'inventory/products', element: LazyLoad(ProductList) },
      { path: 'inventory/stock', element: LazyLoad(StockPage) },
      { path: 'inventory/warehouses', element: LazyLoad(WarehousePage) },
      { path: 'inventory/transfers', element: LazyLoad(TransferPage) },

      { path: 'procurement/purchase-orders', element: LazyLoad(PurchaseOrderList) },
      { path: 'procurement/suppliers', element: LazyLoad(SupplierList) },
      { path: 'procurement/rfqs', element: LazyLoad(RFQPage) },

      { path: 'sales/crm', element: LazyLoad(CRMPage) },
      { path: 'sales/customers', element: LazyLoad(CustomerList) },
      { path: 'sales/orders', element: LazyLoad(SalesOrderList) },

      { path: 'accounting/chart-of-accounts', element: LazyLoad(ChartOfAccounts) },
      { path: 'accounting/journals', element: LazyLoad(JournalPage) },
      { path: 'accounting/invoices', element: LazyLoad(InvoiceList) },
      { path: 'accounting/payments', element: LazyLoad(PaymentPage) },
      { path: 'accounting/bank', element: LazyLoad(BankPage) },
      { path: 'accounting/taxes', element: LazyLoad(TaxPage) },
      { path: 'accounting/budgets', element: LazyLoad(BudgetPage) },
      { path: 'accounting/reports', element: LazyLoad(FinancialReports) },

      { path: 'projects', element: LazyLoad(ProjectList) },
      { path: 'projects/tasks', element: LazyLoad(TaskBoard) },
      { path: 'projects/gantt', element: LazyLoad(GanttChart) },
      { path: 'projects/time-tracking', element: LazyLoad(TimeTracking) },

      { path: 'reports/builder', element: LazyLoad(ReportBuilder) },
      { path: 'reports/scheduled', element: LazyLoad(ScheduledReports) },
      { path: 'reports/export', element: LazyLoad(ExportCenter) },

      { path: 'settings/company', element: LazyLoad(CompanySettings) },
      { path: 'settings/users', element: LazyLoad(UsersRoles) },
      { path: 'settings/permissions', element: LazyLoad(PermissionsPage) },
      { path: 'settings/workflows', element: LazyLoad(WorkflowsPage) },
      { path: 'settings/templates', element: LazyLoad(TemplatesPage) },
      { path: 'settings/integrations', element: LazyLoad(IntegrationsPage) },
      { path: 'settings/localization', element: LazyLoad(LocalizationPage) },

      { path: 'admin/audit-logs', element: LazyLoad(AuditLogs) },
      { path: 'admin/activity-logs', element: LazyLoad(ActivityLogs) },
      { path: 'admin/backup', element: LazyLoad(BackupPage) },
      { path: 'admin/queue', element: LazyLoad(QueueMonitor) },
      { path: 'admin/health', element: LazyLoad(HealthCheck) },
      { path: 'admin/api-docs', element: LazyLoad(ApiDocs) },
    ],
  },
  {
    path: '*',
    element: LazyLoad(NotFound),
  },
];
