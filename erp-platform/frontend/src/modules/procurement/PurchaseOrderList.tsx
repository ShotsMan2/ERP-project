import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/data/DataTable';

const data = [
  { id: '1', number: 'PO-2026-001', supplier: 'Tech Supplies Inc.', date: '2026-07-15', total: 12500.00, status: 'approved' },
  { id: '2', number: 'PO-2026-002', supplier: 'Office Mart Ltd.', date: '2026-07-16', total: 3400.50, status: 'pending' },
  { id: '3', number: 'PO-2026-003', supplier: 'Global Parts Co.', date: '2026-07-18', total: 8900.00, status: 'draft' },
  { id: '4', number: 'PO-2026-004', supplier: 'Tech Supplies Inc.', date: '2026-07-19', total: 2200.00, status: 'delivered' },
];

export default function PurchaseOrderList() {
  const { t } = useTranslation();

  const columns = [
    { title: t('procurement.poNumber'), dataIndex: 'number', key: 'number' },
    { title: t('procurement.supplier'), dataIndex: 'supplier', key: 'supplier' },
    { title: t('procurement.date'), dataIndex: 'date', key: 'date' },
    { title: t('procurement.total'), dataIndex: 'total', key: 'total', render: (v: number) => `$${v.toLocaleString()}`, sorter: (a: any, b: any) => a.total - b.total },
    { title: t('procurement.status'), dataIndex: 'status', key: 'status', render: (s: string) => {
      const colors: Record<string, string> = { draft: 'default', pending: 'orange', approved: 'blue', sent: 'purple', delivered: 'green', cancelled: 'red' };
      return <Tag color={colors[s] || 'default'}>{s}</Tag>;
    }},
  ];

  return (
    <div>
      <PageHeader title={t('procurement.purchaseOrderList')} subtitle={t('procurement.purchaseOrdersSubtitle')} onAdd={() => {}} addLabel={t('procurement.newPO')} />
      <DataTable columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
}
