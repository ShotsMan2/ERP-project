import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', number: 'RFQ-2026-001', title: 'Office Equipment', issueDate: '2026-07-10', closingDate: '2026-07-25', status: 'open', bids: 3 },
  { key: '2', number: 'RFQ-2026-002', title: 'IT Hardware', issueDate: '2026-07-15', closingDate: '2026-07-30', status: 'open', bids: 5 },
  { key: '3', number: 'RFQ-2026-003', title: 'Cleaning Services', issueDate: '2026-07-01', closingDate: '2026-07-15', status: 'closed', bids: 7 },
];

const columns = [
  { title: 'RFQ Number', dataIndex: 'number', key: 'number' },
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Issue Date', dataIndex: 'issueDate', key: 'issueDate' },
  { title: 'Closing Date', dataIndex: 'closingDate', key: 'closingDate' },
  { title: 'Bids', dataIndex: 'bids', key: 'bids' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'open' ? 'blue' : 'default'}>{s}</Tag> },
];

export default function RFQPage() {
  return (
    <div>
      <PageHeader title="Request for Quotations" subtitle="Manage RFQs" onAdd={() => {}} addLabel="New RFQ" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
