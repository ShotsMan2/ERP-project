import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

export default function WorkflowsPage() {
  const { t } = useTranslation();

  const data = [
    { key: '1', name: 'Leave Approval', trigger: 'Leave Request Submitted', conditions: 'Requires manager approval', actions: 'Notify manager, Send email', status: 'active' },
    { key: '2', name: 'PO Approval', trigger: 'Purchase Order Created', conditions: 'Amount > ,000', actions: 'Route to manager, Notify purchasing', status: 'active' },
    { key: '3', name: 'Invoice Matching', trigger: 'Invoice Received', conditions: 'Match with PO', actions: 'Auto-validate, Notify accountant', status: 'inactive' },
  ];

  const columns = [
    { title: t('settings.workflows.workflow'), dataIndex: 'name', key: 'name' },
    { title: t('settings.workflows.trigger'), dataIndex: 'trigger', key: 'trigger' },
    { title: t('settings.workflows.conditions'), dataIndex: 'conditions', key: 'conditions' },
    { title: t('settings.workflows.actions'), dataIndex: 'actions', key: 'actions' },
    { title: t('settings.workflows.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('settings.workflows.title')} subtitle={t('settings.workflows.subtitle')} onAdd={() => {}} addLabel={t('settings.workflows.newWorkflow')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
