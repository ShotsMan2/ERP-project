import { Tabs, Card, Table, Tag, Button } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

export default function UsersRoles() {
  const { t } = useTranslation();

  const userColumns = [
    { title: t('settings.users.name'), dataIndex: 'name', key: 'name' },
    { title: t('settings.users.email'), dataIndex: 'email', key: 'email' },
    { title: t('settings.users.roles'), dataIndex: 'roles', key: 'roles', render: (roles: string[]) => roles.map(r => <Tag key={r}>{r}</Tag>) },
    { title: t('settings.users.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag> },
  ];

  const roleColumns = [
    { title: t('settings.users.name'), dataIndex: 'name', key: 'name' },
    { title: t('settings.users.code'), dataIndex: 'code', key: 'code' },
    { title: t('settings.users.description'), dataIndex: 'description', key: 'description' },
    { title: t('settings.users.usersCount'), dataIndex: 'users', key: 'users' },
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

  return (
    <div>
      <PageHeader title={t('settings.users.title')} subtitle={t('settings.users.subtitle')} />
      <Card>
        <Tabs items={[
          { key: 'users', label: t('settings.users.usersTab'), children: <div><div className="mb-4"><Button type="primary">{t('settings.addUser')}</Button></div><Table columns={userColumns} dataSource={users} /></div> },
          { key: 'roles', label: t('settings.users.rolesTab'), children: <div><div className="mb-4"><Button type="primary">{t('settings.addRole')}</Button></div><Table columns={roleColumns} dataSource={roles} /></div> },
        ]} />
      </Card>
    </div>
  );
}
