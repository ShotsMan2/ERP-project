import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Typography, Avatar } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

interface Task { id: string; title: string; project: string; assignee: string; priority: string; status: string; dueDate: string; estimatedHours: number; }
const mockTasks: Task[] = [
  { id: 't1', title: 'Database schema design', project: 'ERP Implementation', assignee: 'John Smith', priority: 'High', status: 'done', dueDate: '2024-10-15', estimatedHours: 40 },
  { id: 't2', title: 'API development', project: 'ERP Implementation', assignee: 'John Smith', priority: 'High', status: 'in_progress', dueDate: '2024-12-30', estimatedHours: 120 },
  { id: 't3', title: 'Frontend dashboard', project: 'ERP Implementation', assignee: 'Emily Davis', priority: 'Medium', status: 'in_progress', dueDate: '2025-01-15', estimatedHours: 80 },
  { id: 't4', title: 'User research', project: 'Mobile App Dev', assignee: 'Emily Davis', priority: 'Medium', status: 'todo', dueDate: '2025-02-01', estimatedHours: 30 },
  { id: 't5', title: 'App wireframing', project: 'Mobile App Dev', assignee: 'Emily Davis', priority: 'High', status: 'todo', dueDate: '2025-02-15', estimatedHours: 40 },
  { id: 't6', title: 'Cloud infrastructure setup', project: 'Cloud Migration', assignee: 'James Wilson', priority: 'Critical', status: 'done', dueDate: '2024-08-15', estimatedHours: 60 },
];

const statusColors: Record<string, string> = { todo: 'default', in_progress: 'blue', done: 'green', review: 'purple' };
const priorityColors: Record<string, string> = { Low: 'default', Medium: 'blue', High: 'orange', Critical: 'red' };

const TaskList: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const filtered = statusFilter ? mockTasks.filter((t) => t.status === statusFilter) : mockTasks;

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Project', dataIndex: 'project', key: 'project' },
    { title: 'Assignee', dataIndex: 'assignee', key: 'assignee', render: (a: string) => <Space><Avatar icon={<UserOutlined />} size="small" /><Text>{a}</Text></Space> },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (p: string) => <Tag color={priorityColors[p]}>{p}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s.replace('_', ' ')}</Tag> },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
    { title: 'Est. Hours', dataIndex: 'estimatedHours', key: 'estimatedHours' },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Tasks" subtitle="All project tasks">
        <Space>
          <Select placeholder="Filter by status" value={statusFilter || undefined} onChange={(v) => setStatusFilter(v || '')} allowClear className="w-40"
            options={[{ value: 'todo', label: 'To Do' }, { value: 'in_progress', label: 'In Progress' }, { value: 'review', label: 'Review' }, { value: 'done', label: 'Done' }]} />
          <Button type="primary" icon={<PlusOutlined />}>New Task</Button>
        </Space>
      </PageHeader>
      <Card><DataTable dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (t: number) => t + ' tasks' }} /></Card>
    </div>
  );
};
export default TaskList;
