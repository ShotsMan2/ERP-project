import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, message, Modal, Progress } from 'antd';
import { PlayCircleOutlined, DownloadOutlined, RotateLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

interface Backup { id: string; name: string; type: string; size: string; status: string; createdAt: string; createdBy: string; }
const mockBackups: Backup[] = [
  { id: '1', name: 'full-backup-2024-12-15', type: 'Full', size: '2.5 GB', status: 'completed', createdAt: '2024-12-15 02:00', createdBy: 'System' },
  { id: '2', name: 'wal-archive-2024-12-15', type: 'WAL', size: '450 MB', status: 'completed', createdAt: '2024-12-15 03:00', createdBy: 'System' },
  { id: '3', name: 'full-backup-2024-12-14', type: 'Full', size: '2.4 GB', status: 'completed', createdAt: '2024-12-14 02:00', createdBy: 'System' },
  { id: '4', name: 'full-backup-2024-12-13', type: 'Full', size: '2.4 GB', status: 'completed', createdAt: '2024-12-13 02:00', createdBy: 'System' },
  { id: '5', name: 'incremental-2024-12-15', type: 'Incremental', size: '180 MB', status: 'running', createdAt: '2024-12-15 04:00', createdBy: 'Admin' },
];

const BackupManager: React.FC = () => {
  const [restoreModal, setRestoreModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color={t === 'Full' ? 'blue' : t === 'WAL' ? 'green' : 'orange'}>{t}</Tag> },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => s === 'running' ? <Space><Progress type="circle" percent={65} size={20} /><Text>Running</Text></Space> : <Tag color={s === 'completed' ? 'green' : 'red'}>{s}</Tag> },
    { title: 'Created', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Actions', key: 'actions', render: (_: unknown, r: Backup) => (
      <Space>
        <Button type="link" size="small" icon={<DownloadOutlined />} onClick={() => message.success('Downloading ' + r.name)} />
        <Button type="link" size="small" icon={<RotateLeftOutlined />} onClick={() => { setSelectedBackup(r); setRestoreModal(true); }} />
        <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => message.success('Backup deleted')} />
      </Space>
    )},
  ];

  return (
    <div className="p-6">
      <PageHeader title="Backup Manager" subtitle="Database backup and restore management">
        <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => message.success('Backup started')}>Create Backup</Button>
      </PageHeader>
      <Card><DataTable dataSource={mockBackups} columns={columns} rowKey="id" pagination={false} /></Card>

      <Modal title="Restore Backup" open={restoreModal} onCancel={() => setRestoreModal(false)}
        onOk={() => { message.warning('Restore initiated. This may take several minutes.'); setRestoreModal(false); }}
        okText="Start Restore"
      >
        {selectedBackup && (
          <div>
            <Text>You are about to restore: <strong>{selectedBackup.name}</strong></Text>
            <br /><Text type="secondary">Size: {selectedBackup.size} | Type: {selectedBackup.type}</Text>
            <div className="mt-4 p-3 bg-orange-50 rounded border border-orange-200">
              <Text type="warning">Warning: This will overwrite current data. All changes after {selectedBackup.createdAt} will be lost.</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default BackupManager;
