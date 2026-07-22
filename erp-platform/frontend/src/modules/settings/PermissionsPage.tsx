import { Card, Table, Switch, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

export default function PermissionsPage() {
  const { t } = useTranslation();

  const modules = ['Users', 'Employees', 'Products', 'Inventory', 'Sales', 'Procurement', 'Accounting', 'Projects', 'Reports', 'Settings'];
  const actions = [t('settings.permissions.title') ? 'Read' : 'Read', 'Create', 'Update', 'Delete', 'Approve'];

  return (
    <div>
      <PageHeader title={t('settings.permissions.title')} subtitle={t('settings.permissions.subtitle')} />
      <Card>
        <Table
          dataSource={modules.map(m => ({ module: m, key: m }))}
          columns={[
            { title: t('settings.module'), dataIndex: 'module', key: 'module', fixed: 'left' as const },
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
