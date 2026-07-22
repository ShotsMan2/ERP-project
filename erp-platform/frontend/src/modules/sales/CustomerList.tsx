import { Tag, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/data/DataTable';

const data = [
  { id: '1', name: 'ABC Corporation', code: 'CUST-001', email: 'info@abccorp.com', phone: '+1-555-1001', segment: 'Enterprise', status: 'active' },
  { id: '2', name: 'XYZ Industries', code: 'CUST-002', email: 'contact@xyzind.com', phone: '+1-555-1002', segment: 'SMB', status: 'active' },
  { id: '3', name: 'GlobalTech Ltd', code: 'CUST-003', email: 'sales@globaltech.com', phone: '+1-555-1003', segment: 'Enterprise', status: 'inactive' },
  { id: '4', name: 'LocalShop Inc', code: 'CUST-004', email: 'info@localshop.com', phone: '+1-555-1004', segment: 'Retail', status: 'active' },
];

export default function CustomerList() {
  const { t } = useTranslation();

  const columns = [
    { title: t('sales.name'), dataIndex: 'name', key: 'name', sorter: (a: any, b: any) => a.name.localeCompare(b.name) },
    { title: t('sales.code'), dataIndex: 'code', key: 'code' },
    { title: t('sales.email'), dataIndex: 'email', key: 'email' },
    { title: t('sales.phone'), dataIndex: 'phone', key: 'phone' },
    { title: t('sales.customerSegment'), dataIndex: 'segment', key: 'segment', render: (s: string) => <Tag color="blue">{s}</Tag> },
    { title: t('sales.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('sales.customerList')} subtitle={t('sales.customersSubtitle')} onAdd={() => {}} addLabel={t('sales.addCustomer')} />
      <DataTable columns={columns} dataSource={data} rowKey="id" searchable selectable />
    </div>
  );
}
