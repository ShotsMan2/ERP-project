import { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Typography, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import PageHeader from '@/components/ui/PageHeader';
import { adminService, ActivityLog } from '@/services/adminService';
const { Text } = Typography;

const actionColors: Record<string, string> = {
  create: 'green', update: 'blue', delete: 'red', approve: 'purple',
  login: 'default', export: 'orange', read: 'cyan', failure: 'red',
};

const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [moduleFilter, setModuleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await adminService.listActivities({
        module: moduleFilter || undefined,
        status: statusFilter || undefined,
        size: 100,
      });
      setLogs(data);
    } catch { message.error('Failed to load audit logs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, [moduleFilter, statusFilter]);

  const modules = [...new Set(logs.map(l => l.module))];

  const columns = [
    { title: 'Timestamp', dataIndex: 'created_at', key: 'created_at', render: (d: string) => new Date(d).toLocaleString(), sorter: (a: ActivityLog, b: ActivityLog) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime() },
    { title: 'User', dataIndex: 'user_email', key: 'user_email', render: (v: string | null) => v || 'System' },
    { title: 'Action', dataIndex: 'action', key: 'action', render: (a: string) => <Tag color={actionColors[a.toLowerCase()] || 'default'}>{a}</Tag> },
    { title: 'Resource', dataIndex: 'resource_type', key: 'resource_type' },
    { title: 'Resource ID', dataIndex: 'resource_id', key: 'resource_id', render: (v: string | null) => v || '-' },
    { title: 'Module', dataIndex: 'module', key: 'module', render: (m: string) => <Tag color="blue">{m}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'success' ? 'green' : 'red'}>{s}</Tag> },
    { title: 'Duration', dataIndex: 'duration_ms', key: 'duration_ms', render: (v: number | null) => v ? `${v}ms` : '-' },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Audit Logs" subtitle="Immutable audit trail of all system changes">
        <Button icon={<ReloadOutlined />} onClick={fetchLogs} loading={loading}>Refresh</Button>
      </PageHeader>
      <Card>
        <Space className="mb-4" wrap>
          <Select placeholder="Filter by module" value={moduleFilter || undefined} onChange={(v) => setModuleFilter(v || '')} allowClear className="w-48"
            options={modules.map((m) => ({ value: m, label: m }))} />
          <Select placeholder="Filter by status" value={statusFilter || undefined} onChange={(v) => setStatusFilter(v || '')} allowClear className="w-40"
            options={[{ value: 'success', label: 'Success' }, { value: 'failure', label: 'Failure' }]} />
        </Space>
        <Table dataSource={logs} columns={columns} rowKey="id" loading={loading}
          pagination={{ pageSize: 10, showTotal: (t: number) => `${t} audit entries` }} size="small" />
      </Card>
    </div>
  );
};

export default AuditLogViewer;
