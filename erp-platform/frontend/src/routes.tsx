import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { Loading } from './components/ui/Loading';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import PortalLayout from './layouts/PortalLayout';

const LazyLoad = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <ErrorBoundary>
    <Suspense fallback={<Loading type="page" />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

const LoginPage = lazy(() => import('./modules/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./modules/auth/ForgotPasswordPage'));
const MFAPage = lazy(() => import('./modules/auth/MFAPage'));

const ExecutiveDashboard = lazy(() => import('./modules/dashboard/ExecutiveDashboard'));
const MyDashboard = lazy(() => import('./modules/dashboard/MyDashboard'));
const AnalyticsPage = lazy(() => import('./modules/dashboard/AnalyticsPage'));

const EmployeeList = lazy(() => import('./modules/hr/EmployeeList'));
const EmployeeDetail = lazy(() => import('./modules/hr/EmployeeDetail'));
const AttendancePage = lazy(() => import('./modules/hr/AttendancePage'));
const LeavePage = lazy(() => import('./modules/hr/LeavePage'));
const PayrollPage = lazy(() => import('./modules/hr/PayrollPage'));
const RecruitmentPage = lazy(() => import('./modules/hr/RecruitmentPage'));
const PerformancePage = lazy(() => import('./modules/hr/PerformancePage'));

const ProductList = lazy(() => import('./modules/inventory/ProductList'));
const StockPage = lazy(() => import('./modules/inventory/StockPage'));
const WarehousePage = lazy(() => import('./modules/inventory/WarehousePage'));
const TransferPage = lazy(() => import('./modules/inventory/TransferPage'));

const PurchaseOrderList = lazy(() => import('./modules/procurement/PurchaseOrderList'));
const SupplierList = lazy(() => import('./modules/procurement/SupplierList'));
const RFQPage = lazy(() => import('./modules/procurement/RFQPage'));

const CRMPage = lazy(() => import('./modules/sales/CRMPage'));
const CustomerList = lazy(() => import('./modules/sales/CustomerList'));
const SalesOrderList = lazy(() => import('./modules/sales/SalesOrderList'));

const ChartOfAccounts = lazy(() => import('./modules/accounting/ChartOfAccounts'));
const JournalPage = lazy(() => import('./modules/accounting/JournalPage'));
const InvoiceList = lazy(() => import('./modules/accounting/InvoiceList'));
const PaymentPage = lazy(() => import('./modules/accounting/PaymentPage'));
const BankPage = lazy(() => import('./modules/accounting/BankPage'));
const TaxPage = lazy(() => import('./modules/accounting/TaxPage'));
const BudgetPage = lazy(() => import('./modules/accounting/BudgetPage'));
const FinancialReports = lazy(() => import('./modules/accounting/FinancialReports'));

const ProjectList = lazy(() => import('./modules/projects/ProjectList'));
const TaskBoard = lazy(() => import('./modules/projects/TaskBoard'));
const GanttChart = lazy(() => import('./modules/projects/GanttChart'));
const TimeTracking = lazy(() => import('./modules/projects/TimeTracking'));

const ReportBuilder = lazy(() => import('./modules/reports/ReportBuilder'));
const ScheduledReports = lazy(() => import('./modules/reports/ScheduledReports'));
const ExportCenter = lazy(() => import('./modules/reports/ExportCenter'));

const CompanySettings = lazy(() => import('./modules/settings/CompanySettings'));
const UsersRoles = lazy(() => import('./modules/settings/UsersRoles'));
const PermissionsPage = lazy(() => import('./modules/settings/PermissionsPage'));
const WorkflowsPage = lazy(() => import('./modules/settings/WorkflowsPage'));
const TemplatesPage = lazy(() => import('./modules/settings/TemplatesPage'));
const IntegrationsPage = lazy(() => import('./modules/settings/IntegrationsPage'));
const LocalizationPage = lazy(() => import('./modules/settings/LocalizationPage'));

const AuditLogs = lazy(() => import('./modules/admin/AuditLogs'));
const ActivityLogs = lazy(() => import('./modules/admin/ActivityLogs'));
const BackupPage = lazy(() => import('./modules/admin/BackupPage'));
const QueueMonitor = lazy(() => import('./modules/admin/QueueMonitor'));
const HealthCheck = lazy(() => import('./modules/admin/HealthCheck'));
const ApiDocs = lazy(() => import('./modules/admin/ApiDocs'));

const CustomerPortal = lazy(() => import('./modules/portal/CustomerPortal'));
const SupplierPortal = lazy(() => import('./modules/portal/SupplierPortal'));

const NotFound = lazy(() => import('./modules/NotFound'));

export const routes: RouteObject[] = [
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: LazyLoad(LoginPage) },
      { path: 'forgot-password', element: LazyLoad(ForgotPasswordPage) },
      { path: 'mfa', element: LazyLoad(MFAPage) },
    ],
  },
  {
    path: '/portal',
    element: <PortalLayout />,
    children: [
      { index: true, element: LazyLoad(CustomerPortal) },
      { path: 'supplier', element: LazyLoad(SupplierPortal) },
    ],
  },
  {
    path: '/',
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
