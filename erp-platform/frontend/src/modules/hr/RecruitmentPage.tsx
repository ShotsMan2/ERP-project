import { Card, Table, Tag, Badge } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

const data = [
  { key: '1', candidate: 'Mike Johnson', position: 'Senior Developer', stage: 'Interview', appliedDate: '2026-07-15', rating: 4 },
  { key: '2', candidate: 'Sarah Lee', position: 'Marketing Specialist', stage: 'Screening', appliedDate: '2026-07-18', rating: 3 },
  { key: '3', candidate: 'Tom Harris', position: 'Sales Manager', stage: 'Offer', appliedDate: '2026-07-10', rating: 5 },
];

export default function RecruitmentPage() {
  const { t } = useTranslation();

  const columns = [
    { title: t('hr.candidate'), dataIndex: 'candidate', key: 'candidate' },
    { title: t('hr.position'), dataIndex: 'position', key: 'position' },
    { title: t('hr.stage'), dataIndex: 'stage', key: 'stage', render: (s: string) => <Tag color="blue">{s === 'Interview' ? t('hr.interview') : s === 'Screening' ? t('hr.screening') : t('hr.offer')}</Tag> },
    { title: t('hr.appliedDate'), dataIndex: 'appliedDate', key: 'appliedDate' },
    { title: t('hr.rating'), dataIndex: 'rating', key: 'rating', render: (r: number) => <Badge count={r} style={{ backgroundColor: r >= 4 ? '#52c41a' : r >= 3 ? '#faad14' : '#ff4d4f' }} /> },
  ];

  return (
    <div>
      <PageHeader title={t('hr.recruitmentTitle')} subtitle={t('hr.manageJobPostings')} onAdd={() => {}} addLabel={t('hr.newJobPost')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
