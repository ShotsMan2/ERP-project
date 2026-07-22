import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

const data = [
  { key: '1', code: '1000', name: 'Cash and Cash Equivalents', type: 'Asset', balance: 150000.00, active: true },
  { key: '2', code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: 85000.00, active: true },
  { key: '3', code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 45000.00, active: true },
  { key: '4', code: '3000', name: 'Shareholder Equity', type: 'Equity', balance: 500000.00, active: true },
  { key: '5', code: '4000', name: 'Revenue', type: 'Revenue', balance: 250000.00, active: true },
  { key: '6', code: '5000', name: 'Cost of Goods Sold', type: 'Expense', balance: 120000.00, active: true },
  { key: '7', code: '6000', name: 'Operating Expenses', type: 'Expense', balance: 85000.00, active: true },
];

export default function ChartOfAccounts() {
  const { t } = useTranslation();

  const columns = [
    { title: t('accounting.chartOfAccounts.code'), dataIndex: 'code', key: 'code' },
    { title: t('accounting.chartOfAccounts.accountName'), dataIndex: 'name', key: 'name' },
    { title: t('accounting.chartOfAccounts.type'), dataIndex: 'type', key: 'type', render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: t('accounting.chartOfAccounts.balance'), dataIndex: 'balance', key: 'balance', render: (v: number) => `$${v.toLocaleString()}` },
    { title: t('accounting.chartOfAccounts.status'), dataIndex: 'active', key: 'active', render: (a: boolean) => <Tag color={a ? 'green' : 'red'}>{a ? t('accounting.chartOfAccounts.active') : t('accounting.chartOfAccounts.inactive')}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('accounting.chartOfAccounts.title')} subtitle={t('accounting.chartOfAccounts.subtitle')} onAdd={() => {}} addLabel={t('accounting.chartOfAccounts.addAccount')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
