import { Card, Table, Switch, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const modules = ['Users', 'Employees', 'Products', 'Inventory', 'Sales', 'Procurement', 'Accounting', 'Projects', 'Reports', 'Settings'];
const actions = ['Read', 'Create', 'Update', 'Delete', 'Approve'];

export default function PermissionsPage() {
  return (
    <div>
      <PageHeader title="Permission Matrix" subtitle="Configure role-based permissions" />
      <Card>
        <Table
          dataSource={modules.map(m => ({ module: m, key: m }))}
          columns={[
            { title: 'Module', dataIndex: 'module', key: 'module', fixed: 'left' as const },
            ...actions.map(action => ({
              title: action,
              key: action,
              render: () => <Switch size="small" defaultChecked={action !== 'Delete'} />,
            })),
          ]}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
}
