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

const PREFIX = '/app';

const getMenuItems = (t: any) => [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: t('nav.dashboard'),
    children: [
      { key: `${PREFIX}/dashboard/executive`, label: t('nav.executiveDashboard') },
      { key: `${PREFIX}/dashboard/my`, label: t('nav.myDashboard') },
      { key: `${PREFIX}/dashboard/analytics`, label: t('nav.analytics') },
    ],
  },
  {
    key: 'hr',
    icon: <TeamOutlined />,
    label: t('nav.humanResources'),
    children: [
      { key: `${PREFIX}/hr/employees`, label: t('nav.employees') },
      { key: `${PREFIX}/hr/attendance`, label: t('nav.attendance') },
      { key: `${PREFIX}/hr/leaves`, label: t('nav.leaves') },
      { key: `${PREFIX}/hr/payroll`, label: t('nav.payroll') },
      { key: `${PREFIX}/hr/recruitment`, label: t('nav.recruitment') },
      { key: `${PREFIX}/hr/performance`, label: t('nav.performance') },
    ],
  },
  {
    key: 'inventory',
    icon: <ShoppingCartOutlined />,
    label: t('nav.inventoryWarehouse'),
    children: [
      { key: `${PREFIX}/inventory/products`, label: t('nav.products') },
      { key: `${PREFIX}/inventory/stock`, label: t('nav.stock') },
      { key: `${PREFIX}/inventory/warehouses`, label: t('nav.warehouses') },
      { key: `${PREFIX}/inventory/transfers`, label: t('nav.transfers') },
    ],
  },
  {
    key: 'procurement',
    icon: <ShoppingOutlined />,
    label: t('nav.procurement'),
    children: [
      { key: `${PREFIX}/procurement/purchase-orders`, label: t('nav.purchaseOrders') },
      { key: `${PREFIX}/procurement/suppliers`, label: t('nav.suppliers') },
      { key: `${PREFIX}/procurement/rfqs`, label: t('nav.rfqs') },
    ],
  },
  {
    key: 'sales',
    icon: <DollarOutlined />,
    label: t('nav.salesCRM'),
    children: [
      { key: `${PREFIX}/sales/crm`, label: t('nav.crm') },
      { key: `${PREFIX}/sales/customers`, label: t('nav.customers') },
      { key: `${PREFIX}/sales/orders`, label: t('nav.salesOrders') },
    ],
  },
  {
    key: 'accounting',
    icon: <DollarOutlined />,
    label: t('nav.accountingFinance'),
    children: [
      { key: `${PREFIX}/accounting/chart-of-accounts`, label: t('nav.chartOfAccounts') },
      { key: `${PREFIX}/accounting/journals`, label: t('nav.journals') },
      { key: `${PREFIX}/accounting/invoices`, label: t('nav.invoices') },
      { key: `${PREFIX}/accounting/payments`, label: t('nav.payments') },
      { key: `${PREFIX}/accounting/bank`, label: t('nav.bank') },
      { key: `${PREFIX}/accounting/taxes`, label: t('nav.taxes') },
      { key: `${PREFIX}/accounting/budgets`, label: t('nav.budgets') },
      { key: `${PREFIX}/accounting/reports`, label: t('nav.financialReports') },
    ],
  },
  {
    key: 'projects',
    icon: <ProjectOutlined />,
    label: t('nav.projects'),
    children: [
      { key: `${PREFIX}/projects`, label: t('nav.projects') },
      { key: `${PREFIX}/projects/tasks`, label: t('nav.tasks') },
      { key: `${PREFIX}/projects/gantt`, label: t('nav.ganttChart') },
      { key: `${PREFIX}/projects/time-tracking`, label: t('nav.timeTracking') },
    ],
  },
  {
    key: 'reports',
    icon: <BarChartOutlined />,
    label: t('nav.reportsAnalytics'),
    children: [
      { key: `${PREFIX}/reports/builder`, label: t('nav.reportBuilder') },
      { key: `${PREFIX}/reports/scheduled`, label: t('nav.scheduledReports') },
      { key: `${PREFIX}/reports/export`, label: t('nav.exportCenter') },
    ],
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: t('nav.settings'),
    children: [
      { key: `${PREFIX}/settings/company`, label: t('nav.companySettings') },
      { key: `${PREFIX}/settings/users`, label: t('nav.usersRoles') },
      { key: `${PREFIX}/settings/permissions`, label: t('nav.permissions') },
      { key: `${PREFIX}/settings/workflows`, label: t('nav.workflows') },
      { key: `${PREFIX}/settings/templates`, label: t('nav.templates') },
      { key: `${PREFIX}/settings/integrations`, label: t('nav.integrations') },
      { key: `${PREFIX}/settings/localization`, label: t('nav.localization') },
    ],
  },
  {
    key: 'admin',
    icon: <SafetyCertificateOutlined />,
    label: t('nav.systemAdmin'),
    children: [
      { key: `${PREFIX}/admin/audit-logs`, label: t('nav.auditLogs') },
      { key: `${PREFIX}/admin/activity-logs`, label: t('nav.activityLogs') },
      { key: `${PREFIX}/admin/backup`, label: t('nav.backupRestore') },
      { key: `${PREFIX}/admin/queue`, label: t('nav.queueMonitor') },
      { key: `${PREFIX}/admin/health`, label: t('nav.healthCheck') },
      { key: `${PREFIX}/admin/api-docs`, label: t('nav.apiDocs') },
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
