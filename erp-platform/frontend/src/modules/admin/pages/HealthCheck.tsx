import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Tag, Typography, Progress, Button, Space, Spin, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, ReloadOutlined } from '@ant-design/icons';
import PageHeader from '@/components/ui/PageHeader';
import { adminService, HealthCheck as HealthCheckType } from '@/services/adminService';
const { Text } = Typography;

const serviceLabels: Record<string, string> = {
  api_server: 'API Server', database: 'Database (PostgreSQL)', redis: 'Cache (Redis)',
  rabbitmq: 'Queue (RabbitMQ)', elasticsearch: 'Search (Elasticsearch)',
  celery_worker: 'Celery Worker', minio: 'Storage (S3)', websocket: 'WebSocket Server',
};

const statusColors: Record<string, string> = { healthy: '#52c41a', degraded: '#faad14', down: '#ff4d4f' };
const statusIcons: Record<string, React.ReactNode> = {
  healthy: <CheckCircleOutlined />, degraded: <WarningOutlined />, down: <CloseCircleOutlined />,
};

const HealthCheck: React.FC = () => {
  const [services, setServices] = useState<HealthCheckType[]>([]);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [overview, setOverview] = useState<{ total_users: number; api_requests_24h: number; uptime_percentage: number } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [healthRes, overviewRes] = await Promise.all([
        adminService.getHealth(),
        adminService.getOverview(),
      ]);
      setServices(healthRes.services || []);
      setOverview(overviewRes);
    } catch {
      message.error('Failed to fetch health data');
    } finally {
      setLoading(false);
    }
  };

  const runCheck = async () => {
    setChecking(true);
    try {
      const results = await adminService.runHealthCheck();
      setServices(results);
      message.success('Health checks completed');
    } catch {
      message.error('Health check failed');
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const healthyCount = services.filter((s) => s.status === 'healthy').length;
  const degradedCount = services.filter((s) => s.status === 'degraded').length;
  const downCount = services.filter((s) => s.status === 'down').length;
  const uptime = services.length > 0 ? (healthyCount / services.length) * 100 : 0;

  return (
    <Spin spinning={loading}>
      <PageHeader title="System Health" subtitle="Monitor system services and performance">
        <Button type="primary" icon={<ReloadOutlined />} onClick={runCheck} loading={checking}>Run Health Check</Button>
      </PageHeader>

      {overview && (
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}><Card><Statistic title="Total Users" value={overview.total_users} /></Card></Col>
          <Col xs={24} sm={8}><Card><Statistic title="API Requests (24h)" value={overview.api_requests_24h} /></Card></Col>
          <Col xs={24} sm={8}><Card><Statistic title="Uptime" value={overview.uptime_percentage} suffix="%" precision={2} valueStyle={{ color: overview.uptime_percentage > 99 ? '#52c41a' : '#faad14' }} /></Card></Col>
        </Row>
      )}

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}><Card><Statistic title="Healthy" value={healthyCount} suffix={'/ ' + services.length} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Degraded" value={degradedCount} prefix={<WarningOutlined />} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Down" value={downCount} prefix={<CloseCircleOutlined />} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
      </Row>

      <Card title="Service Status">
        <Row gutter={[16, 16]}>
          {services.map((s) => {
            const label = serviceLabels[s.service_name] || s.service_name;
            const latencyStr = s.latency_ms ? `${s.latency_ms.toFixed(1)}ms` : 'N/A';
            return (
              <Col xs={24} sm={12} lg={6} key={s.service_name}>
                <Card size="small" className={s.status === 'down' ? 'bg-red-50' : s.status === 'degraded' ? 'bg-orange-50' : ''}>
                  <div className="flex items-center justify-between mb-2">
                    <Text strong>{label}</Text>
                    <Tag icon={statusIcons[s.status]} color={statusColors[s.status]}>{s.status.toUpperCase()}</Tag>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><Text type="secondary">Latency</Text><Text>{latencyStr}</Text></div>
                    <div className="flex justify-between"><Text type="secondary">Checked</Text><Text>{new Date(s.checked_at).toLocaleTimeString()}</Text></div>
                    {s.error_message && <Text type="danger" className="text-xs block mt-2">{s.error_message}</Text>}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
        <div className="mt-6">
          <Text strong>Overall System Health</Text>
          <Progress percent={Math.round(uptime)} status={downCount > 0 ? 'exception' : degradedCount > 0 ? 'active' : 'success'} />
        </div>
      </Card>
    </Spin>
  );
};

export default HealthCheck;
