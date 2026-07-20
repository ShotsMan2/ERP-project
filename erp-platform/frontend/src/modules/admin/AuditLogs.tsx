import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', eventType: 'user.login', resourceType: 'Session', resourceId: 'sess_001', user: 'admin@company.com', ip: '192.168.1.1', timestamp: '2026-07-20 14:30:00', status: 'success' },
  { key: '2', eventType: 'employee.create', resourceType: 'Employee', resourceId: 'emp_005', user: 'hr@company.com', ip: '192.168.1.2', timestamp: '2026-07-20 13:15:00', status: 'success' },
  { key: '3', eventType: 'po.approve', resourceType: 'PurchaseOrder', resourceId: 'po_003', user: 'manager@company.com', ip: '192.168.1.3', timestamp: '2026-07-20 11:45:00', status: 'success' },
  { key: '4', eventType: 'user.login.failed', resourceType: 'Session', resourceId: '-', user: 'unknown', ip: '10.0.0.5', timestamp: '2026-07-20 10:00:00', status: 'failure' },
];

const columns = [
  { title: 'Event Type', dataIndex: 'eventType', key: 'eventType' },
  { title: 'Resource', dataIndex: 'resourceType', key: 'resourceType' },
  { title: 'Resource ID', dataIndex: 'resourceId', key: 'resourceId' },
  { title: 'User', dataIndex: 'user', key: 'user' },
  { title: 'IP Address', dataIndex: 'ip', key: 'ip' },
  { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'success' ? 'green' : 'red'}>{s}</Tag> },
];

export default function AuditLogs() {
  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="Immutable audit trail of all system changes" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
