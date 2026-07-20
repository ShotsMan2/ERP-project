import { useState } from 'react';
import {
  Card, Row, Col, DatePicker, Select, Space, Button, Tabs, Typography, Table, Tag, message,
} from 'antd';
import { DownloadOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import PageHeader from '@/components/ui/PageHeader';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const metrics = [
  { label: 'Total Revenue', value: 'revenue', color: '#1677ff' },
  { label: 'Total Orders', value: 'orders', color: '#52c41a' },
  { label: 'Active Users', value: 'users', color: '#faad14' },
  { label: 'Conversion Rate', value: 'conversion', color: '#ff4d4f' },
];

const chartOptions: Record<string, any> = {
  revenue: {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [45000, 52000, 48000, 61000], itemStyle: { color: '#1677ff' } }],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  },
  orders: {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [320, 410, 380, 520], itemStyle: { color: '#52c41a' } }],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  },
  users: {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: [1200, 1350, 1280, 1500], smooth: true }],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  },
  conversion: {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [{ type: 'line', data: [3.2, 3.8, 3.5, 4.1], smooth: true, areaStyle: {} }],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  },
};

const comparisonData = [
  { metric: 'Revenue', current: '$61,000', previous: '$48,000', change: '+27%', trend: 'up' },
  { metric: 'Orders', current: '520', previous: '380', change: '+37%', trend: 'up' },
  { metric: 'Avg Order Value', current: '$117.30', previous: '$126.30', change: '-7%', trend: 'down' },
  { metric: 'Conversion Rate', current: '4.1%', previous: '3.5%', change: '+17%', trend: 'up' },
  { metric: 'Active Users', current: '1,500', previous: '1,280', change: '+17%', trend: 'up' },
  { metric: 'Bounce Rate', current: '32%', previous: '35%', change: '-9%', trend: 'down' },
];

const Analytics: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().subtract(30, 'day'), dayjs()]);

  const handleExport = () => {
    message.success('Report export started. You will be notified when ready.');
  };

  return (
    <div className="p-6">
      <PageHeader title="Analytics" subtitle="Advanced metrics and performance analysis">
        <Space>
          <Button icon={<ReloadOutlined />}>Refresh</Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
            Export Report
          </Button>
        </Space>
      </PageHeader>

      <Card className="mb-6">
        <Space wrap size="middle">
          <RangePicker
            value={dateRange}
            onChange={(dates) => {
              if (dates?.[0] && dates?.[1]) setDateRange([dates[0], dates[1]]);
            }}
          />
          <Select defaultValue="all" style={{ width: 140 }} prefix={<FilterOutlined />}>
            <Select.Option value="all">All Departments</Select.Option>
            <Select.Option value="sales">Sales</Select.Option>
            <Select.Option value="marketing">Marketing</Select.Option>
            <Select.Option value="operations">Operations</Select.Option>
            <Select.Option value="it">IT</Select.Option>
          </Select>
          <Select defaultValue="daily" style={{ width: 130 }}>
            <Select.Option value="daily">Daily</Select.Option>
            <Select.Option value="weekly">Weekly</Select.Option>
            <Select.Option value="monthly">Monthly</Select.Option>
            <Select.Option value="quarterly">Quarterly</Select.Option>
          </Select>
        </Space>
      </Card>

      <Row gutter={[16, 16]} className="mb-6">
        {metrics.map((m) => (
          <Col xs={12} sm={6} key={m.value}>
            <Card
              hoverable
              className={`cursor-pointer ${selectedMetric === m.value ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedMetric(m.value)}
            >
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: m.color }}>{m.label}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title={metrics.find((m) => m.value === selectedMetric)?.label}>
            <Tabs
              items={[
                { key: 'bar', label: 'Bar', children: <ReactECharts option={chartOptions[selectedMetric]} style={{ height: 350 }} /> },
                { key: 'line', label: 'Line', children: <ReactECharts option={{ ...chartOptions[selectedMetric], series: [{ ...chartOptions[selectedMetric].series[0], type: 'line', areaStyle: undefined }] }} style={{ height: 350 }} /> },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Period Comparison">
            <Table
              dataSource={comparisonData}
              rowKey="metric"
              pagination={false}
              size="small"
              columns={[
                { title: 'Metric', dataIndex: 'metric', key: 'metric' },
                { title: 'Current', dataIndex: 'current', key: 'current', align: 'right' as const },
                { title: 'Previous', dataIndex: 'previous', key: 'previous', align: 'right' as const },
                {
                  title: 'Change', dataIndex: 'change', key: 'change', align: 'right' as const,
                  render: (c: string, record: any) => (
                    <Tag color={record.trend === 'up' ? 'green' : 'red'}>{c}</Tag>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
