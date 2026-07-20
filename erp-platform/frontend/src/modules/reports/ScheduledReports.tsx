import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', name: 'Weekly Sales Report', frequency: 'Weekly', lastRun: '2026-07-18', nextRun: '2026-07-25', status: 'active' },
  { key: '2', name: 'Monthly Financial Summary', frequency: 'Monthly', lastRun: '2026-07-01', nextRun: '2026-08-01', status: 'active' },
  { key: '3', name: 'Inventory Status Report', frequency: 'Daily', lastRun: '2026-07-20', nextRun: '2026-07-21', status: 'active' },
];

const columns = [
  { title: 'Report Name', dataIndex: 'name', key: 'name' },
  { title: 'Frequency', dataIndex: 'frequency', key: 'frequency' },
  { title: 'Last Run', dataIndex: 'lastRun', key: 'lastRun' },
  { title: 'Next Run', dataIndex: 'nextRun', key: 'nextRun' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color="green">{s}</Tag> },
];

export default function ScheduledReports() {
  return (
    <div>
      <PageHeader title="Scheduled Reports" subtitle="Manage automated report delivery" onAdd={() => {}} addLabel="Schedule Report" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
