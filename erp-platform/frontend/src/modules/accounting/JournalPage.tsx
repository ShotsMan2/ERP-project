import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', number: 'JV-2026-001', date: '2026-07-15', type: 'General', description: 'Monthly accruals', debit: 25000, credit: 25000, status: 'posted' },
  { key: '2', number: 'JV-2026-002', date: '2026-07-16', type: 'Sales', description: 'Daily sales entry', debit: 15000, credit: 15000, status: 'posted' },
  { key: '3', number: 'JV-2026-003', date: '2026-07-18', type: 'Purchase', description: 'Supplier invoice booking', debit: 8500, credit: 8500, status: 'draft' },
];

const columns = [
  { title: 'Journal #', dataIndex: 'number', key: 'number' },
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Type', dataIndex: 'type', key: 'type' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
  { title: 'Debit', dataIndex: 'debit', key: 'debit', render: (v: number) => `$${v.toLocaleString()}` },
  { title: 'Credit', dataIndex: 'credit', key: 'credit', render: (v: number) => `$${v.toLocaleString()}` },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'posted' ? 'green' : 'orange'}>{s}</Tag> },
];

export default function JournalPage() {
  return (
    <div>
      <PageHeader title="Journals" subtitle="Manage journal entries" onAdd={() => {}} addLabel="New Journal" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
