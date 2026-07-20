import { Tabs, Card, Table, Tag, Button } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const userColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Roles', dataIndex: 'roles', key: 'roles', render: (roles: string[]) => roles.map(r => <Tag key={r}>{r}</Tag>) },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag> },
];

const roleColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Code', dataIndex: 'code', key: 'code' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
  { title: 'Users', dataIndex: 'users', key: 'users' },
];

const users = [
  { key: '1', name: 'Admin User', email: 'admin@company.com', roles: ['Administrator'], status: 'active' },
  { key: '2', name: 'John Doe', email: 'john@company.com', roles: ['Employee'], status: 'active' },
  { key: '3', name: 'Jane Smith', email: 'jane@company.com', roles: ['HR Manager', 'Employee'], status: 'active' },
];

const roles = [
  { key: '1', name: 'Administrator', code: 'admin', description: 'Full system access', users: 2 },
  { key: '2', name: 'HR Manager', code: 'hr_manager', description: 'HR module access', users: 1 },
  { key: '3', name: 'Employee', code: 'employee', description: 'Self-service access', users: 45 },
];

export default function UsersRoles() {
  return (
    <div>
      <PageHeader title="Users & Roles" subtitle="Manage users and roles" />
      <Card>
        <Tabs items={[
          { key: 'users', label: 'Users', children: <div><div className="mb-4"><Button type="primary">Add User</Button></div><Table columns={userColumns} dataSource={users} /></div> },
          { key: 'roles', label: 'Roles', children: <div><div className="mb-4"><Button type="primary">Add Role</Button></div><Table columns={roleColumns} dataSource={roles} /></div> },
        ]} />
      </Card>
    </div>
  );
}
