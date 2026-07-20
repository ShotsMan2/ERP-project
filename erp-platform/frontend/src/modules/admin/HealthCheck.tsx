import { Row, Col, Card, Statistic, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { GaugeChart } from '@/components/charts/GaugeChart';

const services = [
  { name: 'API Server', status: 'healthy', uptime: '15d 7h 32m', responseTime: '45ms' },
  { name: 'Database', status: 'healthy', uptime: '30d 2h 15m', responseTime: '12ms' },
  { name: 'Redis Cache', status: 'healthy', uptime: '30d 2h 15m', responseTime: '2ms' },
  { name: 'Queue Worker', status: 'healthy', uptime: '15d 7h 30m', responseTime: '-ms' },
  { name: 'Search Index', status: 'degraded', uptime: '15d 7h 00m', responseTime: '250ms' },
];

export default function HealthCheck() {
  return (
    <div>
      <PageHeader title="Health Check" subtitle="System health monitoring" />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={8}>
          <Card>
            <GaugeChart value={98.5} title="System Uptime" height={250} />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={16}>
          <Card title="Services">
            {services.map((s) => (
              <div key={s.name} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  {s.status === 'healthy' ? <CheckCircleOutlined className="text-success" /> : <CloseCircleOutlined className="text-warning" />}
                  <span className="font-medium">{s.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">{s.uptime}</span>
                  <span className="text-gray-400">{s.responseTime}</span>
                  <Tag color={s.status === 'healthy' ? 'green' : 'orange'}>{s.status}</Tag>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
