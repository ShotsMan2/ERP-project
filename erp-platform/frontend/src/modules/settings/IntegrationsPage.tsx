import { Card, Table, Tag, Switch } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

export default function IntegrationsPage() {
  const { t } = useTranslation();

  const data = [
    { key: '1', name: 'Stripe', type: 'Payment', status: 'connected', lastSync: '2026-07-20 14:30' },
    { key: '2', name: 'QuickBooks', type: 'Accounting', status: 'connected', lastSync: '2026-07-20 13:00' },
    { key: '3', name: 'Shopify', type: 'E-commerce', status: 'disconnected', lastSync: '2026-07-18' },
    { key: '4', name: 'Slack', type: 'Communication', status: 'connected', lastSync: '2026-07-20 14:45' },
  ];

  const columns = [
    { title: t('settings.integrations.integration'), dataIndex: 'name', key: 'name' },
    { title: t('settings.integrations.type'), dataIndex: 'type', key: 'type' },
    { title: t('settings.integrations.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'connected' ? 'green' : 'red'}>{s}</Tag> },
    { title: t('settings.integrations.lastSync'), dataIndex: 'lastSync', key: 'lastSync' },
    { title: t('settings.integrations.enabled'), key: 'enabled', render: () => <Switch defaultChecked size="small" /> },
  ];

  return (
    <div>
      <PageHeader title={t('settings.integrations.title')} subtitle={t('settings.integrations.subtitle')} onAdd={() => {}} addLabel={t('settings.integrations.addIntegration')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
