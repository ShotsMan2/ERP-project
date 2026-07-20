import { Card, Row, Col, Statistic, Tag, Typography, Progress, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

interface HealthItem { name: string; status: 'healthy' | 'degraded' | 'down'; latency: string; uptime: string; details: string; }
const services: HealthItem[] = [
  { name: 'API Server', status: 'healthy', latency: '45ms', uptime: '99.98%', details: '8 pods running, 45% CPU' },
  { name: 'Database (PostgreSQL)', status: 'healthy', latency: '12ms', uptime: '99.99%', details: 'Primary + 2 replicas, 60% storage' },
  { name: 'Cache (Redis)', status: 'healthy', latency: '3ms', uptime: '99.95%', details: 'Cluster 6 nodes, 45% memory' },
  { name: 'Queue (RabbitMQ)', status: 'degraded', latency: '120ms', uptime: '99.80%', details: '5 queues, 1 dead-letter alert' },
  { name: 'Search (Elasticsearch)', status: 'healthy', latency: '25ms', uptime: '99.97%', details: '3 nodes, 120k docs indexed' },
  { name: 'Storage (S3)', status: 'healthy', latency: '80ms', uptime: '99.99%', details: '2.4 TB used of 10 TB' },
  { name: 'WebSocket Server', status: 'healthy', latency: '15ms', uptime: '99.95%', details: '142 connected clients' },
  { name: 'Email Service', status: 'down', latency: 'N/A', uptime: '95.20%', details: 'SMTP relay unreachable' },
];

const statusColors: Record<string, string> = { healthy: '#52c41a', degraded: '#faad14', down: '#ff4d4f' };
const statusIcons: Record<string, React.ReactNode> = { healthy: <CheckCircleOutlined />, degraded: <WarningOutlined />, down: <CloseCircleOutlined /> };

const HealthCheck: React.FC = () => {
  const healthyCount = services.filter((s) => s.status === 'healthy').length;
  const degradedCount = services.filter((s) => s.status === 'degraded').length;
  const downCount = services.filter((s) => s.status === 'down').length;
  const uptime = (healthyCount / services.length) * 100;

  return (
    <div className="p-6">
      <PageHeader title="System Health" subtitle="Monitor system services and performance" />
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}><Card><Statistic title="Healthy" value={healthyCount} suffix={'/ ' + services.length} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Degraded" value={degradedCount} prefix={<WarningOutlined />} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Down" value={downCount} prefix={<CloseCircleOutlined />} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
      </Row>
      <Card title="Service Status">
        <Row gutter={[16, 16]}>
          {services.map((s) => (
            <Col xs={24} sm={12} lg={6} key={s.name}>
              <Card size="small" className={s.status === 'down' ? 'bg-red-50' : s.status === 'degraded' ? 'bg-orange-50' : ''}>
                <div className="flex items-center justify-between mb-2">
                  <Text strong>{s.name}</Text>
                  <Tag icon={statusIcons[s.status]} color={statusColors[s.status]}>{s.status.toUpperCase()}</Tag>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><Text type="secondary">Latency</Text><Text>{s.latency}</Text></div>
                  <div className="flex justify-between"><Text type="secondary">Uptime</Text><Text>{s.uptime}</Text></div>
                  <Text type="secondary" className="text-xs block mt-2">{s.details}</Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="mt-6">
          <Text strong>Overall System Health</Text>
          <Progress percent={Math.round(uptime)} status={downCount > 0 ? 'exception' : degradedCount > 0 ? 'active' : 'success'} />
        </div>
      </Card>
    </div>
  );
};
export default HealthCheck;
