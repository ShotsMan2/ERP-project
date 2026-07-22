import { Card, Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', number: 'RFQ-2026-001', title: 'Office Equipment', issueDate: '2026-07-10', closingDate: '2026-07-25', status: 'open', bids: 3 },
  { key: '2', number: 'RFQ-2026-002', title: 'IT Hardware', issueDate: '2026-07-15', closingDate: '2026-07-30', status: 'open', bids: 5 },
  { key: '3', number: 'RFQ-2026-003', title: 'Cleaning Services', issueDate: '2026-07-01', closingDate: '2026-07-15', status: 'closed', bids: 7 },
];

export default function RFQPage() {
  const { t } = useTranslation();

  const columns = [
    { title: t('procurement.rfqNumber'), dataIndex: 'number', key: 'number' },
    { title: t('procurement.fieldTitle'), dataIndex: 'title', key: 'title' },
    { title: t('procurement.issueDate'), dataIndex: 'issueDate', key: 'issueDate' },
    { title: t('procurement.closingDate'), dataIndex: 'closingDate', key: 'closingDate' },
    { title: t('procurement.bids'), dataIndex: 'bids', key: 'bids' },
    { title: t('procurement.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'open' ? 'blue' : 'default'}>{s}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('procurement.rfqTitle')} subtitle={t('procurement.rfqSubtitle')} onAdd={() => {}} addLabel={t('procurement.newRFQ')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
