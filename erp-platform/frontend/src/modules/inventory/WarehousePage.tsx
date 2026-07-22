import { Card, Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', name: 'Main Warehouse', code: 'WH-001', type: 'Finished Goods', location: 'Building A', capacity: '80%', status: 'active' },
  { key: '2', name: 'Secondary Warehouse', code: 'WH-002', type: 'Raw Materials', location: 'Building B', capacity: '45%', status: 'active' },
  { key: '3', name: 'Cold Storage', code: 'WH-003', type: 'Perishables', location: 'Building C', capacity: '60%', status: 'active' },
];

export default function WarehousePage() {
  const { t } = useTranslation();

  const columns = [
    { title: t('inventory.warehousesPage.name'), dataIndex: 'name', key: 'name' },
    { title: t('inventory.warehousesPage.code'), dataIndex: 'code', key: 'code' },
    { title: t('inventory.warehousesPage.type'), dataIndex: 'type', key: 'type' },
    { title: t('inventory.warehousesPage.location'), dataIndex: 'location', key: 'location' },
    { title: t('inventory.warehousesPage.capacity'), dataIndex: 'capacity', key: 'capacity' },
    { title: t('inventory.warehousesPage.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color="green">{s}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('inventory.warehousesPage.title')} subtitle={t('inventory.warehousesPage.subtitle')} onAdd={() => {}} addLabel={t('inventory.warehousesPage.addLabel')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
