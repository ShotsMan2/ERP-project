import { Card, Table, Tag, Badge } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', candidate: 'Mike Johnson', position: 'Senior Developer', stage: 'Interview', appliedDate: '2026-07-15', rating: 4 },
  { key: '2', candidate: 'Sarah Lee', position: 'Marketing Specialist', stage: 'Screening', appliedDate: '2026-07-18', rating: 3 },
  { key: '3', candidate: 'Tom Harris', position: 'Sales Manager', stage: 'Offer', appliedDate: '2026-07-10', rating: 5 },
];

const columns = [
  { title: 'Candidate', dataIndex: 'candidate', key: 'candidate' },
  { title: 'Position', dataIndex: 'position', key: 'position' },
  { title: 'Stage', dataIndex: 'stage', key: 'stage', render: (s: string) => <Tag color="blue">{s}</Tag> },
  { title: 'Applied Date', dataIndex: 'appliedDate', key: 'appliedDate' },
  { title: 'Rating', dataIndex: 'rating', key: 'rating', render: (r: number) => <Badge count={r} style={{ backgroundColor: r >= 4 ? '#52c41a' : r >= 3 ? '#faad14' : '#ff4d4f' }} /> },
];

export default function RecruitmentPage() {
  return (
    <div>
      <PageHeader title="Recruitment" subtitle="Manage job postings and candidates" onAdd={() => {}} addLabel="New Job Post" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
