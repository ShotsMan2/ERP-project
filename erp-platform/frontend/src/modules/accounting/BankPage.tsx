import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

const accounts = [
  { key: '1', bank: 'Chase Bank', accountNumber: '****1234', iban: 'US12CHAS123456789', currency: 'USD', balance: 250000.00, status: 'active' },
  { key: '2', bank: 'Bank of America', accountNumber: '****5678', iban: 'US12BOFA987654321', currency: 'USD', balance: 150000.00, status: 'active' },
  { key: '3', bank: 'Wells Fargo', accountNumber: '****9012', iban: 'US12WFG456789123', currency: 'USD', balance: 85000.00, status: 'active' },
];

export default function BankPage() {
  const { t } = useTranslation();

  const columns = [
    { title: t('accounting.bankAccounts.bank'), dataIndex: 'bank', key: 'bank' },
    { title: t('accounting.bankAccounts.account'), dataIndex: 'accountNumber', key: 'accountNumber' },
    { title: t('accounting.bankAccounts.iban'), dataIndex: 'iban', key: 'iban' },
    { title: t('accounting.bankAccounts.currency'), dataIndex: 'currency', key: 'currency' },
    { title: t('accounting.bankAccounts.balance'), dataIndex: 'balance', key: 'balance', render: (v: number) => '$' + v.toLocaleString() },
    { title: t('accounting.bankAccounts.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('accounting.bankAccounts.title')} subtitle={t('accounting.bankAccounts.subtitle')} onAdd={() => {}} addLabel={t('accounting.bankAccounts.addAccount')} />
      <Card><Table columns={columns} dataSource={accounts} /></Card>
    </div>
  );
}
