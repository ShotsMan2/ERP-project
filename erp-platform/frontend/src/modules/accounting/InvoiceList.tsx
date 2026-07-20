import { Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/data/DataTable';

const data = [
  { id: '1', number: 'INV-2026-001', customer: 'ABC Corporation', date: '2026-07-01', dueDate: '2026-07-31', total: 15900.00, status: 'unpaid' },
  { id: '2', number: 'INV-2026-002', customer: 'XYZ Industries', date: '2026-07-05', dueDate: '2026-08-04', total: 4500.00, status: 'paid' },
  { id: '3', number: 'INV-2026-003', customer: 'LocalShop Inc', date: '2026-06-15', dueDate: '2026-07-15', total: 890.00, status: 'overdue' },
  { id: '4', number: 'INV-2026-004', customer: 'GlobalTech Ltd', date: '2026-07-10', dueDate: '2026-08-09', total: 22300.00, status: 'partially_paid' },
];

const columns = [
  { title: 'Invoice #', dataIndex: 'number', key: 'number' },
  { title: 'Customer', dataIndex: 'customer', key: 'customer' },
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
  { title: 'Total', dataIndex: 'total', key: 'total', render: (v: number) => `$${v.toLocaleString()}` },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => {
    const colors: Record<string, string> = { paid: 'green', unpaid: 'orange', overdue: 'red', partially_paid: 'blue' };
    return <Tag color={colors[s] || 'default'}>{s.replace('_', ' ')}</Tag>;
  }},
];

export default function InvoiceList() {
  return (
    <div>
      <PageHeader title="Invoices" subtitle="Manage AR/AP invoices" onAdd={() => {}} addLabel="New Invoice" />
      <DataTable columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
}
