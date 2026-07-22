import { Card, Table, Tag, Progress } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

const data = [
  { key: '1', account: 'Revenue', fiscalYear: '2026', budgeted: 1200000, actual: 850000, variance: 70.8 },
  { key: '2', account: 'COGS', fiscalYear: '2026', budgeted: 600000, actual: 420000, variance: 70.0 },
  { key: '3', account: 'Operating Expenses', fiscalYear: '2026', budgeted: 400000, actual: 250000, variance: 62.5 },
  { key: '4', account: 'Marketing', fiscalYear: '2026', budgeted: 150000, actual: 95000, variance: 63.3 },
];

export default function BudgetPage() {
  const { t } = useTranslation();

  const columns = [
    { title: t('accounting.budgets.account'), dataIndex: 'account', key: 'account' },
    { title: t('accounting.budgets.fiscalYear'), dataIndex: 'fiscalYear', key: 'fiscalYear' },
    { title: t('accounting.budgets.budgeted'), dataIndex: 'budgeted', key: 'budgeted', render: (v: number) => '$' + v.toLocaleString() },
    { title: t('accounting.budgets.actual'), dataIndex: 'actual', key: 'actual', render: (v: number) => '$' + v.toLocaleString() },
    { title: t('accounting.budgets.utilization'), key: 'utilization', render: (_: any, r: any) => <Progress percent={Math.round(r.variance)} size="small" /> },
  ];

  return (
    <div>
      <PageHeader title={t('accounting.budgets.title')} subtitle={t('accounting.budgets.subtitle')} onAdd={() => {}} addLabel={t('accounting.budgets.newBudget')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
