import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

export default function AuditLogs() {
  const { t } = useTranslation();

  const data = [
    { key: '1', eventType: 'user.login', resourceType: 'Session', resourceId: 'sess_001', user: 'admin@company.com', ip: '192.168.1.1', timestamp: '2026-07-20 14:30:00', status: 'success' },
    { key: '2', eventType: 'employee.create', resourceType: 'Employee', resourceId: 'emp_005', user: 'hr@company.com', ip: '192.168.1.2', timestamp: '2026-07-20 13:15:00', status: 'success' },
    { key: '3', eventType: 'po.approve', resourceType: 'PurchaseOrder', resourceId: 'po_003', user: 'manager@company.com', ip: '192.168.1.3', timestamp: '2026-07-20 11:45:00', status: 'success' },
    { key: '4', eventType: 'user.login.failed', resourceType: 'Session', resourceId: '-', user: 'unknown', ip: '10.0.0.5', timestamp: '2026-07-20 10:00:00', status: 'failure' },
  ];

  const columns = [
    { title: t('admin.auditLogs.eventType'), dataIndex: 'eventType', key: 'eventType' },
    { title: t('admin.auditLogs.resource'), dataIndex: 'resourceType', key: 'resourceType' },
    { title: t('admin.auditLogs.resourceId'), dataIndex: 'resourceId', key: 'resourceId' },
    { title: t('admin.auditLogs.user'), dataIndex: 'user', key: 'user' },
    { title: t('admin.auditLogs.ipAddress'), dataIndex: 'ip', key: 'ip' },
    { title: t('admin.auditLogs.timestamp'), dataIndex: 'timestamp', key: 'timestamp' },
    { title: t('admin.auditLogs.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'success' ? 'green' : 'red'}>{s}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('admin.auditLogs.title')} subtitle={t('admin.auditLogs.subtitle')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
