import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Rate, Select, Typography, message } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

interface PerformanceReview {
  id: string;
  employee: string;
  department: string;
  reviewer: string;
  period: string;
  rating: number;
  status: 'draft' | 'completed' | 'acknowledged' | 'cancelled';
  completedAt: string;
}

const mockReviews: PerformanceReview[] = [
  { id: 'PR001', employee: 'John Smith', department: 'Engineering', reviewer: 'Alice Johnson', period: 'Q4 2024', rating: 4.5, status: 'completed', completedAt: '2024-12-15' },
  { id: 'PR002', employee: 'Sarah Johnson', department: 'Marketing', reviewer: 'Bob Williams', period: 'Q4 2024', rating: 4.0, status: 'completed', completedAt: '2024-12-14' },
  { id: 'PR003', employee: 'Mike Brown', department: 'Finance', reviewer: 'Carol Martinez', period: 'Q4 2024', rating: 3.5, status: 'draft', completedAt: '-' },
  { id: 'PR004', employee: 'Emily Davis', department: 'HR', reviewer: 'David Lee', period: 'Q3 2024', rating: 4.5, status: 'acknowledged', completedAt: '2024-10-01' },
  { id: 'PR005', employee: 'James Wilson', department: 'Engineering', reviewer: 'Alice Johnson', period: 'Q3 2024', rating: 5.0, status: 'acknowledged', completedAt: '2024-09-28' },
  { id: 'PR006', employee: 'Anna Taylor', department: 'Sales', reviewer: 'Bob Williams', period: 'Q2 2024', rating: 3.0, status: 'completed', completedAt: '2024-07-15' },
];

const statusColors: Record<string, string> = {
  draft: 'default', completed: 'green', acknowledged: 'blue', cancelled: 'red',
};

const PerformanceList: React.FC = () => {
  const [period, setPeriod] = useState<string>('');

  const periods = [...new Set(mockReviews.map((r) => r.period))];
  const filtered = period ? mockReviews.filter((r) => r.period === period) : mockReviews;

  const columns = [
    { title: 'Employee', dataIndex: 'employee', key: 'employee', sorter: (a: PerformanceReview, b: PerformanceReview) => a.employee.localeCompare(b.employee) },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Reviewer', dataIndex: 'reviewer', key: 'reviewer' },
    { title: 'Period', dataIndex: 'period', key: 'period', sorter: (a: PerformanceReview, b: PerformanceReview) => b.period.localeCompare(a.period) },
    {
      title: 'Rating', dataIndex: 'rating', key: 'rating',
      render: (r: number) => <Rate disabled allowHalf value={r} />,
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (s: string) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag>,
    },
    {
      title: 'Actions', key: 'actions',
      render: (_: unknown, record: PerformanceReview) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} />
          {record.status === 'draft' && <Button type="link" size="small" icon={<EditOutlined />} />}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Performance Reviews" subtitle="Employee performance evaluations">
        <Space>
          <Select
            placeholder="Filter by period"
            value={period || undefined}
            onChange={(v) => setPeriod(v || '')}
            allowClear
            className="w-40"
            options={periods.map((p) => ({ value: p, label: p }))}
          />
          <Button type="primary">New Review</Button>
        </Space>
      </PageHeader>

      <Card>
        <DataTable
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (t: number) => `${t} reviews` }}
        />
      </Card>
    </div>
  );
};

export default PerformanceList;
