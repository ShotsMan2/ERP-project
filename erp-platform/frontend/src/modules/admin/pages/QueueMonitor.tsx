import { Card, Row, Col, Statistic, Table, Tag, Typography, Progress, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

interface Queue { name: string; active: number; waiting: number; scheduled: number; retries: number; failed: number; throughput: number; }
const queues: Queue[] = [
  { name: 'email', active: 12, waiting: 45, scheduled: 120, retries: 3, failed: 1, throughput: 150 },
  { name: 'notifications', active: 8, waiting: 32, scheduled: 80, retries: 2, failed: 0, throughput: 95 },
  { name: 'reports', active: 3, waiting: 15, scheduled: 25, retries: 1, failed: 2, throughput: 20 },
  { name: 'payroll', active: 1, waiting: 0, scheduled: 5, retries: 0, failed: 0, throughput: 5 },
  { name: 'backup', active: 0, waiting: 1, scheduled: 2, retries: 0, failed: 0, throughput: 1 },
];

const QueueMonitor: React.FC = () => {
  const totalActive = queues.reduce((s, q) => s + q.active, 0);
  const totalWaiting = queues.reduce((s, q) => s + q.waiting, 0);
  const totalFailed = queues.reduce((s, q) => s + q.failed, 0);

  const columns = [
    { title: 'Queue', dataIndex: 'name', key: 'name', render: (n: string) => <Text strong>{n}</Text> },
    { title: 'Active', dataIndex: 'active', key: 'active' },
    { title: 'Waiting', dataIndex: 'waiting', key: 'waiting' },
    { title: 'Scheduled', dataIndex: 'scheduled', key: 'scheduled' },
    { title: 'Retries', dataIndex: 'retries', key: 'retries' },
    { title: 'Failed', dataIndex: 'failed', key: 'failed', render: (f: number) => f > 0 ? <Tag color="red">{f}</Tag> : <Tag color="green">0</Tag> },
    { title: 'Throughput (min)', dataIndex: 'throughput', key: 'throughput' },
  ];

  const chartOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: queues.map((q) => q.name) },
    yAxis: { type: 'value' },
    series: [
      { name: 'Active', type: 'bar', data: queues.map((q) => q.active), itemStyle: { color: '#1677ff' } },
      { name: 'Waiting', type: 'bar', data: queues.map((q) => q.waiting), itemStyle: { color: '#faad14' } },
      { name: 'Failed', type: 'bar', data: queues.map((q) => q.failed), itemStyle: { color: '#ff4d4f' } },
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  };

  return (
    <div className="p-6">
      <PageHeader title="Queue Monitor" subtitle="Background job queue status" />
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}><Card><Statistic title="Active Jobs" value={totalActive} prefix={<ClockCircleOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Waiting" value={totalWaiting} prefix={<ClockCircleOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Failed" value={totalFailed} prefix={totalFailed > 0 ? <CloseCircleOutlined /> : <CheckCircleOutlined />} valueStyle={{ color: totalFailed > 0 ? '#ff4d4f' : '#52c41a' }} /></Card></Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}><Card title="Queue Details"><Table dataSource={queues} columns={columns} rowKey="name" pagination={false} size="small" /></Card></Col>
        <Col xs={24} lg={8}><Card title="Queue Distribution"><ReactECharts option={chartOption} style={{ height: 300 }} /></Card></Col>
      </Row>
    </div>
  );
};
export default QueueMonitor;
