import { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, message, Row, Col, Statistic, Modal } from 'antd';
import { ReloadOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import PageHeader from '@/components/ui/PageHeader';
import { adminService, QueueSummary, QueueTask } from '@/services/adminService';
const { Text } = Typography;

const QueueMonitor: React.FC = () => {
  const [summary, setSummary] = useState<QueueSummary[]>([]);
  const [tasks, setTasks] = useState<QueueTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [summaryData, tasksData] = await Promise.all([
        adminService.getQueueSummary(),
        adminService.listQueueTasks({ size: 50 }),
      ]);
      setSummary(summaryData);
      setTasks(tasksData);
    } catch { message.error('Failed to load queue data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handlePurge = async (queueName: string) => {
    try {
      const res = await adminService.purgeQueue(queueName);
      message.success(`Purged ${res.purged} tasks from ${queueName}`);
      fetchData();
    } catch { message.error('Failed to purge queue'); }
  };

  const handleRetry = async (taskId: string) => {
    try {
      await adminService.retryTask(taskId);
      message.success('Task queued for retry');
      fetchData();
    } catch { message.error('Failed to retry task'); }
  };

  const handleCancel = async (taskId: string) => {
    try {
      await adminService.cancelTask(taskId);
      message.success('Task cancelled');
      fetchData();
    } catch { message.error('Failed to cancel task'); }
  };

  const totalPending = summary.reduce((a, b) => a + b.pending, 0);
  const totalFailed = summary.reduce((a, b) => a + b.failed, 0);
  const totalCompleted = summary.reduce((a, b) => a + b.completed, 0);

  const chartOption = {
    tooltip: { trigger: 'axis' as const },
    legend: { data: ['Pending', 'Processing', 'Completed', 'Failed'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category' as const, data: summary.map(s => s.queue_name) },
    yAxis: { type: 'value' as const },
    series: [
      { name: 'Pending', type: 'bar', stack: 'total', data: summary.map(s => s.pending), itemStyle: { color: '#faad14' } },
      { name: 'Processing', type: 'bar', stack: 'total', data: summary.map(s => s.processing), itemStyle: { color: '#1677ff' } },
      { name: 'Completed', type: 'bar', stack: 'total', data: summary.map(s => s.completed), itemStyle: { color: '#52c41a' } },
      { name: 'Failed', type: 'bar', stack: 'total', data: summary.map(s => s.failed), itemStyle: { color: '#ff4d4f' } },
    ],
  };

  const summaryColumns = [
    { title: 'Queue', dataIndex: 'queue_name', key: 'queue_name', render: (name: string) => <Text strong>{name}</Text> },
    { title: 'Pending', dataIndex: 'pending', key: 'pending', render: (v: number) => <Tag color={v > 0 ? 'orange' : 'default'}>{v}</Tag> },
    { title: 'Processing', dataIndex: 'processing', key: 'processing' },
    { title: 'Failed', dataIndex: 'failed', key: 'failed', render: (v: number) => <Tag color={v > 0 ? 'red' : 'green'}>{v}</Tag> },
    { title: 'Completed', dataIndex: 'completed', key: 'completed' },
    { title: 'Total', dataIndex: 'total', key: 'total' },
    {
      title: 'Actions', key: 'actions',
      render: (_: unknown, r: QueueSummary) => (
        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handlePurge(r.queue_name)}
          disabled={r.pending === 0 && r.failed === 0}>Purge</Button>
      ),
    },
  ];

  const taskColumns = [
    { title: 'Task ID', dataIndex: 'task_id', key: 'task_id', width: 100 },
    { title: 'Queue', dataIndex: 'queue_name', key: 'queue_name' },
    { title: 'Name', dataIndex: 'task_name', key: 'task_name' },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (s: string) => {
        const colors: Record<string, string> = { pending: 'orange', processing: 'blue', completed: 'green', failed: 'red', cancelled: 'default' };
        return <Tag color={colors[s] || 'default'}>{s}</Tag>;
      },
    },
    { title: 'Retries', dataIndex: 'retry_count', key: 'retry_count', render: (v: number, r: QueueTask) => `${v}/${r.max_retries}` },
    { title: 'Priority', dataIndex: 'priority', key: 'priority' },
    {
      title: 'Actions', key: 'actions',
      render: (_: unknown, r: QueueTask) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleRetry(r.task_id)} disabled={r.status !== 'failed'}>Retry</Button>
          <Button type="link" size="small" danger onClick={() => handleCancel(r.task_id)}
            disabled={!['pending', 'processing'].includes(r.status)}>Cancel</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Queue Monitor" subtitle="Monitor and manage task queues">
        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>Refresh</Button>
      </PageHeader>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}><Card><Statistic title="Total Pending" value={totalPending} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Total Failed" value={totalFailed} prefix={<CloseCircleOutlined />} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Total Completed" value={totalCompleted} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      {summary.length > 0 && (
        <Card className="mb-6">
          <ReactECharts option={chartOption} style={{ height: 250 }} />
        </Card>
      )}

      <Card title="Queue Summary" className="mb-6">
        <Table dataSource={summary} columns={summaryColumns} rowKey="queue_name" loading={loading} pagination={false} size="small" />
      </Card>

      <Card title="Recent Tasks">
        <Table dataSource={tasks} columns={taskColumns} rowKey="task_id" loading={loading} pagination={{ pageSize: 10 }} size="small" />
      </Card>
    </div>
  );
};

export default QueueMonitor;
