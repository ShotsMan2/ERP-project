import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', name: 'Leave Approval', trigger: 'Leave Request Submitted', conditions: 'Requires manager approval', actions: 'Notify manager, Send email', status: 'active' },
  { key: '2', name: 'PO Approval', trigger: 'Purchase Order Created', conditions: 'Amount > ,000', actions: 'Route to manager, Notify purchasing', status: 'active' },
  { key: '3', name: 'Invoice Matching', trigger: 'Invoice Received', conditions: 'Match with PO', actions: 'Auto-validate, Notify accountant', status: 'inactive' },
];

const columns = [
  { title: 'Workflow', dataIndex: 'name', key: 'name' },
  { title: 'Trigger', dataIndex: 'trigger', key: 'trigger' },
  { title: 'Conditions', dataIndex: 'conditions', key: 'conditions' },
  { title: 'Actions', dataIndex: 'actions', key: 'actions' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag> },
];

export default function WorkflowsPage() {
  return (
    <div>
      <PageHeader title="Workflows" subtitle="Automate business processes" onAdd={() => {}} addLabel="New Workflow" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
