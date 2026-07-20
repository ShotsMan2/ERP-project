import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', employee: 'John Doe', gross: 8500, deductions: 2100, net: 6400, period: '2026-06', status: 'paid' },
  { key: '2', employee: 'Jane Smith', gross: 7200, deductions: 1800, net: 5400, period: '2026-06', status: 'paid' },
  { key: '3', employee: 'Bob Wilson', gross: 5500, deductions: 1400, net: 4100, period: '2026-07', status: 'processing' },
];

const columns = [
  { title: 'Employee', dataIndex: 'employee', key: 'employee' },
  { title: 'Gross', dataIndex: 'gross', key: 'gross', render: (v: number) => `$${v.toLocaleString()}` },
  { title: 'Deductions', dataIndex: 'deductions', key: 'deductions', render: (v: number) => `$${v.toLocaleString()}` },
  { title: 'Net', dataIndex: 'net', key: 'net', render: (v: number) => `$${v.toLocaleString()}` },
  { title: 'Period', dataIndex: 'period', key: 'period' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'paid' ? 'green' : 'orange'}>{s}</Tag> },
];

export default function PayrollPage() {
  return (
    <div>
      <PageHeader title="Payroll" subtitle="Manage payroll runs and payslips" onAdd={() => {}} addLabel="New Payroll Run" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
