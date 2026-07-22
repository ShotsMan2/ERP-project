import { Card, Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', product: 'Laptop Pro 15', from: 'Main Warehouse', to: 'Secondary WH', quantity: 10, date: '2026-07-19', status: 'completed' },
  { key: '2', product: 'Office Desk', from: 'Secondary WH', to: 'Main Warehouse', quantity: 5, date: '2026-07-18', status: 'in_transit' },
  { key: '3', product: 'Wireless Mouse', from: 'Main Warehouse', to: 'Secondary WH', quantity: 50, date: '2026-07-20', status: 'pending' },
];

export default function TransferPage() {
  const { t } = useTranslation();

  const columns = [
    { title: t('inventory.transfersPage.product'), dataIndex: 'product', key: 'product' },
    { title: t('inventory.transfersPage.from'), dataIndex: 'from', key: 'from' },
    { title: t('inventory.transfersPage.to'), dataIndex: 'to', key: 'to' },
    { title: t('inventory.transfersPage.quantity'), dataIndex: 'quantity', key: 'quantity' },
    { title: t('inventory.transfersPage.date'), dataIndex: 'date', key: 'date' },
    { title: t('inventory.transfersPage.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'completed' ? 'green' : s === 'in_transit' ? 'blue' : 'orange'}>{s}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('inventory.transfersPage.title')} subtitle={t('inventory.transfersPage.subtitle')} onAdd={() => {}} addLabel={t('inventory.transfersPage.addLabel')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
