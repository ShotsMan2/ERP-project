import { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import PageHeader from '@/components/ui/PageHeader';
import { adminService, ActivityLog } from '@/services/adminService';
import { useTranslation } from 'react-i18next';

export default function ActivityLogs() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await adminService.listActivities({ size: 50 });
      setLogs(data);
    } catch { message.error('Failed to load activity logs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, []);

  const columns = [
    { title: t('admin.activityLogs.user'), dataIndex: 'user_email', key: 'user_email', render: (v: string | null) => v || 'System' },
    { title: t('admin.activityLogs.action'), dataIndex: 'action', key: 'action' },
    { title: t('admin.activityLogs.module'), dataIndex: 'module', key: 'module', render: (m: string) => <Tag color="blue">{m}</Tag> },
    { title: t('admin.activityLogs.timestamp'), dataIndex: 'created_at', key: 'created_at', render: (d: string) => new Date(d).toLocaleString() },
    { title: t('admin.activityLogs.duration'), dataIndex: 'duration_ms', key: 'duration_ms', render: (v: number | null) => v ? `${v}ms` : '-' },
  ];

  return (
    <div>
      <PageHeader title={t('admin.activityLogs.title')} subtitle={t('admin.activityLogs.subtitle')}>
        <Button icon={<ReloadOutlined />} onClick={fetchLogs} loading={loading}>Refresh</Button>
      </PageHeader>
      <Card>
        <Table dataSource={logs} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} size="small" />
      </Card>
    </div>
  );
}
