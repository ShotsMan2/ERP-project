import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', name: 'Sales Report Q2 2026', format: 'PDF', generatedAt: '2026-07-20', size: '2.5 MB', status: 'ready' },
  { key: '2', name: 'Inventory Snapshot', format: 'Excel', generatedAt: '2026-07-19', size: '1.2 MB', status: 'ready' },
  { key: '3', name: 'Employee List Export', format: 'CSV', generatedAt: '2026-07-18', size: '0.5 MB', status: 'ready' },
  { key: '4', name: 'Annual Financial Report', format: 'PDF', generatedAt: '2026-07-17', size: '5.8 MB', status: 'generating' },
];

const columns = [
  { title: 'Report', dataIndex: 'name', key: 'name' },
  { title: 'Format', dataIndex: 'format', key: 'format' },
  { title: 'Generated', dataIndex: 'generatedAt', key: 'generatedAt' },
  { title: 'Size', dataIndex: 'size', key: 'size' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'ready' ? 'green' : 'orange'}>{s}</Tag> },
];

export default function ExportCenter() {
  return (
    <div>
      <PageHeader title="Export Center" subtitle="Download exported reports" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
