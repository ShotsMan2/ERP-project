import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, message, Modal, Form, Input, Switch, Checkbox, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

interface Role { id: string; name: string; code: string; isSystem: boolean; userCount: number; description: string; }
const mockRoles: Role[] = [
  { id: '1', name: 'Super Admin', code: 'super_admin', isSystem: true, userCount: 2, description: 'Full system access' },
  { id: '2', name: 'Accountant', code: 'accountant', isSystem: true, userCount: 1, description: 'Accounting and finance access' },
  { id: '3', name: 'Sales Manager', code: 'sales_manager', isSystem: true, userCount: 1, description: 'Sales and CRM access' },
  { id: '4', name: 'Warehouse Manager', code: 'warehouse_manager', isSystem: false, userCount: 1, description: 'Inventory and warehouse access' },
  { id: '5', name: 'HR Manager', code: 'hr_manager', isSystem: false, userCount: 0, description: 'HR module access' },
];

const modules = ['Dashboard', 'HR', 'Inventory', 'Procurement', 'Sales', 'CRM', 'Accounting', 'Projects', 'Reports', 'Settings'];
const actions = ['Read', 'Create', 'Update', 'Delete', 'Approve'];

const RoleList: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [permModalOpen, setPermModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Users', dataIndex: 'userCount', key: 'userCount' },
    { title: 'System', dataIndex: 'isSystem', key: 'isSystem', render: (s: boolean) => s ? <Tag color="blue">System</Tag> : <Tag>Custom</Tag> },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Actions', key: 'actions', render: (_: unknown, r: Role) => (
      <Space>
        <Button type="link" size="small" onClick={() => { setSelectedRole(r); setPermModalOpen(true); }}>Permissions</Button>
        <Button type="link" size="small" icon={<EditOutlined />} />
        {!r.isSystem && <Button type="link" size="small" danger icon={<DeleteOutlined />} />}
      </Space>
    )},
  ];

  return (
    <div className="p-6">
      <PageHeader title="Roles & Permissions" subtitle="Manage user roles and access rights">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>New Role</Button>
      </PageHeader>
      <Card><DataTable dataSource={mockRoles} columns={columns} rowKey="id" pagination={false} /></Card>

      <Modal title="Role Permissions" open={permModalOpen} onCancel={() => setPermModalOpen(false)} width={700} footer={<Button type="primary" onClick={() => { message.success('Permissions updated'); setPermModalOpen(false); }}>Save Permissions</Button>}>
        <Tabs items={modules.map((m) => ({
          key: m, label: m,
          children: <div><Checkbox indeterminate>Select All</Checkbox><div className="mt-2 grid grid-cols-2 gap-2">{actions.map((a) => <Checkbox key={a}>{a}</Checkbox>)}</div></div>,
        }))} />
      </Modal>

      <Modal title="New Role" open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => { message.success('Role created'); setModalOpen(false); }}>
        <Form layout="vertical">
          <Form.Item label="Role Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Code" name="code" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Description" name="description"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default RoleList;
