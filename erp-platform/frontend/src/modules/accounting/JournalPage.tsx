import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

const data = [
  { key: '1', number: 'JV-2026-001', date: '2026-07-15', type: 'General', description: 'Monthly accruals', debit: 25000, credit: 25000, status: 'posted' },
  { key: '2', number: 'JV-2026-002', date: '2026-07-16', type: 'Sales', description: 'Daily sales entry', debit: 15000, credit: 15000, status: 'posted' },
  { key: '3', number: 'JV-2026-003', date: '2026-07-18', type: 'Purchase', description: 'Supplier invoice booking', debit: 8500, credit: 8500, status: 'draft' },
];

export default function JournalPage() {
  const { t } = useTranslation();

  const columns = [
    { title: t('accounting.journals.journalNumber'), dataIndex: 'number', key: 'number' },
    { title: t('accounting.journals.date'), dataIndex: 'date', key: 'date' },
    { title: t('accounting.journals.type'), dataIndex: 'type', key: 'type' },
    { title: t('accounting.journals.description'), dataIndex: 'description', key: 'description' },
    { title: t('accounting.journals.debit'), dataIndex: 'debit', key: 'debit', render: (v: number) => `$${v.toLocaleString()}` },
    { title: t('accounting.journals.credit'), dataIndex: 'credit', key: 'credit', render: (v: number) => `$${v.toLocaleString()}` },
    { title: t('accounting.journals.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'posted' ? 'green' : 'orange'}>{s}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('accounting.journals.title')} subtitle={t('accounting.journals.subtitle')} onAdd={() => {}} addLabel={t('accounting.journals.newJournal')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
