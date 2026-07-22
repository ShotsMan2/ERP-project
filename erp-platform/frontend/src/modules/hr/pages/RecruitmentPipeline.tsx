import React, { useState, DragEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Tag, Avatar, Typography, Badge, Modal, Descriptions, Dropdown, message, Tooltip, Progress } from 'antd';
import { PlusOutlined, UserOutlined, MoreOutlined, FireOutlined, ThunderboltOutlined, DragOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';

const { Text, Title } = Typography;

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
      { id: 'c1', name: 'Alice Wonder', email: 'alice@email.com', phone: '+1-555-0201', position: 'Senior Developer', score: 75, stage: 'sourced', appliedDate: '2024-12-10', avatar: 'https://i.pravatar.cc/150?u=a' },
      { id: 'c2', name: 'Bob Builder', email: 'bob@email.com', phone: '+1-555-0202', position: 'DevOps Engineer', score: 82, stage: 'sourced', appliedDate: '2024-12-12', avatar: 'https://i.pravatar.cc/150?u=b' },
    ],
  },
  {
    id: 'screening', title: 'Screening', color: '#1677ff',
    candidates: [
      { id: 'c3', name: 'Charlie Brown', email: 'charlie@email.com', phone: '+1-555-0203', position: 'Frontend Developer', score: 68, stage: 'screening', appliedDate: '2024-12-08', avatar: 'https://i.pravatar.cc/150?u=c' },
    ],
  },
  {
    id: 'interview', title: 'Interview', color: '#faad14',
    candidates: [
      { id: 'c4', name: 'Diana Prince', email: 'diana@email.com', phone: '+1-555-0204', position: 'Product Manager', score: 95, stage: 'interview', appliedDate: '2024-12-05', avatar: 'https://i.pravatar.cc/150?u=d' },
      { id: 'c5', name: 'Eve Adams', email: 'eve@email.com', phone: '+1-555-0205', position: 'UX Designer', score: 88, stage: 'interview', appliedDate: '2024-12-06', avatar: 'https://i.pravatar.cc/150?u=e' },
    ],
  },
  {
    id: 'offer', title: 'Offer', color: '#52c41a',
    candidates: [
      { id: 'c6', name: 'Frank Castle', email: 'frank@email.com', phone: '+1-555-0206', position: 'Backend Developer', score: 98, stage: 'offer', appliedDate: '2024-12-01', avatar: 'https://i.pravatar.cc/150?u=f' },
    ],
  },
  {
    id: 'hired', title: 'Hired', color: '#13c2c2',
    candidates: [
      { id: 'c7', name: 'Grace Hopper', email: 'grace@email.com', phone: '+1-555-0207', position: 'Data Scientist', score: 99, stage: 'hired', appliedDate: '2024-11-20', avatar: 'https://i.pravatar.cc/150?u=g' },
    ],
  },
  {
    id: 'rejected', title: 'Rejected', color: '#ff4d4f',
    candidates: [],
  },
];

const scoreColor = (score: number) => {
  if (score >= 90) return '#52c41a';
  if (score >= 70) return '#1677ff';
  if (score >= 50) return '#faad14';
  return '#ff4d4f';
};

const RecruitmentPipeline: React.FC = () => {
  const { t } = useTranslation();
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null);

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

  const handleDragStart = (e: DragEvent, candidate: Candidate) => {
    setDraggedCandidate(candidate);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: DragEvent, stageId: string) => {
    e.preventDefault();
    if (draggedCandidate && draggedCandidate.stage !== stageId) {
      moveCandidate(draggedCandidate, stageId);
    }
    setDraggedCandidate(null);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <PageHeader title={t('hr.recruitmentPipelineTitle')} subtitle="Drag and drop candidates across stages">
          <Button type="primary" size="large" className="rounded-lg shadow-blue-500/30 shadow-lg" icon={<PlusOutlined />}>
            New Candidate
          </Button>
        </PageHeader>
      </motion.div>

      <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-200px)] min-h-[600px] snap-x pt-2">
        {stages.map((stage, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            key={stage.id} 
            className="min-w-[320px] flex-shrink-0 snap-center flex flex-col bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-200/60 dark:border-gray-700/50 backdrop-blur-sm"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="p-4 border-b border-gray-200/60 dark:border-gray-700/50 flex items-center justify-between sticky top-0 bg-inherit rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                <Title level={5} className="!mb-0 dark:text-gray-200">{stage.title}</Title>
                <Tag className="rounded-full px-2 border-0 bg-white dark:bg-gray-700 dark:text-gray-300 shadow-sm">
                  {stage.candidates.length}
                </Tag>
              </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              <AnimatePresence>
                {stage.candidates.map((candidate) => (
                  <motion.div
                    key={candidate.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    draggable
                    onDragStart={(e: any) => handleDragStart(e, candidate)}
                  >
                    <Card
                      size="small"
                      className="cursor-grab active:cursor-grabbing rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200/80 dark:border-gray-700 dark:bg-gray-800"
                      bodyStyle={{ padding: '16px' }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={candidate.avatar} icon={<UserOutlined />} size={40} className="shadow-sm" />
                          <div>
                            <Text className="font-semibold text-sm block dark:text-gray-200">{candidate.name}</Text>
                            <Text type="secondary" className="text-xs">{candidate.position}</Text>
                          </div>
                        </div>
                        <Tooltip title="Drag to move">
                          <DragOutlined className="text-gray-400 hover:text-gray-600" />
                        </Tooltip>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                         <div className="flex-1">
                           <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                             <span>AI Score</span>
                             <span className="font-bold" style={{ color: scoreColor(candidate.score) }}>{candidate.score}%</span>
                           </div>
                           <Progress percent={candidate.score} showInfo={false} size="small" strokeColor={scoreColor(candidate.score)} trailColor="rgba(0,0,0,0.05)" />
                         </div>
                         {candidate.score >= 90 && <Tooltip title="Top Candidate"><FireOutlined className="text-red-500" /></Tooltip>}
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                        <Text type="secondary" className="text-[11px]">{candidate.appliedDate}</Text>
                        <Button type="link" size="small" onClick={() => setSelectedCandidate(candidate)} className="text-xs p-0 h-auto">View Profile</Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {stage.candidates.length === 0 && (
                <div className="h-32 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <Text type="secondary" className="text-sm">Drop candidates here</Text>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <Modal
        title={<div className="flex items-center gap-3"><Avatar src={selectedCandidate?.avatar} /><span className="text-lg">{selectedCandidate?.name}</span></div>}
        open={!!selectedCandidate}
        onCancel={() => setSelectedCandidate(null)}
        footer={null}
        width={600}
        centered
        className="backdrop-blur-sm"
      >
        {selectedCandidate && (
          <div className="mt-4">
             <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                 <Text type="secondary" className="text-xs block mb-1">Position</Text>
                 <Text strong>{selectedCandidate.position}</Text>
               </div>
               <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex items-center justify-between">
                 <div>
                    <Text type="secondary" className="text-xs block mb-1">AI Match Score</Text>
                    <Text strong className="text-xl" style={{ color: scoreColor(selectedCandidate.score) }}>{selectedCandidate.score}%</Text>
                 </div>
                 <Progress type="circle" percent={selectedCandidate.score} size={40} strokeColor={scoreColor(selectedCandidate.score)} format={() => <ThunderboltOutlined />} />
               </div>
             </div>
             
            <Descriptions column={1} bordered size="small" className="bg-white dark:bg-transparent">
              <Descriptions.Item label="Email">{selectedCandidate.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedCandidate.phone}</Descriptions.Item>
              <Descriptions.Item label="Applied On">{selectedCandidate.appliedDate}</Descriptions.Item>
              <Descriptions.Item label="Current Stage">
                <Tag color={stages.find(s => s.id === selectedCandidate.stage)?.color} className="rounded-full px-3">{stages.find(s => s.id === selectedCandidate.stage)?.title}</Tag>
              </Descriptions.Item>
            </Descriptions>
            
            <div className="mt-6 flex justify-end gap-3">
               <Button onClick={() => setSelectedCandidate(null)}>Close</Button>
               <Button type="primary">Schedule Interview</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RecruitmentPipeline;
