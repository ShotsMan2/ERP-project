import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Typography, message, Modal, Descriptions } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

interface LeaveRequest {
  id: string;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reason: string;
  appliedOn: string;
}

const mockLeaves: LeaveRequest[] = [
  { id: 'LV001', employee: 'John Smith', type: 'Annual Leave', startDate: '2024-12-24', endDate: '2024-12-26', days: 3, status: 'pending', reason: 'Family vacation', appliedOn: '2024-12-10' },
  { id: 'LV002', employee: 'Sarah Johnson', type: 'Sick Leave', startDate: '2024-12-18', endDate: '2024-12-18', days: 1, status: 'approved', reason: 'Doctor appointment', appliedOn: '2024-12-15' },
  { id: 'LV003', employee: 'Mike Brown', type: 'Personal Day', startDate: '2024-12-20', endDate: '2024-12-20', days: 1, status: 'rejected', reason: 'Personal errand', appliedOn: '2024-12-12' },
  { id: 'LV004', employee: 'Emily Davis', type: 'Annual Leave', startDate: '2025-01-05', endDate: '2025-01-10', days: 6, status: 'pending', reason: 'International trip', appliedOn: '2024-12-14' },
  { id: 'LV005', employee: 'James Wilson', type: 'Sick Leave', startDate: '2024-12-16', endDate: '2024-12-17', days: 2, status: 'approved', reason: 'Flu', appliedOn: '2024-12-16' },
  { id: 'LV006', employee: 'Anna Taylor', type: 'Maternity Leave', startDate: '2024-12-01', endDate: '2025-03-01', days: 90, status: 'approved', reason: 'Maternity', appliedOn: '2024-11-15' },
];

const statusColors: Record<string, string> = {
  pending: 'orange', approved: 'green', rejected: 'red', cancelled: 'default',
};

const LeaveList: React.FC = () => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  const filtered = statusFilter ? mockLeaves.filter((l) => l.status === statusFilter) : mockLeaves;

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    message.success(`${t('hr.leaveRequestDetails')} ${id} ${action === 'approved' ? t('hr.approvedLabel') : t('hr.rejectedLabel')}`);
  };

  const columns = [
    { title: t('hr.id'), dataIndex: 'id', key: 'id' },
    { title: t('hr.employee'), dataIndex: 'employee', key: 'employee', sorter: (a: LeaveRequest, b: LeaveRequest) => a.employee.localeCompare(b.employee) },
    { title: t('hr.leaveType'), dataIndex: 'type', key: 'type', render: (t: string) => <Tag>{t}</Tag> },
    { title: t('hr.from'), dataIndex: 'startDate', key: 'startDate' },
    { title: t('hr.to'), dataIndex: 'endDate', key: 'endDate' },
    { title: t('hr.daysColumn'), dataIndex: 'days', key: 'days' },
    {
      title: t('common.status'), dataIndex: 'status', key: 'status',
      render: (s: string) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag>,
    },
    {
      title: t('common.actions'), key: 'actions',
      render: (_: unknown, record: LeaveRequest) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setSelectedLeave(record)} />
          {record.status === 'pending' && (
            <>
              <Button type="link" size="small" icon={<CheckOutlined />} style={{ color: '#52c41a' }} onClick={() => handleAction(record.id, 'approved')}>
                {t('hr.approveBtn')}
              </Button>
              <Button type="link" size="small" danger icon={<CloseOutlined />} onClick={() => handleAction(record.id, 'rejected')}>
                {t('hr.rejectBtn')}
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader title={t('hr.leaveRequestsTitle')} subtitle={t('hr.manageLeaveRequests')}>
        <Select
          placeholder={t('hr.filterByStatus')}
          value={statusFilter || undefined}
          onChange={(v) => setStatusFilter(v || '')}
          allowClear
          className="w-40"
          options={[
            { value: 'pending', label: t('hr.pendingLabel') },
            { value: 'approved', label: t('hr.approvedLabel') },
            { value: 'rejected', label: t('hr.rejectedLabel') },
            { value: 'cancelled', label: t('hr.cancelledLabel') },
          ]}
        />
      </PageHeader>

      <Card>
        <DataTable
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (count: number) => t('hr.leaveRequestsCount', { count }) }}
        />
      </Card>

      <Modal
        title={t('hr.leaveRequestDetails')}
        open={!!selectedLeave}
        onCancel={() => setSelectedLeave(null)}
        footer={null}
        width={480}
      >
        {selectedLeave && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label={t('hr.id')}>{selectedLeave.id}</Descriptions.Item>
            <Descriptions.Item label={t('hr.employee')}>{selectedLeave.employee}</Descriptions.Item>
            <Descriptions.Item label={t('hr.leaveTypeLabel')}>{selectedLeave.type}</Descriptions.Item>
            <Descriptions.Item label={t('hr.durationLabel')}>{selectedLeave.startDate} → {selectedLeave.endDate} ({selectedLeave.days} {t('hr.daysLabel')})</Descriptions.Item>
            <Descriptions.Item label={t('common.status')}>
              <Tag color={statusColors[selectedLeave.status]}>{selectedLeave.status.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('hr.reasonLabel')}>{selectedLeave.reason}</Descriptions.Item>
            <Descriptions.Item label={t('hr.appliedOnLabel')}>{selectedLeave.appliedOn}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default LeaveList;
