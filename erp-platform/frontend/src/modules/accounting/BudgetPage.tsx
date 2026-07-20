import { Card, Table, Tag, Progress } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', account: 'Revenue', fiscalYear: '2026', budgeted: 1200000, actual: 850000, variance: 70.8 },
  { key: '2', account: 'COGS', fiscalYear: '2026', budgeted: 600000, actual: 420000, variance: 70.0 },
  { key: '3', account: 'Operating Expenses', fiscalYear: '2026', budgeted: 400000, actual: 250000, variance: 62.5 },
  { key: '4', account: 'Marketing', fiscalYear: '2026', budgeted: 150000, actual: 95000, variance: 63.3 },
];

const columns = [
  { title: 'Account', dataIndex: 'account', key: 'account' },
  { title: 'Fiscal Year', dataIndex: 'fiscalYear', key: 'fiscalYear' },
  { title: 'Budgeted', dataIndex: 'budgeted', key: 'budgeted', render: (v: number) => '$' + v.toLocaleString() },
  { title: 'Actual', dataIndex: 'actual', key: 'actual', render: (v: number) => '$' + v.toLocaleString() },
  { title: 'Utilization', key: 'utilization', render: (_: any, r: any) => <Progress percent={Math.round(r.variance)} size="small" /> },
];

export default function BudgetPage() {
  return (
    <div>
      <PageHeader title="Budgets" subtitle="Manage departmental budgets" onAdd={() => {}} addLabel="New Budget" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
