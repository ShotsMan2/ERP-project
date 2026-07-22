import { Card, Table, Progress } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', product: 'Laptop Pro 15', warehouse: 'Main Warehouse', bin: 'A-01', quantity: 45, reserved: 5, available: 40, maxStock: 100 },
  { key: '2', product: 'Office Desk', warehouse: 'Main Warehouse', bin: 'B-03', quantity: 12, reserved: 2, available: 10, maxStock: 50 },
  { key: '3', product: 'Wireless Mouse', warehouse: 'Secondary WH', bin: 'C-01', quantity: 150, reserved: 20, available: 130, maxStock: 200 },
];

export default function StockPage() {
  const { t } = useTranslation();

  const columns = [
    { title: t('inventory.stockLevelsPage.product'), dataIndex: 'product', key: 'product' },
    { title: t('inventory.stockLevelsPage.warehouse'), dataIndex: 'warehouse', key: 'warehouse' },
    { title: t('inventory.stockLevelsPage.bin'), dataIndex: 'bin', key: 'bin' },
    { title: t('inventory.stockLevelsPage.onHand'), dataIndex: 'quantity', key: 'quantity' },
    { title: t('inventory.stockLevelsPage.reserved'), dataIndex: 'reserved', key: 'reserved' },
    { title: t('inventory.stockLevelsPage.available'), dataIndex: 'available', key: 'available', render: (v: number) => <span className="text-success font-bold">{v}</span> },
    {
      title: t('inventory.stockLevelsPage.utilization'),
      key: 'utilization',
      render: (_: any, r: any) => <Progress percent={Math.round((r.quantity / r.maxStock) * 100)} size="small" />,
    },
  ];

  return (
    <div>
      <PageHeader title={t('inventory.stockLevelsPage.title')} subtitle={t('inventory.stockLevelsPage.subtitle')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
