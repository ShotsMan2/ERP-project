import { Card, Table, Tag, Rate } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

const data = [
  { key: '1', employee: 'John Doe', reviewer: 'Sarah Johnson', period: 'Q2 2026', rating: 4.5, status: 'completed' },
  { key: '2', employee: 'Jane Smith', reviewer: 'Mark Taylor', period: 'Q2 2026', rating: 3.8, status: 'completed' },
  { key: '3', employee: 'Bob Wilson', reviewer: 'Sarah Johnson', period: 'Q3 2026', rating: 0, status: 'pending' },
];

export default function PerformancePage() {
  const { t } = useTranslation();

  const columns = [
    { title: t('hr.employee'), dataIndex: 'employee', key: 'employee' },
    { title: t('hr.reviewer'), dataIndex: 'reviewer', key: 'reviewer' },
    { title: t('hr.period'), dataIndex: 'period', key: 'period' },
    { title: t('hr.rating'), dataIndex: 'rating', key: 'rating', render: (r: number) => r > 0 ? <Rate disabled value={r} allowHalf /> : '-' },
    { title: t('hr.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'completed' ? 'green' : 'orange'}>{s === 'completed' ? t('hr.completed') : t('hr.pending')}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('hr.performanceReviewsTitle')} subtitle={t('hr.employeePerformance')} onAdd={() => {}} addLabel={t('hr.newReview')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
