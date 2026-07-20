import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', employee: 'John Doe', type: 'Annual Leave', startDate: '2026-08-01', endDate: '2026-08-10', days: 10, status: 'approved' },
  { key: '2', employee: 'Jane Smith', type: 'Sick Leave', startDate: '2026-07-22', endDate: '2026-07-23', days: 2, status: 'pending' },
  { key: '3', employee: 'Bob Wilson', type: 'Personal Leave', startDate: '2026-08-05', endDate: '2026-08-05', days: 1, status: 'pending' },
];

const columns = [
  { title: 'Employee', dataIndex: 'employee', key: 'employee' },
  { title: 'Type', dataIndex: 'type', key: 'type' },
  { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
  { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
  { title: 'Days', dataIndex: 'days', key: 'days' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'approved' ? 'green' : s === 'pending' ? 'orange' : 'red'}>{s}</Tag> },
];

export default function LeavePage() {
  return (
    <div>
      <PageHeader title="Leave Management" subtitle="Manage employee leaves" onAdd={() => {}} addLabel="New Leave Request" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
