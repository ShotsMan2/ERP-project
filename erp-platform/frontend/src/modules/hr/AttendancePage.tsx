import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', employee: 'John Doe', date: '2026-07-20', clockIn: '08:15', clockOut: '17:30', hours: '8.25', status: 'present' },
  { key: '2', employee: 'Jane Smith', date: '2026-07-20', clockIn: '08:30', clockOut: '17:00', hours: '7.5', status: 'present' },
  { key: '3', employee: 'Bob Wilson', date: '2026-07-20', clockIn: '-', clockOut: '-', hours: '0', status: 'absent' },
];

const columns = [
  { title: 'Employee', dataIndex: 'employee', key: 'employee' },
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Clock In', dataIndex: 'clockIn', key: 'clockIn' },
  { title: 'Clock Out', dataIndex: 'clockOut', key: 'clockOut' },
  { title: 'Hours', dataIndex: 'hours', key: 'hours' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'present' ? 'green' : 'red'}>{s}</Tag> },
];

export default function AttendancePage() {
  return (
    <div>
      <PageHeader title="Attendance" subtitle="Track employee attendance" />
      <Card><Table columns={columns} dataSource={data} pagination={false} /></Card>
    </div>
  );
}
