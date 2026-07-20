import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', product: 'Laptop Pro 15', from: 'Main Warehouse', to: 'Secondary WH', quantity: 10, date: '2026-07-19', status: 'completed' },
  { key: '2', product: 'Office Desk', from: 'Secondary WH', to: 'Main Warehouse', quantity: 5, date: '2026-07-18', status: 'in_transit' },
  { key: '3', product: 'Wireless Mouse', from: 'Main Warehouse', to: 'Secondary WH', quantity: 50, date: '2026-07-20', status: 'pending' },
];

const columns = [
  { title: 'Product', dataIndex: 'product', key: 'product' },
  { title: 'From', dataIndex: 'from', key: 'from' },
  { title: 'To', dataIndex: 'to', key: 'to' },
  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'completed' ? 'green' : s === 'in_transit' ? 'blue' : 'orange'}>{s}</Tag> },
];

export default function TransferPage() {
  return (
    <div>
      <PageHeader title="Stock Transfers" subtitle="Inter-warehouse stock movements" onAdd={() => {}} addLabel="New Transfer" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
