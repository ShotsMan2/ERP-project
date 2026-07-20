import { Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/data/DataTable';

const data = [
  { id: '1', number: 'SO-2026-001', customer: 'ABC Corporation', date: '2026-07-18', total: 15900.00, status: 'confirmed' },
  { id: '2', number: 'SO-2026-002', customer: 'XYZ Industries', date: '2026-07-19', total: 4500.00, status: 'pending' },
  { id: '3', number: 'SO-2026-003', customer: 'LocalShop Inc', date: '2026-07-20', total: 890.00, status: 'shipped' },
  { id: '4', number: 'SO-2026-004', customer: 'ABC Corporation', date: '2026-07-20', total: 22300.00, status: 'draft' },
];

const columns = [
  { title: 'Order #', dataIndex: 'number', key: 'number' },
  { title: 'Customer', dataIndex: 'customer', key: 'customer' },
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Total', dataIndex: 'total', key: 'total', render: (v: number) => `$${v.toLocaleString()}`, sorter: (a: any, b: any) => a.total - b.total },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => {
    const colors: Record<string, string> = { draft: 'default', pending: 'orange', confirmed: 'blue', shipped: 'purple', delivered: 'green', cancelled: 'red' };
    return <Tag color={colors[s] || 'default'}>{s}</Tag>;
  }},
];

export default function SalesOrderList() {
  return (
    <div>
      <PageHeader title="Sales Orders" subtitle="Manage customer orders" onAdd={() => {}} addLabel="New Order" />
      <DataTable columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
}
