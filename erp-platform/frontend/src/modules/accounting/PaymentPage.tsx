import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', invoice: 'INV-2026-001', amount: 15900.00, method: 'Bank Transfer', date: '2026-07-20', status: 'completed', reference: 'TRX-001' },
  { key: '2', invoice: 'INV-2026-002', amount: 4500.00, method: 'Credit Card', date: '2026-07-19', status: 'completed', reference: 'TRX-002' },
  { key: '3', invoice: 'INV-2026-004', amount: 10000.00, method: 'Check', date: '2026-07-18', status: 'pending', reference: 'CHK-001' },
];

const columns = [
  { title: 'Invoice', dataIndex: 'invoice', key: 'invoice' },
  { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v: number) => `$${v.toLocaleString()}` },
  { title: 'Method', dataIndex: 'method', key: 'method' },
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Reference', dataIndex: 'reference', key: 'reference' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'completed' ? 'green' : 'orange'}>{s}</Tag> },
];

export default function PaymentPage() {
  return (
    <div>
      <PageHeader title="Payments" subtitle="Record and manage payments" onAdd={() => {}} addLabel="Record Payment" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
