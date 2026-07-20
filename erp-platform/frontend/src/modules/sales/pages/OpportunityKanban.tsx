import { useState } from 'react';
import { Card, Button, Tag, Avatar, Typography, Badge, Modal, Descriptions, Space, message, Dropdown, Progress } from 'antd';
import { PlusOutlined, UserOutlined, MoreOutlined, DollarOutlined } from '@ant-design/icons';
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
  const [opportunities, setOpportunities] = useState(initialOpps);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  const moveOpp = (opp: Opportunity, targetStage: string) => {
    const newOpps = { ...opportunities };
    for (const stage of allStages) {
      newOpps[stage.id] = newOpps[stage.id].filter((o) => o.id !== opp.id);
    }
    newOpps[targetStage] = [...(newOpps[targetStage] || []), { ...opp, stage: targetStage }];
    setOpportunities(newOpps);
    message.success(opp.name + ' moved to ' + allStages.find((s) => s.id === targetStage)?.title);
  };

  const stageActions = (opp: Opportunity) => {
    const currentIdx = allStages.findIndex((s) => s.id === opp.stage);
    return allStages.filter((_, idx) => idx !== currentIdx).map((s) => ({
      key: s.id, label: (s.id === 'closed_won' || s.id === 'closed_lost' ? 'Close as ' : 'Move to ') + s.title,
      onClick: () => moveOpp(opp, s.id),
    }));
  };

  return (
    <div className="p-6">
      <PageHeader title="Opportunity Pipeline" subtitle="Track deals through the sales pipeline">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('Opening new opportunity form')}>Add Opportunity</Button>
      </PageHeader>

      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
        {allStages.map((stage) => {
          const opps = opportunities[stage.id] || [];
          const totalValue = opps.reduce((s, o) => s + o.value, 0);
          return (
            <div key={stage.id} className="min-w-[280px] flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge color={stage.color} />
                  <Text strong>{stage.title}</Text>
                  <Tag>{opps.length}</Tag>
                </div>
                <Text type="secondary" className="text-xs">${(totalValue / 1000).toFixed(0)}k</Text>
              </div>
              <div className="space-y-3">
                {opps.map((opp) => (
                  <Card key={opp.id} size="small" className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedOpp(opp)}>
                    <div className="flex items-start justify-between">
                      <div>
                        <Text strong className="text-sm">{opp.name}</Text>
                        <br />
                        <Text type="secondary" className="text-xs">{opp.company}</Text>
                      </div>
                      <Dropdown menu={{ items: stageActions(opp) }} trigger={['click']}>
                        <Button type="text" size="small" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
                      </Dropdown>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1"><Text type="secondary">Probability</Text><Text>{opp.probability}%</Text></div>
                      <Progress percent={opp.probability} size="small" showInfo={false} />
                    </div>
                    <div className="flex justify-between mt-2">
                      <Tag icon={<DollarOutlined />}>${(opp.value / 1000).toFixed(0)}k</Tag>
                      <Text type="secondary" className="text-xs">{opp.expectedClose}</Text>
                    </div>
                  </Card>
                ))}
                {opps.length === 0 && <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center"><Text type="secondary" className="text-sm">No opportunities</Text></div>}
              </div>
            </div>
          );
        })}
      </div>

      <Modal title={selectedOpp?.name} open={!!selectedOpp} onCancel={() => setSelectedOpp(null)} footer={null} width={480}>
        {selectedOpp && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Opportunity">{selectedOpp.name}</Descriptions.Item>
            <Descriptions.Item label="Company">{selectedOpp.company}</Descriptions.Item>
            <Descriptions.Item label="Value">${selectedOpp.value.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Stage"><Tag color={allStages.find((s) => s.id === selectedOpp.stage)?.color}>{selectedOpp.stage}</Tag></Descriptions.Item>
            <Descriptions.Item label="Probability"><Progress percent={selectedOpp.probability} size="small" /></Descriptions.Item>
            <Descriptions.Item label="Assigned To">{selectedOpp.assignedTo}</Descriptions.Item>
            <Descriptions.Item label="Expected Close">{selectedOpp.expectedClose}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};
export default OpportunityKanban;
