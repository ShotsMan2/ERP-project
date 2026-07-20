import { Card, Table, Tag, Switch } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', name: 'Stripe', type: 'Payment', status: 'connected', lastSync: '2026-07-20 14:30' },
  { key: '2', name: 'QuickBooks', type: 'Accounting', status: 'connected', lastSync: '2026-07-20 13:00' },
  { key: '3', name: 'Shopify', type: 'E-commerce', status: 'disconnected', lastSync: '2026-07-18' },
  { key: '4', name: 'Slack', type: 'Communication', status: 'connected', lastSync: '2026-07-20 14:45' },
];

const columns = [
  { title: 'Integration', dataIndex: 'name', key: 'name' },
  { title: 'Type', dataIndex: 'type', key: 'type' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'connected' ? 'green' : 'red'}>{s}</Tag> },
  { title: 'Last Sync', dataIndex: 'lastSync', key: 'lastSync' },
  { title: 'Enabled', key: 'enabled', render: () => <Switch defaultChecked size="small" /> },
];

export default function IntegrationsPage() {
  return (
    <div>
      <PageHeader title="Integrations" subtitle="Connect third-party services" onAdd={() => {}} addLabel="Add Integration" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
