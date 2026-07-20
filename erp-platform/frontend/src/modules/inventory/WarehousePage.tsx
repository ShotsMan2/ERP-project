import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', name: 'Main Warehouse', code: 'WH-001', type: 'Finished Goods', location: 'Building A', capacity: '80%', status: 'active' },
  { key: '2', name: 'Secondary Warehouse', code: 'WH-002', type: 'Raw Materials', location: 'Building B', capacity: '45%', status: 'active' },
  { key: '3', name: 'Cold Storage', code: 'WH-003', type: 'Perishables', location: 'Building C', capacity: '60%', status: 'active' },
];

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Code', dataIndex: 'code', key: 'code' },
  { title: 'Type', dataIndex: 'type', key: 'type' },
  { title: 'Location', dataIndex: 'location', key: 'location' },
  { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color="green">{s}</Tag> },
];

export default function WarehousePage() {
  return (
    <div>
      <PageHeader title="Warehouses" subtitle="Manage warehouse locations" onAdd={() => {}} addLabel="Add Warehouse" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
