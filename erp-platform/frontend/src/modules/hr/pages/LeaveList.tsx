import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Typography, message, Modal, Descriptions } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
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
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  const filtered = statusFilter ? mockLeaves.filter((l) => l.status === statusFilter) : mockLeaves;

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    message.success(`Leave request ${id} has been ${action}`);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Employee', dataIndex: 'employee', key: 'employee', sorter: (a: LeaveRequest, b: LeaveRequest) => a.employee.localeCompare(b.employee) },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (t: string) => <Tag>{t}</Tag> },
    { title: 'From', dataIndex: 'startDate', key: 'startDate' },
    { title: 'To', dataIndex: 'endDate', key: 'endDate' },
    { title: 'Days', dataIndex: 'days', key: 'days' },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (s: string) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag>,
    },
    {
      title: 'Actions', key: 'actions',
      render: (_: unknown, record: LeaveRequest) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setSelectedLeave(record)} />
          {record.status === 'pending' && (
            <>
              <Button type="link" size="small" icon={<CheckOutlined />} style={{ color: '#52c41a' }} onClick={() => handleAction(record.id, 'approved')}>
                Approve
              </Button>
              <Button type="link" size="small" danger icon={<CloseOutlined />} onClick={() => handleAction(record.id, 'rejected')}>
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Leave Requests" subtitle="Manage employee leave requests">
        <Select
          placeholder="Filter by status"
          value={statusFilter || undefined}
          onChange={(v) => setStatusFilter(v || '')}
          allowClear
          className="w-40"
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
        />
      </PageHeader>

      <Card>
        <DataTable
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (t: number) => `${t} requests` }}
        />
      </Card>

      <Modal
        title="Leave Request Details"
        open={!!selectedLeave}
        onCancel={() => setSelectedLeave(null)}
        footer={null}
        width={480}
      >
        {selectedLeave && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="ID">{selectedLeave.id}</Descriptions.Item>
            <Descriptions.Item label="Employee">{selectedLeave.employee}</Descriptions.Item>
            <Descriptions.Item label="Leave Type">{selectedLeave.type}</Descriptions.Item>
            <Descriptions.Item label="Duration">{selectedLeave.startDate} → {selectedLeave.endDate} ({selectedLeave.days} days)</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={statusColors[selectedLeave.status]}>{selectedLeave.status.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Reason">{selectedLeave.reason}</Descriptions.Item>
            <Descriptions.Item label="Applied On">{selectedLeave.appliedOn}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default LeaveList;
