import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const accounts = [
  { key: '1', bank: 'Chase Bank', accountNumber: '****1234', iban: 'US12CHAS123456789', currency: 'USD', balance: 250000.00, status: 'active' },
  { key: '2', bank: 'Bank of America', accountNumber: '****5678', iban: 'US12BOFA987654321', currency: 'USD', balance: 150000.00, status: 'active' },
  { key: '3', bank: 'Wells Fargo', accountNumber: '****9012', iban: 'US12WFG456789123', currency: 'USD', balance: 85000.00, status: 'active' },
];

const columns = [
  { title: 'Bank', dataIndex: 'bank', key: 'bank' },
  { title: 'Account', dataIndex: 'accountNumber', key: 'accountNumber' },
  { title: 'IBAN', dataIndex: 'iban', key: 'iban' },
  { title: 'Currency', dataIndex: 'currency', key: 'currency' },
  { title: 'Balance', dataIndex: 'balance', key: 'balance', render: (v: number) => '$' + v.toLocaleString() },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag> },
];

export default function BankPage() {
  return (
    <div>
      <PageHeader title="Bank Accounts" subtitle="Manage bank accounts and reconciliation" onAdd={() => {}} addLabel="Add Account" />
      <Card><Table columns={columns} dataSource={accounts} /></Card>
    </div>
  );
}
