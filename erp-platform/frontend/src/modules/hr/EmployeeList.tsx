import { useState } from 'react';
import { Tag, Space, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/data/DataTable';

const data = [
  { id: '1', code: 'EMP001', name: 'John Doe', email: 'john@company.com', department: 'Engineering', position: 'Senior Developer', status: 'active', avatar: '' },
  { id: '2', code: 'EMP002', name: 'Jane Smith', email: 'jane@company.com', department: 'Marketing', position: 'Marketing Manager', status: 'active', avatar: '' },
  { id: '3', code: 'EMP003', name: 'Bob Wilson', email: 'bob@company.com', department: 'HR', position: 'HR Specialist', status: 'active', avatar: '' },
  { id: '4', code: 'EMP004', name: 'Alice Brown', email: 'alice@company.com', department: 'Finance', position: 'Accountant', status: 'inactive', avatar: '' },
];

const columns = [
  { title: 'Code', dataIndex: 'code', key: 'code', sorter: (a: any, b: any) => a.code.localeCompare(b.code) },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (_: any, record: any) => (
      <Space>
        <Avatar icon={<UserOutlined />} src={record.avatar} size="small" />
        <span>{record.name}</span>
      </Space>
    ),
    sorter: (a: any, b: any) => a.name.localeCompare(b.name),
  },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Department', dataIndex: 'department', key: 'department' },
  { title: 'Position', dataIndex: 'position', key: 'position' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
    ),
  },
];

export default function EmployeeList() {
  const [loading] = useState(false);

  return (
    <div>
      <PageHeader title="Employees" subtitle="Manage your workforce" onAdd={() => {}} addLabel="Add Employee" />
      <DataTable columns={columns} dataSource={data} loading={loading} rowKey="id" selectable />
    </div>
  );
}
