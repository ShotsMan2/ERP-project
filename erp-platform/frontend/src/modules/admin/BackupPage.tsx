import { Card, Table, Tag, Button, Space } from 'antd';
import { PlayCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

export default function BackupPage() {
  const { t } = useTranslation();

  const data = [
    { key: '1', date: '2026-07-20 04:00', type: 'Full', size: '2.5 GB', status: 'completed', initiatedBy: 'System' },
    { key: '2', date: '2026-07-19 04:00', type: 'Full', size: '2.4 GB', status: 'completed', initiatedBy: 'System' },
    { key: '3', date: '2026-07-18 04:00', type: 'Full', size: '2.4 GB', status: 'completed', initiatedBy: 'System' },
    { key: '4', date: '2026-07-17 12:00', type: 'Incremental', size: '0.3 GB', status: 'completed', initiatedBy: 'System' },
  ];

  const columns = [
    { title: t('admin.backup.date'), dataIndex: 'date', key: 'date' },
    { title: t('admin.backup.type'), dataIndex: 'type', key: 'type', render: (t: string) => <Tag color={t === 'Full' ? 'blue' : 'default'}>{t}</Tag> },
    { title: t('admin.backup.size'), dataIndex: 'size', key: 'size' },
    { title: t('admin.backup.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'completed' ? 'green' : s === 'running' ? 'orange' : 'red'}>{s}</Tag> },
    { title: t('admin.backup.initiatedBy'), dataIndex: 'initiatedBy', key: 'initiatedBy' },
  ];

  return (
    <div>
      <PageHeader title={t('admin.backup.title')} subtitle={t('admin.backup.subtitle')} />
      <div className="mb-4">
        <Space>
          <Button type="primary" icon={<PlayCircleOutlined />}>{t('admin.backup.createBackup')}</Button>
          <Button icon={<RollbackOutlined />}>{t('admin.backup.restoreFromBackup')}</Button>
        </Space>
      </div>
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
