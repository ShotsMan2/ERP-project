import { useState } from 'react';
import { Card, Button, Tag, Avatar, Typography, Badge, Modal, Descriptions, Space, message, Dropdown } from 'antd';
import { PlusOutlined, UserOutlined, MoreOutlined, RightOutlined } from '@ant-design/icons';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  score: number;
  stage: string;
  appliedDate: string;
  avatar?: string;
}

interface Stage {
  id: string;
  title: string;
  color: string;
  candidates: Candidate[];
}

const initialStages: Stage[] = [
  {
    id: 'sourced', title: 'Sourced', color: '#8c8c8c',
    candidates: [
      { id: 'c1', name: 'Alice Wonder', email: 'alice@email.com', phone: '+1-555-0201', position: 'Senior Developer', score: 75, stage: 'sourced', appliedDate: '2024-12-10' },
      { id: 'c2', name: 'Bob Builder', email: 'bob@email.com', phone: '+1-555-0202', position: 'DevOps Engineer', score: 82, stage: 'sourced', appliedDate: '2024-12-12' },
    ],
  },
  {
    id: 'screening', title: 'Screening', color: '#1677ff',
    candidates: [
      { id: 'c3', name: 'Charlie Brown', email: 'charlie@email.com', phone: '+1-555-0203', position: 'Frontend Developer', score: 68, stage: 'screening', appliedDate: '2024-12-08' },
    ],
  },
  {
    id: 'interview', title: 'Interview', color: '#faad14',
    candidates: [
      { id: 'c4', name: 'Diana Prince', email: 'diana@email.com', phone: '+1-555-0204', position: 'Product Manager', score: 91, stage: 'interview', appliedDate: '2024-12-05' },
      { id: 'c5', name: 'Eve Adams', email: 'eve@email.com', phone: '+1-555-0205', position: 'UX Designer', score: 88, stage: 'interview', appliedDate: '2024-12-06' },
    ],
  },
  {
    id: 'offer', title: 'Offer', color: '#52c41a',
    candidates: [
      { id: 'c6', name: 'Frank Castle', email: 'frank@email.com', phone: '+1-555-0206', position: 'Backend Developer', score: 95, stage: 'offer', appliedDate: '2024-12-01' },
    ],
  },
  {
    id: 'hired', title: 'Hired', color: '#13c2c2',
    candidates: [
      { id: 'c7', name: 'Grace Hopper', email: 'grace@email.com', phone: '+1-555-0207', position: 'Data Scientist', score: 97, stage: 'hired', appliedDate: '2024-11-20' },
    ],
  },
  {
    id: 'rejected', title: 'Rejected', color: '#ff4d4f',
    candidates: [
      { id: 'c8', name: 'Henry Hill', email: 'henry@email.com', phone: '+1-555-0208', position: 'Marketing Lead', score: 45, stage: 'rejected', appliedDate: '2024-12-03' },
    ],
  },
];

const scoreColor = (score: number) => {
  if (score >= 90) return 'green';
  if (score >= 70) return 'blue';
  if (score >= 50) return 'orange';
  return 'red';
};

const RecruitmentPipeline: React.FC = () => {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const moveCandidate = (candidate: Candidate, targetStageId: string) => {
    const newStages = stages.map((stage) => ({
      ...stage,
      candidates: stage.candidates.filter((c) => c.id !== candidate.id),
    }));
    const targetStage = newStages.find((s) => s.id === targetStageId);
    if (targetStage) {
      targetStage.candidates.push({ ...candidate, stage: targetStageId });
    }
    setStages(newStages);
    message.success(`${candidate.name} moved to ${targetStage?.title}`);
  };

  const getStageActions = (candidate: Candidate) => {
    const currentIdx = stages.findIndex((s) => s.id === candidate.stage);
    const items: any[] = [];
    stages.forEach((stage, idx) => {
      if (idx !== currentIdx) {
        items.push({
          key: stage.id,
          label: (idx > currentIdx ? 'Move to ' : 'Move back to ') + stage.title,
          onClick: () => moveCandidate(candidate, stage.id),
        });
      }
    });
    return items;
  };

  return (
    <div className="p-6">
      <PageHeader title="Recruitment Pipeline" subtitle="Track candidates through the hiring process">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('Opening new candidate form')}>
          Add Candidate
        </Button>
      </PageHeader>

      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
        {stages.map((stage) => (
          <div key={stage.id} className="min-w-[260px] flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge color={stage.color} />
                <Text strong>{stage.title}</Text>
                <Tag>{stage.candidates.length}</Tag>
              </div>
            </div>

            <div className="space-y-3">
              {stage.candidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  size="small"
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar icon={<UserOutlined />} size={32} />
                      <div>
                        <Text strong className="text-sm">{candidate.name}</Text>
                        <br />
                        <Text type="secondary" className="text-xs">{candidate.position}</Text>
                      </div>
                    </div>
                    <Dropdown menu={{ items: getStageActions(candidate) }} trigger={['click']}>
                      <Button type="text" size="small" icon={<MoreOutlined />} />
                    </Dropdown>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <Tag color={scoreColor(candidate.score)}>{candidate.score}%</Tag>
                    <Text type="secondary" className="text-xs">{candidate.appliedDate}</Text>
                  </div>
                </Card>
              ))}

              {stage.candidates.length === 0 && (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <Text type="secondary" className="text-sm">No candidates</Text>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={selectedCandidate?.name}
        open={!!selectedCandidate}
        onCancel={() => setSelectedCandidate(null)}
        footer={null}
        width={480}
      >
        {selectedCandidate && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Name">{selectedCandidate.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedCandidate.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedCandidate.phone}</Descriptions.Item>
            <Descriptions.Item label="Position">{selectedCandidate.position}</Descriptions.Item>
            <Descriptions.Item label="Score"><Tag color={scoreColor(selectedCandidate.score)}>{selectedCandidate.score}%</Tag></Descriptions.Item>
            <Descriptions.Item label="Applied">{selectedCandidate.appliedDate}</Descriptions.Item>
            <Descriptions.Item label="Stage"><Tag>{selectedCandidate.stage}</Tag></Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default RecruitmentPipeline;
