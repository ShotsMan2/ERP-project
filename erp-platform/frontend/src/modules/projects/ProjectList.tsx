import { Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/data/DataTable';

const data = [
  { id: '1', name: 'ERP Implementation', code: 'PROJ-001', status: 'in_progress', priority: 'high', startDate: '2026-01-15', endDate: '2026-12-31', manager: 'John Doe', budget: 500000 },
  { id: '2', name: 'Website Redesign', code: 'PROJ-002', status: 'completed', priority: 'medium', startDate: '2026-03-01', endDate: '2026-06-30', manager: 'Jane Smith', budget: 80000 },
  { id: '3', name: 'Mobile App Development', code: 'PROJ-003', status: 'planning', priority: 'high', startDate: '2026-08-01', endDate: '2027-02-28', manager: 'Bob Wilson', budget: 200000 },
  { id: '4', name: 'Data Migration', code: 'PROJ-004', status: 'on_hold', priority: 'low', startDate: '2026-05-01', endDate: '2026-08-31', manager: 'Alice Brown', budget: 60000 },
];

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Code', dataIndex: 'code', key: 'code' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => {
    const colors: Record<string, string> = { planning: 'blue', in_progress: 'orange', completed: 'green', on_hold: 'default', cancelled: 'red' };
    return <Tag color={colors[s] || 'default'}>{s.replace('_', ' ')}</Tag>;
  }},
  { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (p: string) => <Tag color={p === 'high' ? 'red' : p === 'medium' ? 'orange' : 'blue'}>{p}</Tag> },
  { title: 'Manager', dataIndex: 'manager', key: 'manager' },
  { title: 'Start', dataIndex: 'startDate', key: 'startDate' },
  { title: 'End', dataIndex: 'endDate', key: 'endDate' },
  { title: 'Budget', dataIndex: 'budget', key: 'budget', render: (v: number) => '$' + v.toLocaleString() },
];

export default function ProjectList() {
  return (
    <div>
      <PageHeader title="Projects" subtitle="Manage projects" onAdd={() => {}} addLabel="New Project" />
      <DataTable columns={columns} dataSource={data} rowKey="id" searchable />
    </div>
  );
}
