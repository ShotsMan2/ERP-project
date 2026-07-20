import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Switch, Typography, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';

interface Workflow { id: string; name: string; trigger: string; module: string; status: string; lastRun: string; }
const mockWorkflows: Workflow[] = [
  { id: '1', name: 'Leave Approval Chain', trigger: 'Leave Request Created', module: 'HR', status: 'active', lastRun: '2024-12-15' },
  { id: '2', name: 'PO Approval (>$10k)', trigger: 'PO Created', module: 'Procurement', status: 'active', lastRun: '2024-12-14' },
  { id: '3', name: 'New User Onboarding', trigger: 'User Created', module: 'Settings', status: 'active', lastRun: '2024-12-13' },
  { id: '4', name: 'Low Stock Alert', trigger: 'Stock Level Changed', module: 'Inventory', status: 'inactive', lastRun: '2024-12-10' },
  { id: '5', name: 'Invoice Overdue Reminder', trigger: 'Invoice Due Date Passed', module: 'Accounting', status: 'active', lastRun: '2024-12-16' },
];

const WorkflowList: React.FC = () => {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Trigger', dataIndex: 'trigger', key: 'trigger' },
    { title: 'Module', dataIndex: 'module', key: 'module', render: (m: string) => <Tag>{m}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string, r: Workflow) => <Switch checked={s === 'active'} onChange={(v) => message.success(r.name + ' ' + (v ? 'activated' : 'deactivated'))} /> },
    { title: 'Last Run', dataIndex: 'lastRun', key: 'lastRun' },
    { title: 'Actions', key: 'actions', render: () => (
      <Space><Button type="link" size="small" icon={<EditOutlined />} /><Button type="link" size="small" danger icon={<DeleteOutlined />} /></Space>
    )},
  ];

  return (
    <div className="p-6">
      <PageHeader title="Workflow Automation" subtitle="Automate business processes and approvals">
        <Button type="primary" icon={<PlusOutlined />}>New Workflow</Button>
      </PageHeader>
      <Card><DataTable dataSource={mockWorkflows} columns={columns} rowKey="id" pagination={false} /></Card>
    </div>
  );
};
export default WorkflowList;
