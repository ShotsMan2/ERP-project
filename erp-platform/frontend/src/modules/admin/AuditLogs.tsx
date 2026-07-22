import { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import PageHeader from '@/components/ui/PageHeader';
import { adminService, ActivityLog } from '@/services/adminService';
import { useTranslation } from 'react-i18next';

export default function AuditLogs() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    adminService.listActivities({ size: 100 })
      .then(setLogs)
      .catch(() => message.error('Failed to load audit logs'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: t('admin.auditLogs.eventType'), dataIndex: 'action', key: 'action' },
    { title: t('admin.auditLogs.resource'), dataIndex: 'resource_type', key: 'resource_type' },
    { title: t('admin.auditLogs.resourceId'), dataIndex: 'resource_id', key: 'resource_id', render: (v: string | null) => v || '-' },
    { title: t('admin.auditLogs.user'), dataIndex: 'user_email', key: 'user_email', render: (v: string | null) => v || 'System' },
    { title: t('admin.auditLogs.ipAddress'), dataIndex: 'ip_address', key: 'ip_address', render: (v: string | null) => v || '-' },
    { title: t('admin.auditLogs.timestamp'), dataIndex: 'created_at', key: 'created_at', render: (d: string) => new Date(d).toLocaleString() },
    { title: t('admin.auditLogs.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'success' ? 'green' : 'red'}>{s}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('admin.auditLogs.title')} subtitle={t('admin.auditLogs.subtitle')}>
        <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()} loading={loading}>Refresh</Button>
      </PageHeader>
      <Card><Table dataSource={logs} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} /></Card>
    </div>
  );
}
