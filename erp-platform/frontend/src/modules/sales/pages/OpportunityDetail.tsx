import { Card, Descriptions, Tag, Table, Row, Col, Statistic, Typography, Progress, Timeline, Space, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

const mockOpp = { name: 'Full ERP Suite', company: 'Beta Solutions', value: 250000, stage: 'proposal', probability: 60, assignedTo: 'Mike Brown', expectedClose: '2025-01-31', created: '2024-11-15', description: 'Comprehensive ERP implementation including finance, HR, inventory, and sales modules.' };
const stages = [
  { name: 'Qualification', pct: 100, date: '2024-11-20' },
  { name: 'Discovery', pct: 100, date: '2024-12-05' },
  { name: 'Proposal', pct: 60, date: '' },
  { name: 'Negotiation', pct: 0, date: '' },
  { name: 'Closed Won', pct: 0, date: '' },
];
const activities = [
  { action: 'Proposal sent', user: 'Mike Brown', date: '2024-12-15', type: 'email' },
  { action: 'Discovery call completed', user: 'Mike Brown', date: '2024-12-05', type: 'call' },
  { action: 'Initial meeting', user: 'Sarah Johnson', date: '2024-11-20', type: 'meeting' },
];

const OpportunityDetail: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <PageHeader title={mockOpp.name} subtitle={mockOpp.company} onBack={() => navigate('/sales/opportunities')}>
        <Button type="primary" icon={<EditOutlined />}>{t('sales.opportunityDetail.editOpportunity')}</Button>
      </PageHeader>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}><Card><Statistic title={t('sales.opportunityDetail.dealValue')} value={mockOpp.value} prefix="$" precision={0} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title={t('sales.opportunityDetail.probability')} value={mockOpp.probability} suffix="%" /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title={t('sales.opportunityDetail.stage')} value={mockOpp.stage.replace('_', ' ')} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title={t('sales.opportunityDetail.expectedClose')} value={mockOpp.expectedClose} /></Card></Col>
      </Row>
      <Card>
        <Row gutter={24}>
          <Col span={16}>
            <Descriptions bordered column={2} size="small" className="mb-6">
              <Descriptions.Item label={t('sales.opportunityDetail.opportunityName')}>{mockOpp.name}</Descriptions.Item>
              <Descriptions.Item label={t('sales.opportunityDetail.company')}>{mockOpp.company}</Descriptions.Item>
              <Descriptions.Item label={t('sales.opportunityDetail.dealValue')}>${mockOpp.value.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label={t('sales.opportunityDetail.probability')}><Progress percent={mockOpp.probability} size="small" style={{ width: 120 }} /></Descriptions.Item>
              <Descriptions.Item label={t('sales.opportunityDetail.stage')}><Tag color="gold">{mockOpp.stage.replace('_', ' ')}</Tag></Descriptions.Item>
              <Descriptions.Item label={t('sales.opportunityDetail.assignedTo')}>{mockOpp.assignedTo}</Descriptions.Item>
              <Descriptions.Item label={t('sales.opportunityDetail.expectedClose')}>{mockOpp.expectedClose}</Descriptions.Item>
              <Descriptions.Item label={t('sales.opportunityDetail.created')}>{mockOpp.created}</Descriptions.Item>
              <Descriptions.Item label={t('sales.opportunityDetail.description')} span={2}>{mockOpp.description}</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={8}>
            <Card title={t('sales.opportunityDetail.stageProgress')} size="small" className="mb-4">
              <Space direction="vertical" className="w-full">
                {stages.map((s) => (
                  <div key={s.name}><div className="flex justify-between text-sm"><Text>{s.name}</Text><Text type="secondary">{s.pct}%</Text></div><Progress percent={s.pct} size="small" /></div>
                ))}
              </Space>
            </Card>
            <Card title={t('sales.opportunityDetail.activities')} size="small">
              <Timeline items={activities.map((a) => ({ children: <><Text strong className="text-sm">{a.action}</Text><br /><Text type="secondary" className="text-xs">{a.user} • {a.date} • {a.type}</Text></> }))} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
export default OpportunityDetail;
