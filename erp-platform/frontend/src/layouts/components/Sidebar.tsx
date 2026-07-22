import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  DollarOutlined,
  ProjectOutlined,
  BarChartOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useUIStore } from '@/store/uiStore';
import { useTranslation } from 'react-i18next';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  className?: string;
}

const getMenuItems = (t: any) => [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: t('nav.dashboard'),
    children: [
      { key: '/dashboard/executive', label: t('nav.executiveDashboard') },
      { key: '/dashboard/my', label: t('nav.myDashboard') },
      { key: '/dashboard/analytics', label: t('nav.analytics') },
    ],
  },
  {
    key: 'hr',
    icon: <TeamOutlined />,
    label: t('nav.humanResources'),
    children: [
      { key: '/hr/employees', label: t('nav.employees') },
      { key: '/hr/attendance', label: t('nav.attendance') },
      { key: '/hr/leaves', label: t('nav.leaves') },
      { key: '/hr/payroll', label: t('nav.payroll') },
      { key: '/hr/recruitment', label: t('nav.recruitment') },
      { key: '/hr/performance', label: t('nav.performance') },
    ],
  },
  {
    key: 'inventory',
    icon: <ShoppingCartOutlined />,
    label: t('nav.inventoryWarehouse'),
    children: [
      { key: '/inventory/products', label: t('nav.products') },
      { key: '/inventory/stock', label: t('nav.stock') },
      { key: '/inventory/warehouses', label: t('nav.warehouses') },
      { key: '/inventory/transfers', label: t('nav.transfers') },
    ],
  },
  {
    key: 'procurement',
    icon: <ShoppingOutlined />,
    label: t('nav.procurement'),
    children: [
      { key: '/procurement/purchase-orders', label: t('nav.purchaseOrders') },
      { key: '/procurement/suppliers', label: t('nav.suppliers') },
      { key: '/procurement/rfqs', label: t('nav.rfqs') },
    ],
  },
  {
    key: 'sales',
    icon: <DollarOutlined />,
    label: t('nav.salesCRM'),
    children: [
      { key: '/sales/crm', label: t('nav.crm') },
      { key: '/sales/customers', label: t('nav.customers') },
      { key: '/sales/orders', label: t('nav.salesOrders') },
    ],
  },
  {
    key: 'accounting',
    icon: <DollarOutlined />,
    label: t('nav.accountingFinance'),
    children: [
      { key: '/accounting/chart-of-accounts', label: t('nav.chartOfAccounts') },
      { key: '/accounting/journals', label: t('nav.journals') },
      { key: '/accounting/invoices', label: t('nav.invoices') },
      { key: '/accounting/payments', label: t('nav.payments') },
      { key: '/accounting/bank', label: t('nav.bank') },
      { key: '/accounting/taxes', label: t('nav.taxes') },
      { key: '/accounting/budgets', label: t('nav.budgets') },
      { key: '/accounting/reports', label: t('nav.financialReports') },
    ],
  },
  {
    key: 'projects',
    icon: <ProjectOutlined />,
    label: t('nav.projects'),
    children: [
      { key: '/projects', label: t('nav.projects') },
      { key: '/projects/tasks', label: t('nav.tasks') },
      { key: '/projects/gantt', label: t('nav.ganttChart') },
      { key: '/projects/time-tracking', label: t('nav.timeTracking') },
    ],
  },
  {
    key: 'reports',
    icon: <BarChartOutlined />,
    label: t('nav.reportsAnalytics'),
    children: [
      { key: '/reports/builder', label: t('nav.reportBuilder') },
      { key: '/reports/scheduled', label: t('nav.scheduledReports') },
      { key: '/reports/export', label: t('nav.exportCenter') },
    ],
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: t('nav.settings'),
    children: [
      { key: '/settings/company', label: t('nav.companySettings') },
      { key: '/settings/users', label: t('nav.usersRoles') },
      { key: '/settings/permissions', label: t('nav.permissions') },
      { key: '/settings/workflows', label: t('nav.workflows') },
      { key: '/settings/templates', label: t('nav.templates') },
      { key: '/settings/integrations', label: t('nav.integrations') },
      { key: '/settings/localization', label: t('nav.localization') },
    ],
  },
  {
    key: 'admin',
    icon: <SafetyCertificateOutlined />,
    label: t('nav.systemAdmin'),
    children: [
      { key: '/admin/audit-logs', label: t('nav.auditLogs') },
      { key: '/admin/activity-logs', label: t('nav.activityLogs') },
      { key: '/admin/backup', label: t('nav.backupRestore') },
      { key: '/admin/queue', label: t('nav.queueMonitor') },
      { key: '/admin/health', label: t('nav.healthCheck') },
      { key: '/admin/api-docs', label: t('nav.apiDocs') },
    ],
  },
];

export default function Sidebar({ collapsed, onCollapse, className = '' }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = getMenuItems(t);

  const findOpenKeys = () => {
    const path = location.pathname;
    for (const item of menuItems) {
      if (item.children?.some((child) => path.startsWith(child.key))) {
        return [item.key];
      }
    }
    return [];
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      className={`border-r border-gray-200/50 dark:border-slate-700/50 !bg-transparent ${className}`}
      width={240}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-slate-700">
        <img src="/logo.svg" alt="ERP" className="h-8" />
        {!collapsed && <span className="ml-2 text-lg font-bold">ERP Platform</span>}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={findOpenKeys()}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        className="border-r-0"
      />
    </Sider>
  );
}
