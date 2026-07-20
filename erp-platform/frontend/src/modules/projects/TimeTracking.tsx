import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', employee: 'John Doe', task: 'Design database schema', date: '2026-07-20', hours: 4.5, billable: true, description: 'Designed initial schema' },
  { key: '2', employee: 'Jane Smith', task: 'Setup CI/CD', date: '2026-07-20', hours: 3.0, billable: false, description: 'Configured GitHub Actions' },
  { key: '3', employee: 'Bob Wilson', task: 'API development', date: '2026-07-19', hours: 7.0, billable: true, description: 'Created user endpoints' },
];

const columns = [
  { title: 'Employee', dataIndex: 'employee', key: 'employee' },
  { title: 'Task', dataIndex: 'task', key: 'task' },
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Hours', dataIndex: 'hours', key: 'hours' },
  { title: 'Billable', dataIndex: 'billable', key: 'billable', render: (b: boolean) => <Tag color={b ? 'green' : 'default'}>{b ? 'Yes' : 'No'}</Tag> },
  { title: 'Description', dataIndex: 'description', key: 'description' },
];

export default function TimeTracking() {
  return (
    <div>
      <PageHeader title="Time Tracking" subtitle="Log and manage working hours" onAdd={() => {}} addLabel="Log Time" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
