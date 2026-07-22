import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

const data = [
  { key: '1', employee: 'John Doe', gross: 8500, deductions: 2100, net: 6400, period: '2026-06', status: 'paid' },
  { key: '2', employee: 'Jane Smith', gross: 7200, deductions: 1800, net: 5400, period: '2026-06', status: 'paid' },
  { key: '3', employee: 'Bob Wilson', gross: 5500, deductions: 1400, net: 4100, period: '2026-07', status: 'processing' },
];

export default function PayrollPage() {
  const { t } = useTranslation();

  const columns = [
    { title: t('hr.employee'), dataIndex: 'employee', key: 'employee' },
    { title: t('hr.gross'), dataIndex: 'gross', key: 'gross', render: (v: number) => `$${v.toLocaleString()}` },
    { title: t('hr.deductions'), dataIndex: 'deductions', key: 'deductions', render: (v: number) => `$${v.toLocaleString()}` },
    { title: t('hr.net'), dataIndex: 'net', key: 'net', render: (v: number) => `$${v.toLocaleString()}` },
    { title: t('hr.period'), dataIndex: 'period', key: 'period' },
    { title: t('hr.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'paid' ? 'green' : 'orange'}>{s === 'paid' ? t('hr.paid') : t('hr.processing')}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('hr.payrollTitle')} subtitle={t('hr.managePayroll')} onAdd={() => {}} addLabel={t('hr.newPayrollRun')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
