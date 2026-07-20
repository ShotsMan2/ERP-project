import { useLocation, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const routeLabels: Record<string, string> = {
  'dashboard': 'Dashboard',
  'executive': 'Executive Dashboard',
  'my': 'My Dashboard',
  'analytics': 'Analytics',
  'hr': 'Human Resources',
  'employees': 'Employees',
  'attendance': 'Attendance',
  'leaves': 'Leaves',
  'payroll': 'Payroll',
  'recruitment': 'Recruitment',
  'performance': 'Performance',
  'inventory': 'Inventory & Warehouse',
  'products': 'Products',
  'stock': 'Stock',
  'warehouses': 'Warehouses',
  'transfers': 'Transfers',
  'procurement': 'Procurement',
  'purchase-orders': 'Purchase Orders',
  'suppliers': 'Suppliers',
  'rfqs': 'RFQs',
  'sales': 'Sales & CRM',
  'crm': 'CRM',
  'customers': 'Customers',
  'orders': 'Sales Orders',
  'accounting': 'Accounting & Finance',
  'chart-of-accounts': 'Chart of Accounts',
  'journals': 'Journals',
  'invoices': 'Invoices',
  'payments': 'Payments',
  'bank': 'Bank',
  'taxes': 'Taxes',
  'budgets': 'Budgets',
  'reports': 'Reports',
  'projects': 'Projects',
  'tasks': 'Tasks',
  'gantt': 'Gantt Chart',
  'time-tracking': 'Time Tracking',
  'builder': 'Report Builder',
  'scheduled': 'Scheduled Reports',
  'export': 'Export Center',
  'settings': 'Settings',
  'company': 'Company Settings',
  'users': 'Users & Roles',
  'permissions': 'Permissions',
  'workflows': 'Workflows',
  'templates': 'Templates',
  'integrations': 'Integrations',
  'localization': 'Localization',
  'admin': 'System Administration',
  'audit-logs': 'Audit Logs',
  'activity-logs': 'Activity Logs',
  'backup': 'Backup & Restore',
  'queue': 'Queue Monitor',
  'health': 'Health Check',
  'api-docs': 'API Docs',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  const items = [
    {
      title: (
        <Link to="/">
          <HomeOutlined className="mr-1" />
          Home
        </Link>
      ),
    },
    ...pathnames.map((value, index) => {
      const url = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = routeLabels[value] || value.charAt(0).toUpperCase() + value.slice(1);
      const isLast = index === pathnames.length - 1;
      return {
        title: isLast ? label : <Link to={url}>{label}</Link>,
      };
    }),
  ];

  return <Breadcrumb items={items} className="mb-0" />;
}
