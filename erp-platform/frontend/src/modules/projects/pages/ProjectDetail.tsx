import { useState } from 'react';
import { Card, Descriptions, Tag, Table, Tabs, Row, Col, Statistic, Typography, Progress, Space, Button, Avatar, List } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

const mockProject = { id: '1', name: 'ERP Implementation', code: 'PROJ-001', status: 'in_progress' as const, priority: 'High' as const, startDate: '2024-09-01', endDate: '2025-06-30', progress: 45, budget: 1500000, spent: 675000, manager: 'Alice Johnson', description: 'Company-wide ERP system implementation covering all modules.' };
const teamMembers = [
  { name: 'John Smith', role: 'Lead Developer', allocation: 100 }, { name: 'Emily Davis', role: 'UI/UX Designer', allocation: 50 }, { name: 'James Wilson', role: 'DevOps Engineer', allocation: 75 },
];
const projectTasks = [
  { id: 't1', title: 'Database schema design', assignee: 'John Smith', status: 'done', priority: 'High', dueDate: '2024-10-15' },
  { id: 't2', title: 'API development', assignee: 'John Smith', status: 'in_progress', priority: 'High', dueDate: '2024-12-30' },
  { id: 't3', title: 'Frontend dashboard', assignee: 'Emily Davis', status: 'in_progress', priority: 'Medium', dueDate: '2025-01-15' },
  { id: 't4', title: 'Testing & QA', assignee: 'James Wilson', status: 'todo', priority: 'Medium', dueDate: '2025-03-01' },
  { id: 't5', title: 'Deployment', assignee: 'James Wilson', status: 'todo', priority: 'High', dueDate: '2025-06-01' },
];

const ProjectDetail: React.FC = () => {
  const navigate = useNavigate();
  const statusColors: Record<string, string> = { todo: 'default', in_progress: 'blue', done: 'green' };
  const priorityColors: Record<string, string> = { Low: 'default', Medium: 'blue', High: 'orange', Critical: 'red' };

  return (
    <div className="p-6">
      <PageHeader title={mockProject.name} subtitle={'Code: ' + mockProject.code} onBack={() => navigate('/projects')}>
        <Button type="primary" icon={<EditOutlined />} onClick={() => navigate('/projects/' + mockProject.id + '/edit')}>Edit Project</Button>
      </PageHeader>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}><Card><Statistic title="Budget" value={mockProject.budget} prefix="$" precision={0} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Spent" value={mockProject.spent} prefix="$" precision={0} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Progress" value={mockProject.progress} suffix="%" /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Tasks" value={projectTasks.length} /></Card></Col>
      </Row>
      <Card>
        <Tabs defaultActiveKey="overview" items={[
          { key: 'overview', label: 'Overview', children: (
            <Row gutter={24}>
              <Col span={16}>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="Project Name">{mockProject.name}</Descriptions.Item>
                  <Descriptions.Item label="Code">{mockProject.code}</Descriptions.Item>
                  <Descriptions.Item label="Status"><Tag color="blue">{mockProject.status.replace('_', ' ')}</Tag></Descriptions.Item>
                  <Descriptions.Item label="Priority"><Tag color="orange">{mockProject.priority}</Tag></Descriptions.Item>
                  <Descriptions.Item label="Manager">{mockProject.manager}</Descriptions.Item>
                  <Descriptions.Item label="Duration">{mockProject.startDate} ? {mockProject.endDate}</Descriptions.Item>
                  <Descriptions.Item label="Description" span={2}>{mockProject.description}</Descriptions.Item>
                </Descriptions>
                <div className="mt-4"><Text strong>Budget vs Actual</Text><Progress percent={Math.round((mockProject.spent / mockProject.budget) * 100)} size="small" /></div>
              </Col>
              <Col span={8}>
                <Card title="Team Members" size="small">
                  <List dataSource={teamMembers} renderItem={(m) => (
                    <List.Item><Space><Avatar icon={<UserOutlined />} size="small" /><div><Text className="text-sm">{m.name}</Text><br /><Text type="secondary" className="text-xs">{m.role} ({m.allocation}%)</Text></div></Space></List.Item>
                  )} />
                </Card>
              </Col>
            </Row>
          )},
          { key: 'tasks', label: 'Tasks (' + projectTasks.length + ')', children: (
            <Table dataSource={projectTasks} rowKey="id" pagination={false} size="small"
              columns={[
                { title: 'Title', dataIndex: 'title' }, { title: 'Assignee', dataIndex: 'assignee' },
                { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s.replace('_', ' ')}</Tag> },
                { title: 'Priority', dataIndex: 'priority', render: (p: string) => <Tag color={priorityColors[p]}>{p}</Tag> },
                { title: 'Due', dataIndex: 'dueDate' },
              ]}
            />
          )},
          { key: 'budget', label: 'Budget', children: <div className="text-center py-8"><Text type="secondary">Detailed budget breakdown will be displayed here</Text></div> },
        ]} />
      </Card>
    </div>
  );
};
export default ProjectDetail;
