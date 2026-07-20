import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', user: 'john@company.com', action: 'Viewed employee list', module: 'HR', timestamp: '2026-07-20 14:35:00', duration: '2s' },
  { key: '2', user: 'jane@company.com', action: 'Downloaded report', module: 'Reports', timestamp: '2026-07-20 14:30:00', duration: '5s' },
  { key: '3', user: 'bob@company.com', action: 'Updated product price', module: 'Inventory', timestamp: '2026-07-20 14:25:00', duration: '3s' },
  { key: '4', user: 'alice@company.com', action: 'Approved leave request', module: 'HR', timestamp: '2026-07-20 14:20:00', duration: '1s' },
];

const columns = [
  { title: 'User', dataIndex: 'user', key: 'user' },
  { title: 'Action', dataIndex: 'action', key: 'action' },
  { title: 'Module', dataIndex: 'module', key: 'module', render: (m: string) => <Tag color="blue">{m}</Tag> },
  { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
  { title: 'Duration', dataIndex: 'duration', key: 'duration' },
];

export default function ActivityLogs() {
  return (
    <div>
      <PageHeader title="Activity Logs" subtitle="User activity timeline" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
