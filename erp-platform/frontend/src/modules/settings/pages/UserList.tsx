import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Select, Typography, message, Drawer, Form, Switch } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, LockOutlined } from '@ant-design/icons';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

interface User { id: string; name: string; email: string; role: string; status: string; lastLogin: string; }
const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@company.com', role: 'Super Admin', status: 'active', lastLogin: '2024-12-15 10:30' },
  { id: '2', name: 'Carol Martinez', email: 'carol@company.com', role: 'Accountant', status: 'active', lastLogin: '2024-12-15 09:15' },
  { id: '3', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Sales Manager', status: 'active', lastLogin: '2024-12-14 16:45' },
  { id: '4', name: 'Mike Brown', email: 'mike@company.com', role: 'Warehouse Manager', status: 'active', lastLogin: '2024-12-14 08:30' },
  { id: '5', name: 'John Smith', email: 'john@company.com', role: 'Employee', status: 'active', lastLogin: '2024-12-13 17:00' },
  { id: '6', name: 'Inactive User', email: 'inactive@company.com', role: 'Employee', status: 'inactive', lastLogin: '2024-11-20 12:00' },
];

const UserList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filtered = mockUsers.filter((u) => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role', render: (r: string) => <Tag>{r}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag> },
    { title: 'Last Login', dataIndex: 'lastLogin', key: 'lastLogin' },
    { title: 'Actions', key: 'actions', render: (_: unknown, r: User) => (
      <Space>
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setSelectedUser(r); setDrawerOpen(true); }} />
        <Button type="link" size="small" icon={<LockOutlined />} />
      </Space>
    )},
  ];

  return (
    <div className="p-6">
      <PageHeader title="Users" subtitle="Manage system users and access">
        <Button type="primary" icon={<PlusOutlined />}>Add User</Button>
      </PageHeader>
      <Card>
        <Input placeholder="Search users..." prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs mb-4" allowClear />
        <DataTable dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (t: number) => t + ' users' }} />
      </Card>
      <Drawer title={selectedUser?.name || 'Edit User'} open={drawerOpen} onClose={() => { setDrawerOpen(false); setSelectedUser(null); }} width={400}>
        <Form layout="vertical" initialValues={selectedUser || {}}>
          <Form.Item label="Name" name="name"><Input /></Form.Item>
          <Form.Item label="Email" name="email"><Input /></Form.Item>
          <Form.Item label="Role" name="role"><Select><Select.Option value="Super Admin">Super Admin</Select.Option><Select.Option value="Accountant">Accountant</Select.Option><Select.Option value="Sales Manager">Sales Manager</Select.Option><Select.Option value="Employee">Employee</Select.Option></Select></Form.Item>
          <Form.Item label="Active" name="active" valuePropName="checked"><Switch /></Form.Item>
          <Button type="primary" onClick={() => { message.success('User updated'); setDrawerOpen(false); }}>Save</Button>
        </Form>
      </Drawer>
    </div>
  );
};
export default UserList;
