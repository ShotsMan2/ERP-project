import { Card, Row, Col, Statistic, Table, Tag, List, Typography, Space, Button } from 'antd';
import {
  DollarOutlined, RiseOutlined, FallOutlined, BankOutlined,
  ArrowUpOutlined, ArrowDownOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

const kpiData = [
  { title: 'Total Revenue', value: 284500, prefix: '$', change: 12.5, changeType: 'up' as const },
  { title: 'Total Expenses', value: 198200, prefix: '$', change: 3.2, changeType: 'up' as const },
  { title: 'Net Profit', value: 86300, prefix: '$', change: 8.7, changeType: 'up' as const },
  { title: 'Cash on Hand', value: 452000, prefix: '$', change: 2.1, changeType: 'down' as const },
];

const revenueTrendOption = {
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
  yAxis: { type: 'value' },
  series: [
    { name: 'Revenue', type: 'line', data: [150, 230, 224, 218, 235, 270, 260, 285, 295, 310, 330, 345], smooth: true, areaStyle: {} },
  ],
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
};

const monthlyComparisonOption = {
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
  yAxis: { type: 'value' },
  series: [
    { name: 'This Year', type: 'bar', data: [150, 230, 224, 218, 235, 270] },
    { name: 'Last Year', type: 'bar', data: [120, 180, 190, 175, 200, 220] },
  ],
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
};

const expenseBreakdownOption = {
  tooltip: { trigger: 'item' },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 45000, name: 'Salaries' },
        { value: 32000, name: 'Operations' },
        { value: 28000, name: 'Marketing' },
        { value: 18000, name: 'IT & Infrastructure' },
        { value: 15000, name: 'Office Admin' },
      ],
    },
  ],
};

const recentActivities = [
  { action: 'New purchase order #PO-2024-0156 created', user: 'John Smith', time: '5 min ago', type: 'info' },
  { action: 'Invoice #INV-2024-0892 approved', user: 'Sarah Johnson', time: '15 min ago', type: 'success' },
  { action: 'Stock adjustment for SKU-0042', user: 'Mike Brown', time: '1 hour ago', type: 'warning' },
  { action: 'Employee leave request approved', user: 'Emily Davis', time: '2 hours ago', type: 'success' },
  { action: 'Sales order #SO-2024-0234 shipped', user: 'James Wilson', time: '3 hours ago', type: 'info' },
  { action: 'Payment received for invoice #INV-2024-0876', user: 'System', time: '4 hours ago', type: 'success' },
];

const pendingApprovals = [
  { id: 'PO-2024-0157', type: 'Purchase Order', requester: 'Alice Green', amount: 12500, status: 'pending' },
  { id: 'LV-2024-0089', type: 'Leave Request', requester: 'Bob White', days: 3, status: 'pending' },
  { id: 'SO-2024-0235', type: 'Sales Order', requester: 'Carol Black', amount: 8900, status: 'pending' },
  { id: 'INV-2024-0895', type: 'Invoice', requester: 'Dave Yellow', amount: 3450, status: 'pending' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'info': return 'blue';
    case 'success': return 'green';
    case 'warning': return 'orange';
    case 'error': return 'red';
    default: return 'default';
  }
};

const approvalColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Type', dataIndex: 'type', key: 'type', render: (t: string) => <Tag>{t}</Tag> },
  { title: 'Requester', dataIndex: 'requester', key: 'requester' },
  { title: 'Amount/Days', key: 'value', render: (_: unknown, r: any) => r.amount ? `$${r.amount.toLocaleString()}` : `${r.days} days` },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color="orange">{s}</Tag> },
  { title: 'Action', key: 'action', render: () => <Space><Button type="link" size="small">Approve</Button><Button type="link" size="small" danger>Reject</Button></Space> },
];

const ExecutiveDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <PageHeader title="Executive Dashboard" subtitle="Company-wide performance overview" />

      <Row gutter={[16, 16]} className="mb-6">
        {kpiData.map((kpi) => (
          <Col xs={24} sm={12} lg={6} key={kpi.title}>
            <Card hoverable>
              <Statistic
                title={kpi.title}
                value={kpi.value}
                prefix={kpi.prefix}
                suffix={
                  <span className={`text-sm ${kpi.changeType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {kpi.changeType === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {kpi.change}%
                  </span>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="Revenue Trend">
            <ReactECharts option={revenueTrendOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Monthly Comparison">
            <ReactECharts option={monthlyComparisonOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Expense Breakdown">
            <ReactECharts option={expenseBreakdownOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Recent Activity">
            <List
              size="small"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <div className="w-full">
                    <div className="flex items-start gap-2">
                      <Tag color={getStatusColor(item.type)} className="mt-0.5">●</Tag>
                      <div>
                        <Text className="text-sm">{item.action}</Text>
                        <div className="text-xs text-gray-400 mt-1">
                          {item.user} · {item.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Pending Approvals">
            <Table
              dataSource={pendingApprovals}
              columns={approvalColumns}
              rowKey="id"
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExecutiveDashboard;
