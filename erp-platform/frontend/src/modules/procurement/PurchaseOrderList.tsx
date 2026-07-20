import { Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/data/DataTable';

const data = [
  { id: '1', number: 'PO-2026-001', supplier: 'Tech Supplies Inc.', date: '2026-07-15', total: 12500.00, status: 'approved' },
  { id: '2', number: 'PO-2026-002', supplier: 'Office Mart Ltd.', date: '2026-07-16', total: 3400.50, status: 'pending' },
  { id: '3', number: 'PO-2026-003', supplier: 'Global Parts Co.', date: '2026-07-18', total: 8900.00, status: 'draft' },
  { id: '4', number: 'PO-2026-004', supplier: 'Tech Supplies Inc.', date: '2026-07-19', total: 2200.00, status: 'delivered' },
];

const columns = [
  { title: 'PO Number', dataIndex: 'number', key: 'number' },
  { title: 'Supplier', dataIndex: 'supplier', key: 'supplier' },
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Total', dataIndex: 'total', key: 'total', render: (v: number) => `$${v.toLocaleString()}`, sorter: (a: any, b: any) => a.total - b.total },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => {
    const colors: Record<string, string> = { draft: 'default', pending: 'orange', approved: 'blue', sent: 'purple', delivered: 'green', cancelled: 'red' };
    return <Tag color={colors[s] || 'default'}>{s}</Tag>;
  }},
];

export default function PurchaseOrderList() {
  return (
    <div>
      <PageHeader title="Purchase Orders" subtitle="Manage procurement orders" onAdd={() => {}} addLabel="New PO" />
      <DataTable columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
}
