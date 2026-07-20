import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Progress } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';
interface Project { id: string; name: string; code: string; status: string; priority: string; startDate: string; endDate: string; progress: number; budget: number; manager: string; }
const mockProjects: Project[] = [
  { id: '1', name: 'ERP Implementation', code: 'PROJ-001', status: 'in_progress', priority: 'High', startDate: '2024-09-01', endDate: '2025-06-30', progress: 45, budget: 1500000, manager: 'Alice Johnson' },
  { id: '2', name: 'Mobile App Development', code: 'PROJ-002', status: 'planning', priority: 'Medium', startDate: '2025-01-15', endDate: '2025-08-30', progress: 10, budget: 500000, manager: 'Bob Williams' },
  { id: '3', name: 'Cloud Migration', code: 'PROJ-003', status: 'completed', priority: 'High', startDate: '2024-06-01', endDate: '2024-12-31', progress: 100, budget: 800000, manager: 'Carol Martinez' },
  { id: '4', name: 'Data Analytics Platform', code: 'PROJ-004', status: 'on_hold', priority: 'Low', startDate: '2024-10-01', endDate: '2025-03-31', progress: 20, budget: 350000, manager: 'David Lee' },
  { id: '5', name: 'Security Audit & Compliance', code: 'PROJ-005', status: 'in_progress', priority: 'Critical', startDate: '2024-11-01', endDate: '2025-02-28', progress: 60, budget: 200000, manager: 'Alice Johnson' },
];

const statusColors: Record<string, string> = { planning: 'default', in_progress: 'blue', completed: 'green', on_hold: 'orange', cancelled: 'red' };
const priorityColors: Record<string, string> = { Low: 'default', Medium: 'blue', High: 'orange', Critical: 'red' };

const ProjectList: React.FC = () => {
  const navigate = useNavigate();

  const columns = [
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Project Name', dataIndex: 'name', key: 'name', render: (v: string, r: Project) => <a onClick={() => navigate('/projects/' + r.id)}>{v}</a> },
    { title: 'Manager', dataIndex: 'manager', key: 'manager' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s.replace('_', ' ').toUpperCase()}</Tag> },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (p: string) => <Tag color={priorityColors[p]}>{p}</Tag> },
    { title: 'Progress', dataIndex: 'progress', key: 'progress', render: (p: number) => <Progress percent={p} size="small" status={p === 100 ? 'success' : undefined} /> },
    { title: 'Start', dataIndex: 'startDate', key: 'startDate' },
    { title: 'End', dataIndex: 'endDate', key: 'endDate' },
    { title: 'Budget', dataIndex: 'budget', key: 'budget', render: (v: number) => '$' + v.toLocaleString() },
    { title: 'Actions', key: 'actions', render: (_: unknown, r: Project) => (
      <Space><Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate('/projects/' + r.id)} /><Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate('/projects/' + r.id + '/edit')} /></Space>
    )},
  ];

  return (
    <div className="p-6">
      <PageHeader title="Projects" subtitle="Manage projects and tasks">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/projects/new')}>New Project</Button>
      </PageHeader>
      <Card><DataTable dataSource={mockProjects} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (t: number) => t + ' projects' }} /></Card>
    </div>
  );
};
export default ProjectList;
