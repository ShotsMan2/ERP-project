import { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, message, Modal, Progress } from 'antd';
import { PlayCircleOutlined, DeleteOutlined, RotateLeftOutlined } from '@ant-design/icons';
import PageHeader from '@/components/ui/PageHeader';
import { adminService, Backup } from '@/services/adminService';
const { Text } = Typography;

const BackupManager: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoreModal, setRestoreModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const data = await adminService.listBackups();
      setBackups(data);
    } catch { message.error('Failed to load backups'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBackups(); }, []);

  const handleCreateBackup = async () => {
    setActionLoading(true);
    try {
      await adminService.createBackup('full');
      message.success('Backup started');
      fetchBackups();
    } catch { message.error('Failed to start backup'); }
    finally { setActionLoading(false); }
  };

  const handleDeleteBackup = async (id: string) => {
    try {
      await adminService.deleteBackup(id);
      message.success('Backup deleted');
      fetchBackups();
    } catch { message.error('Failed to delete backup'); }
  };

  const handleRestore = async () => {
    if (!selectedBackup) return;
    setActionLoading(true);
    try {
      await adminService.restoreBackup(selectedBackup.id);
      message.success('Restore initiated');
      setRestoreModal(false);
      fetchBackups();
    } catch { message.error('Restore failed'); }
    finally { setActionLoading(false); }
  };

  const columns = [
    { title: 'Name', dataIndex: 'filename', key: 'filename' },
    {
      title: 'Type', dataIndex: 'type', key: 'type',
      render: (t: string) => <Tag color={t === 'full' ? 'blue' : t === 'wal' ? 'green' : 'orange'}>{t.toUpperCase()}</Tag>,
    },
    {
      title: 'Size', key: 'size',
      render: (_: unknown, r: Backup) => r.size_bytes ? `${(r.size_bytes / 1024 / 1024).toFixed(1)} MB` : '-',
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (s: string) => {
        const colorMap: Record<string, string> = { completed: 'green', running: 'orange', pending: 'default', failed: 'red', restoring: 'blue' };
        return s === 'running' || s === 'restoring'
          ? <Space><Progress type="circle" percent={s === 'restoring' ? 50 : 30} size={20} /><Text>{s}</Text></Space>
          : <Tag color={colorMap[s] || 'default'}>{s}</Tag>;
      },
    },
    { title: 'Created', dataIndex: 'created_at', key: 'created_at', render: (d: string) => new Date(d).toLocaleString() },
    {
      title: 'Actions', key: 'actions',
      render: (_: unknown, r: Backup) => (
        <Space>
          <Button type="link" size="small" icon={<RotateLeftOutlined />}
            onClick={() => { setSelectedBackup(r); setRestoreModal(true); }} disabled={r.status !== 'completed'} />
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteBackup(r.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Backup Manager" subtitle="Database backup and restore management">
        <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleCreateBackup} loading={actionLoading}>Create Backup</Button>
      </PageHeader>
      <Card>
        <Table dataSource={backups} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal title="Restore Backup" open={restoreModal} onCancel={() => setRestoreModal(false)}
        onOk={handleRestore} okText="Start Restore" confirmLoading={actionLoading}
      >
        {selectedBackup && (
          <div>
            <Text>You are about to restore: <strong>{selectedBackup.filename}</strong></Text>
            <br /><Text type="secondary">Type: {selectedBackup.type} | Created: {new Date(selectedBackup.created_at).toLocaleString()}</Text>
            <div className="mt-4 p-3 bg-orange-50 rounded border border-orange-200">
              <Text type="warning">Warning: This will overwrite current data. All changes after the backup date will be lost.</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BackupManager;
