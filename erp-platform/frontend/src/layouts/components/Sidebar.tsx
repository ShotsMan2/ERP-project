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

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    children: [
      { key: '/dashboard/executive', label: 'Executive Dashboard' },
      { key: '/dashboard/my', label: 'My Dashboard' },
      { key: '/dashboard/analytics', label: 'Analytics' },
    ],
  },
  {
    key: 'hr',
    icon: <TeamOutlined />,
    label: 'Human Resources',
    children: [
      { key: '/hr/employees', label: 'Employees' },
      { key: '/hr/attendance', label: 'Attendance' },
      { key: '/hr/leaves', label: 'Leaves' },
      { key: '/hr/payroll', label: 'Payroll' },
      { key: '/hr/recruitment', label: 'Recruitment' },
      { key: '/hr/performance', label: 'Performance' },
    ],
  },
  {
    key: 'inventory',
    icon: <ShoppingCartOutlined />,
    label: 'Inventory & Warehouse',
    children: [
      { key: '/inventory/products', label: 'Products' },
      { key: '/inventory/stock', label: 'Stock' },
      { key: '/inventory/warehouses', label: 'Warehouses' },
      { key: '/inventory/transfers', label: 'Transfers' },
    ],
  },
  {
    key: 'procurement',
    icon: <ShoppingOutlined />,
    label: 'Procurement',
    children: [
      { key: '/procurement/purchase-orders', label: 'Purchase Orders' },
      { key: '/procurement/suppliers', label: 'Suppliers' },
      { key: '/procurement/rfqs', label: 'RFQs' },
    ],
  },
  {
    key: 'sales',
    icon: <DollarOutlined />,
    label: 'Sales & CRM',
    children: [
      { key: '/sales/crm', label: 'CRM' },
      { key: '/sales/customers', label: 'Customers' },
      { key: '/sales/orders', label: 'Sales Orders' },
    ],
  },
  {
    key: 'accounting',
    icon: <DollarOutlined />,
    label: 'Accounting & Finance',
    children: [
      { key: '/accounting/chart-of-accounts', label: 'Chart of Accounts' },
      { key: '/accounting/journals', label: 'Journals' },
      { key: '/accounting/invoices', label: 'Invoices' },
      { key: '/accounting/payments', label: 'Payments' },
      { key: '/accounting/bank', label: 'Bank' },
      { key: '/accounting/taxes', label: 'Taxes' },
      { key: '/accounting/budgets', label: 'Budgets' },
      { key: '/accounting/reports', label: 'Financial Reports' },
    ],
  },
  {
    key: 'projects',
    icon: <ProjectOutlined />,
    label: 'Projects',
    children: [
      { key: '/projects', label: 'Projects' },
      { key: '/projects/tasks', label: 'Tasks' },
      { key: '/projects/gantt', label: 'Gantt Chart' },
      { key: '/projects/time-tracking', label: 'Time Tracking' },
    ],
  },
  {
    key: 'reports',
    icon: <BarChartOutlined />,
    label: 'Reports & Analytics',
    children: [
      { key: '/reports/builder', label: 'Report Builder' },
      { key: '/reports/scheduled', label: 'Scheduled Reports' },
      { key: '/reports/export', label: 'Export Center' },
    ],
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings',
    children: [
      { key: '/settings/company', label: 'Company Settings' },
      { key: '/settings/users', label: 'Users & Roles' },
      { key: '/settings/permissions', label: 'Permissions' },
      { key: '/settings/workflows', label: 'Workflows' },
      { key: '/settings/templates', label: 'Templates' },
      { key: '/settings/integrations', label: 'Integrations' },
      { key: '/settings/localization', label: 'Localization' },
    ],
  },
  {
    key: 'admin',
    icon: <SafetyCertificateOutlined />,
    label: 'System Administration',
    children: [
      { key: '/admin/audit-logs', label: 'Audit Logs' },
      { key: '/admin/activity-logs', label: 'Activity Logs' },
      { key: '/admin/backup', label: 'Backup & Restore' },
      { key: '/admin/queue', label: 'Queue Monitor' },
      { key: '/admin/health', label: 'Health Check' },
      { key: '/admin/api-docs', label: 'API Docs' },
    ],
  },
];

export default function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

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
      className="border-r border-gray-200"
      width={240}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
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
