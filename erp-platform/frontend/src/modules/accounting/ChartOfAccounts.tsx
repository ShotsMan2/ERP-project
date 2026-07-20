import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', code: '1000', name: 'Cash and Cash Equivalents', type: 'Asset', balance: 150000.00, active: true },
  { key: '2', code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: 85000.00, active: true },
  { key: '3', code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 45000.00, active: true },
  { key: '4', code: '3000', name: 'Shareholder Equity', type: 'Equity', balance: 500000.00, active: true },
  { key: '5', code: '4000', name: 'Revenue', type: 'Revenue', balance: 250000.00, active: true },
  { key: '6', code: '5000', name: 'Cost of Goods Sold', type: 'Expense', balance: 120000.00, active: true },
  { key: '7', code: '6000', name: 'Operating Expenses', type: 'Expense', balance: 85000.00, active: true },
];

const columns = [
  { title: 'Code', dataIndex: 'code', key: 'code' },
  { title: 'Account Name', dataIndex: 'name', key: 'name' },
  { title: 'Type', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color="blue">{t}</Tag> },
  { title: 'Balance', dataIndex: 'balance', key: 'balance', render: (v: number) => `$${v.toLocaleString()}` },
  { title: 'Status', dataIndex: 'active', key: 'active', render: (a: boolean) => <Tag color={a ? 'green' : 'red'}>{a ? 'Active' : 'Inactive'}</Tag> },
];

export default function ChartOfAccounts() {
  return (
    <div>
      <PageHeader title="Chart of Accounts" subtitle="Manage your accounting framework" onAdd={() => {}} addLabel="Add Account" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
