import { Card, Table, Tag, Button, Space } from 'antd';
import { PlayCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', date: '2026-07-20 04:00', type: 'Full', size: '2.5 GB', status: 'completed', initiatedBy: 'System' },
  { key: '2', date: '2026-07-19 04:00', type: 'Full', size: '2.4 GB', status: 'completed', initiatedBy: 'System' },
  { key: '3', date: '2026-07-18 04:00', type: 'Full', size: '2.4 GB', status: 'completed', initiatedBy: 'System' },
  { key: '4', date: '2026-07-17 12:00', type: 'Incremental', size: '0.3 GB', status: 'completed', initiatedBy: 'System' },
];

const columns = [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Type', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color={t === 'Full' ? 'blue' : 'default'}>{t}</Tag> },
  { title: 'Size', dataIndex: 'size', key: 'size' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'completed' ? 'green' : s === 'running' ? 'orange' : 'red'}>{s}</Tag> },
  { title: 'Initiated By', dataIndex: 'initiatedBy', key: 'initiatedBy' },
];

export default function BackupPage() {
  return (
    <div>
      <PageHeader title="Backup & Restore" subtitle="Manage system backups" />
      <div className="mb-4">
        <Space>
          <Button type="primary" icon={<PlayCircleOutlined />}>Create Backup</Button>
          <Button icon={<RollbackOutlined />}>Restore from Backup</Button>
        </Space>
      </div>
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
