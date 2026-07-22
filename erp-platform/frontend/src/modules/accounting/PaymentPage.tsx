import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

const data = [
  { key: '1', invoice: 'INV-2026-001', amount: 15900.00, method: 'Bank Transfer', date: '2026-07-20', status: 'completed', reference: 'TRX-001' },
  { key: '2', invoice: 'INV-2026-002', amount: 4500.00, method: 'Credit Card', date: '2026-07-19', status: 'completed', reference: 'TRX-002' },
  { key: '3', invoice: 'INV-2026-004', amount: 10000.00, method: 'Check', date: '2026-07-18', status: 'pending', reference: 'CHK-001' },
];

export default function PaymentPage() {
  const { t } = useTranslation();

  const columns = [
    { title: t('accounting.payments.invoice'), dataIndex: 'invoice', key: 'invoice' },
    { title: t('accounting.payments.amount'), dataIndex: 'amount', key: 'amount', render: (v: number) => `$${v.toLocaleString()}` },
    { title: t('accounting.payments.method'), dataIndex: 'method', key: 'method' },
    { title: t('accounting.payments.date'), dataIndex: 'date', key: 'date' },
    { title: t('accounting.payments.reference'), dataIndex: 'reference', key: 'reference' },
    { title: t('accounting.payments.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'completed' ? 'green' : 'orange'}>{s}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('accounting.payments.title')} subtitle={t('accounting.payments.subtitle')} onAdd={() => {}} addLabel={t('accounting.payments.recordPayment')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
