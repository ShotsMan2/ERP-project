import { useState } from 'react';
import { Card, Button, Tag, Typography, Badge, Modal, Descriptions, message, Dropdown, Progress } from 'antd';
import { PlusOutlined, MoreOutlined, DollarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { motion, Variants } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

interface Opportunity { id: string; name: string; company: string; value: number; stage: string; probability: number; assignedTo: string; expectedClose: string; }

const allStages = [
  { id: 'qualification', title: 'Qualification', color: '#8c8c8c' },
  { id: 'discovery', title: 'Discovery', color: '#1677ff' },
  { id: 'proposal', title: 'Proposal', color: '#faad14' },
  { id: 'negotiation', title: 'Negotiation', color: '#722ed1' },
  { id: 'closed_won', title: 'Closed Won', color: '#52c41a' },
  { id: 'closed_lost', title: 'Closed Lost', color: '#ff4d4f' },
];

const initialOpps: Record<string, Opportunity[]> = {
  qualification: [
    { id: 'o1', name: 'ERP Implementation', company: 'Acme Corp', value: 150000, stage: 'qualification', probability: 20, assignedTo: 'Sarah Johnson', expectedClose: '2025-03-15' },
    { id: 'o2', name: 'Cloud Migration', company: 'TechStart Inc.', value: 85000, stage: 'qualification', probability: 15, assignedTo: 'Mike Brown', expectedClose: '2025-04-01' },
  ],
  discovery: [
    { id: 'o3', name: 'HR Module Upgrade', company: 'GlobalTech', value: 45000, stage: 'discovery', probability: 35, assignedTo: 'Sarah Johnson', expectedClose: '2025-02-28' },
  ],
  proposal: [
    { id: 'o4', name: 'Full ERP Suite', company: 'Beta Solutions', value: 250000, stage: 'proposal', probability: 60, assignedTo: 'Mike Brown', expectedClose: '2025-01-31' },
  ],
  negotiation: [
    { id: 'o5', name: 'Inventory System', company: 'Delta Industries', value: 95000, stage: 'negotiation', probability: 80, assignedTo: 'Sarah Johnson', expectedClose: '2025-01-15' },
  ],
  closed_won: [
    { id: 'o6', name: 'Analytics Dashboard', company: 'Gamma LLC', value: 35000, stage: 'closed_won', probability: 100, assignedTo: 'Mike Brown', expectedClose: '2024-12-20' },
  ],
  closed_lost: [
    { id: 'o7', name: 'Mobile App', company: 'StartupXYZ', value: 25000, stage: 'closed_lost', probability: 0, assignedTo: 'Sarah Johnson', expectedClose: '2024-12-01' },
  ],
};

const OpportunityKanban: React.FC = () => {
  const { t } = useTranslation();
  const [opportunities, setOpportunities] = useState(initialOpps);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  const stageTitles: Record<string, string> = {
    qualification: t('sales.opportunityKanban.qualification'),
    discovery: t('sales.opportunityKanban.discovery'),
    proposal: t('sales.opportunityKanban.proposal'),
    negotiation: t('sales.opportunityKanban.negotiation'),
    closed_won: t('sales.opportunityKanban.closedWon'),
    closed_lost: t('sales.opportunityKanban.closedLost'),
  };

  const moveOpp = (opp: Opportunity, targetStage: string) => {
    const newOpps = { ...opportunities };
    for (const stage of allStages) {
      newOpps[stage.id] = newOpps[stage.id].filter((o) => o.id !== opp.id);
    }
    newOpps[targetStage] = [...(newOpps[targetStage] || []), { ...opp, stage: targetStage }];
    setOpportunities(newOpps);
    message.success(opp.name + ' ' + t('sales.opportunityKanban.moveTo') + stageTitles[targetStage]);
  };

  const stageActions = (opp: Opportunity) => {
    const currentIdx = allStages.findIndex((s) => s.id === opp.stage);
    return allStages.filter((_, idx) => idx !== currentIdx).map((s) => ({
      key: s.id, label: (s.id === 'closed_won' || s.id === 'closed_lost' ? t('sales.opportunityKanban.closeAs') : t('sales.opportunityKanban.moveTo')) + stageTitles[s.id],
      onClick: () => moveOpp(opp, s.id),
    }));
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200 } }
  };

  return (
    <div className="p-6">
      <PageHeader title={t('sales.opportunityKanban.title')} subtitle={t('sales.opportunityKanban.subtitle')}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('Opening new opportunity form')}>{t('sales.opportunityKanban.addOpportunity')}</Button>
      </PageHeader>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
        {allStages.map((stage) => {
          const opps = opportunities[stage.id] || [];
          const totalValue = opps.reduce((s, o) => s + o.value, 0);
          return (
            <div key={stage.id} className="min-w-[280px] flex-shrink-0 bg-opacity-50 dark:bg-opacity-20 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <Badge color={stage.color} />
                  <Text strong className="dark:text-gray-200">{stageTitles[stage.id]}</Text>
                  <Tag className="rounded-full border-none bg-white dark:bg-gray-700 dark:text-gray-300">{opps.length}</Tag>
                </div>
                <Text type="secondary" className="text-xs font-semibold text-gray-500 dark:text-gray-400">${(totalValue / 1000).toFixed(0)}k</Text>
              </div>
              <div className="space-y-3">
                {opps.map((opp) => (
                  <motion.div variants={cardVariants} key={opp.id}>
                    <Card size="small" className="cursor-pointer hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-700 dark:bg-gray-800" onClick={() => setSelectedOpp(opp)}>
                      <div className="flex items-start justify-between">
                        <div>
                          <Text strong className="text-sm dark:text-white">{opp.name}</Text>
                          <br />
                          <Text type="secondary" className="text-xs">{opp.company}</Text>
                        </div>
                        <Dropdown menu={{ items: stageActions(opp) }} trigger={['click']}>
                          <Button type="text" size="small" icon={<MoreOutlined className="dark:text-gray-400" />} onClick={(e) => e.stopPropagation()} />
                        </Dropdown>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1"><Text type="secondary">{t('sales.opportunityKanban.probability')}</Text><Text className="dark:text-gray-300">{opp.probability}%</Text></div>
                        <Progress percent={opp.probability} size="small" showInfo={false} strokeColor={stage.color} />
                      </div>
                      <div className="flex justify-between mt-2 items-center">
                        <Tag icon={<DollarOutlined />} className="border-none bg-green-50 dark:bg-green-900 dark:text-green-300 text-green-700">${(opp.value / 1000).toFixed(0)}k</Tag>
                        <Text type="secondary" className="text-xs">{opp.expectedClose}</Text>
                      </div>
                    </Card>
                  </motion.div>
                ))}
                {opps.length === 0 && <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center"><Text type="secondary" className="text-xs">{t('sales.opportunityKanban.noOpportunities')}</Text></div>}
              </div>
            </div>
          );
        })}
      </motion.div>

      <Modal title={selectedOpp?.name} open={!!selectedOpp} onCancel={() => setSelectedOpp(null)} footer={null} width={480} className="dark-modal">
        {selectedOpp && (
          <Descriptions column={1} bordered size="small" className="dark-descriptions">
            <Descriptions.Item label={t('sales.opportunityKanban.opportunity')}>{selectedOpp.name}</Descriptions.Item>
            <Descriptions.Item label={t('sales.opportunityKanban.company')}>{selectedOpp.company}</Descriptions.Item>
            <Descriptions.Item label={t('sales.opportunityKanban.value')}>${selectedOpp.value.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label={t('sales.opportunityKanban.stage')}><Tag color={allStages.find((s) => s.id === selectedOpp.stage)?.color}>{selectedOpp.stage}</Tag></Descriptions.Item>
            <Descriptions.Item label={t('sales.opportunityKanban.probability')}><Progress percent={selectedOpp.probability} size="small" /></Descriptions.Item>
            <Descriptions.Item label={t('sales.opportunityKanban.assignedTo')}>{selectedOpp.assignedTo}</Descriptions.Item>
            <Descriptions.Item label={t('sales.opportunityKanban.expectedClose')}>{selectedOpp.expectedClose}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};
export default OpportunityKanban;
