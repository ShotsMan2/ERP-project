import { Card, Table, Tag, Rate } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', employee: 'John Doe', reviewer: 'Sarah Johnson', period: 'Q2 2026', rating: 4.5, status: 'completed' },
  { key: '2', employee: 'Jane Smith', reviewer: 'Mark Taylor', period: 'Q2 2026', rating: 3.8, status: 'completed' },
  { key: '3', employee: 'Bob Wilson', reviewer: 'Sarah Johnson', period: 'Q3 2026', rating: 0, status: 'pending' },
];

const columns = [
  { title: 'Employee', dataIndex: 'employee', key: 'employee' },
  { title: 'Reviewer', dataIndex: 'reviewer', key: 'reviewer' },
  { title: 'Period', dataIndex: 'period', key: 'period' },
  { title: 'Rating', dataIndex: 'rating', key: 'rating', render: (r: number) => r > 0 ? <Rate disabled value={r} allowHalf /> : '-' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'completed' ? 'green' : 'orange'}>{s}</Tag> },
];

export default function PerformancePage() {
  return (
    <div>
      <PageHeader title="Performance Reviews" subtitle="Employee performance evaluations" onAdd={() => {}} addLabel="New Review" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
