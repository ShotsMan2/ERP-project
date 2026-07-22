import { Tag, Rate } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/data/DataTable';

const data = [
  { id: '1', name: 'Tech Supplies Inc.', code: 'SUP-001', email: 'info@techsupplies.com', phone: '+1-555-0101', rating: 4.5, status: 'active' },
  { id: '2', name: 'Office Mart Ltd.', code: 'SUP-002', email: 'sales@officemart.com', phone: '+1-555-0102', rating: 3.8, status: 'active' },
  { id: '3', name: 'Global Parts Co.', code: 'SUP-003', email: 'contact@globalparts.com', phone: '+1-555-0103', rating: 4.2, status: 'active' },
];

export default function SupplierList() {
  const { t } = useTranslation();

  const columns = [
    { title: t('procurement.name'), dataIndex: 'name', key: 'name' },
    { title: t('procurement.code'), dataIndex: 'code', key: 'code' },
    { title: t('procurement.email'), dataIndex: 'email', key: 'email' },
    { title: t('procurement.phone'), dataIndex: 'phone', key: 'phone' },
    { title: t('procurement.rating'), dataIndex: 'rating', key: 'rating', render: (r: number) => <Rate disabled value={r} allowHalf /> },
    { title: t('procurement.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color="green">{s}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('procurement.supplierList')} subtitle={t('procurement.suppliersSubtitle')} onAdd={() => {}} addLabel={t('procurement.addSupplier')} />
      <DataTable columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
}
