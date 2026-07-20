import { Card, Table, Tag, Progress } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', product: 'Laptop Pro 15', warehouse: 'Main Warehouse', bin: 'A-01', quantity: 45, reserved: 5, available: 40, maxStock: 100 },
  { key: '2', product: 'Office Desk', warehouse: 'Main Warehouse', bin: 'B-03', quantity: 12, reserved: 2, available: 10, maxStock: 50 },
  { key: '3', product: 'Wireless Mouse', warehouse: 'Secondary WH', bin: 'C-01', quantity: 150, reserved: 20, available: 130, maxStock: 200 },
];

const columns = [
  { title: 'Product', dataIndex: 'product', key: 'product' },
  { title: 'Warehouse', dataIndex: 'warehouse', key: 'warehouse' },
  { title: 'Bin', dataIndex: 'bin', key: 'bin' },
  { title: 'On Hand', dataIndex: 'quantity', key: 'quantity' },
  { title: 'Reserved', dataIndex: 'reserved', key: 'reserved' },
  { title: 'Available', dataIndex: 'available', key: 'available', render: (v: number) => <span className="text-success font-bold">{v}</span> },
  {
    title: 'Utilization',
    key: 'utilization',
    render: (_: any, r: any) => <Progress percent={Math.round((r.quantity / r.maxStock) * 100)} size="small" />,
  },
];

export default function StockPage() {
  return (
    <div>
      <PageHeader title="Stock Levels" subtitle="Monitor inventory levels" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
