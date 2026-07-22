import { Card, Table, Tag, Progress } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

export default function QueueMonitor() {
  const { t } = useTranslation();

  const data = [
    { key: '1', queue: 'email-notifications', pending: 15, processing: 3, failed: 1, completed: 1240, retryCount: 2 },
    { key: '2', queue: 'report-generation', pending: 2, processing: 1, failed: 0, completed: 85, retryCount: 0 },
    { key: '3', queue: 'data-import', pending: 0, processing: 0, failed: 2, completed: 56, retryCount: 3 },
    { key: '4', queue: 'webhook-delivery', pending: 8, processing: 2, failed: 0, completed: 320, retryCount: 0 },
  ];

  const columns = [
    { title: t('admin.queue.queue'), dataIndex: 'queue', key: 'queue' },
    { title: t('admin.queue.pending'), dataIndex: 'pending', key: 'pending', render: (v: number) => <Tag color={v > 0 ? 'orange' : 'default'}>{v}</Tag> },
    { title: t('admin.queue.processing'), dataIndex: 'processing', key: 'processing' },
    { title: t('admin.queue.failed'), dataIndex: 'failed', key: 'failed', render: (v: number) => <Tag color={v > 0 ? 'red' : 'green'}>{v}</Tag> },
    { title: t('admin.queue.completed'), dataIndex: 'completed', key: 'completed' },
    { title: t('admin.queue.retryCount'), dataIndex: 'retryCount', key: 'retryCount' },
  ];

  return (
    <div>
      <PageHeader title={t('admin.queue.title')} subtitle={t('admin.queue.subtitle')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
