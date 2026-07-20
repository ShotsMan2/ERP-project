import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, DatePicker, Typography, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';
const { RangePicker } = DatePicker;
const { Text } = Typography;

interface AuditLog { id: string; timestamp: string; user: string; action: string; resource: string; resourceId: string; details: string; ip: string; }
const mockLogs: AuditLog[] = [
  { id: '1', timestamp: '2024-12-15 14:32:15', user: 'Carol Martinez', action: 'UPDATE', resource: 'PurchaseOrder', resourceId: 'PO-2024-0156', details: 'Updated line quantities', ip: '192.168.1.100' },
  { id: '2', timestamp: '2024-12-15 14:30:00', user: 'John Smith', action: 'CREATE', resource: 'LeaveRequest', resourceId: 'LV-2024-0089', details: 'Created annual leave request', ip: '192.168.1.105' },
  { id: '3', timestamp: '2024-12-15 13:45:22', user: 'Sarah Johnson', action: 'APPROVE', resource: 'SalesOrder', resourceId: 'SO-2024-0234', details: 'Approved sales order', ip: '192.168.1.102' },
  { id: '4', timestamp: '2024-12-15 11:20:00', user: 'Mike Brown', action: 'CREATE', resource: 'StockMovement', resourceId: 'M-2024-0089', details: 'Stock transfer created', ip: '192.168.1.108' },
  { id: '5', timestamp: '2024-12-15 10:15:45', user: 'Emily Davis', action: 'DELETE', resource: 'Document', resourceId: 'DOC-0045', details: 'Deleted expired contract', ip: '192.168.1.110' },
  { id: '6', timestamp: '2024-12-15 09:00:00', user: 'System', action: 'LOGIN', resource: 'User', resourceId: 'user@company.com', details: 'Successful login', ip: '203.0.113.50' },
];

const actionColors: Record<string, string> = { CREATE: 'green', UPDATE: 'blue', DELETE: 'red', APPROVE: 'purple', LOGIN: 'default', EXPORT: 'orange' };

const AuditLogViewer: React.FC = () => {
  const [userFilter, setUserFilter] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const users = [...new Set(mockLogs.map((l) => l.user))];

  const filtered = mockLogs.filter((l) => {
    const mu = !userFilter || l.user === userFilter;
    const ma = !actionFilter || l.action === actionFilter;
    return mu && ma;
  });

  const columns = [
    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp', sorter: (a: AuditLog, b: AuditLog) => a.timestamp.localeCompare(b.timestamp) },
    { title: 'User', dataIndex: 'user', key: 'user' },
    { title: 'Action', dataIndex: 'action', key: 'action', render: (a: string) => <Tag color={actionColors[a]}>{a}</Tag> },
    { title: 'Resource', dataIndex: 'resource', key: 'resource' },
    { title: 'Resource ID', dataIndex: 'resourceId', key: 'resourceId' },
    { title: 'Details', dataIndex: 'details', key: 'details' },
    { title: 'IP Address', dataIndex: 'ip', key: 'ip' },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Audit Logs" subtitle="Immutable audit trail of all system changes" />
      <Card>
        <Space className="mb-4" wrap>
          <Select placeholder="Filter by user" value={userFilter || undefined} onChange={(v) => setUserFilter(v || '')} allowClear className="w-48" options={users.map((u) => ({ value: u, label: u }))} />
          <Select placeholder="Filter by action" value={actionFilter || undefined} onChange={(v) => setActionFilter(v || '')} allowClear className="w-40"
            options={[{ value: 'CREATE', label: 'Create' }, { value: 'UPDATE', label: 'Update' }, { value: 'DELETE', label: 'Delete' }, { value: 'APPROVE', label: 'Approve' }, { value: 'LOGIN', label: 'Login' }]} />
          <RangePicker />
        </Space>
        <DataTable dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (t: number) => t + ' audit entries' }} />
      </Card>
    </div>
  );
};
export default AuditLogViewer;
