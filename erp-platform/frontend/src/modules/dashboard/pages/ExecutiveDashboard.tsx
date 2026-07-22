import { Card, Row, Col, Statistic, Table, Tag, List, Typography, Space, Button } from 'antd';
import {
  DollarOutlined, RiseOutlined, FallOutlined, BankOutlined,
  ArrowUpOutlined, ArrowDownOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import PageHeader from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'info': return 'blue';
    case 'success': return 'green';
    case 'warning': return 'orange';
    case 'error': return 'red';
    default: return 'default';
  }
};

const ExecutiveDashboard: React.FC = () => {
  const { t } = useTranslation();

  const kpiData = [
    { title: t('dashboard.executive.totalRevenue'), value: 284500, prefix: '$', change: 12.5, changeType: 'up' as const },
    { title: t('dashboard.executive.totalExpenses'), value: 198200, prefix: '$', change: 3.2, changeType: 'up' as const },
    { title: t('dashboard.executive.netProfit'), value: 86300, prefix: '$', change: 8.7, changeType: 'up' as const },
    { title: t('dashboard.executive.cashOnHand'), value: 452000, prefix: '$', change: 2.1, changeType: 'down' as const },
  ];

  const revenueTrendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: [t('dashboard.executive.revenue')] },
    xAxis: { type: 'category', data: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'] },
    yAxis: { type: 'value' },
    series: [
      { name: t('dashboard.executive.revenue'), type: 'line', data: [150, 230, 224, 218, 235, 270, 260, 285, 295, 310, 330, 345], smooth: true, areaStyle: {} },
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  };

  const monthlyComparisonOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: [t('dashboard.executive.thisYear'), t('dashboard.executive.lastYear')] },
    xAxis: { type: 'category', data: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'] },
    yAxis: { type: 'value' },
    series: [
      { name: t('dashboard.executive.thisYear'), type: 'bar', data: [150, 230, 224, 218, 235, 270] },
      { name: t('dashboard.executive.lastYear'), type: 'bar', data: [120, 180, 190, 175, 200, 220] },
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
          { value: 45000, name: t('dashboard.executive.salaries') },
          { value: 32000, name: t('dashboard.executive.operations') },
          { value: 28000, name: t('dashboard.executive.marketing') },
          { value: 18000, name: t('dashboard.executive.itInfrastructure') },
          { value: 15000, name: t('dashboard.executive.officeAdmin') },
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
    { id: 'PO-2024-0157', type: t('dashboard.executive.purchaseOrder'), requester: 'Alice Green', amount: 12500, status: 'pending' },
    { id: 'LV-2024-0089', type: t('dashboard.executive.leaveRequest'), requester: 'Bob White', days: 3, status: 'pending' },
    { id: 'SO-2024-0235', type: t('dashboard.executive.salesOrder'), requester: 'Carol Black', amount: 8900, status: 'pending' },
    { id: 'INV-2024-0895', type: t('dashboard.executive.invoice'), requester: 'Dave Yellow', amount: 3450, status: 'pending' },
  ];

  const approvalColumns = [
    { title: t('dashboard.executive.id'), dataIndex: 'id', key: 'id' },
    { title: t('dashboard.executive.type'), dataIndex: 'type', key: 'type', render: (text: string) => <Tag>{text}</Tag> },
    { title: t('dashboard.executive.requester'), dataIndex: 'requester', key: 'requester' },
    { title: t('dashboard.executive.amountDays'), key: 'value', render: (_: unknown, r: any) => r.amount ? `$${r.amount.toLocaleString()}` : `${r.days} days` },
    { title: t('dashboard.executive.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color="orange">{s}</Tag> },
    { title: t('dashboard.executive.action'), key: 'action', render: () => <Space><Button type="link" size="small">{t('dashboard.executive.approve')}</Button><Button type="link" size="small" danger>{t('dashboard.executive.reject')}</Button></Space> },
  ];

  return (
    <div className="p-6">
      <PageHeader title={t('dashboard.executive.title')} subtitle={t('dashboard.executive.subtitle')} />

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
          <Card title={t('dashboard.executive.revenueTrend')}>
            <ReactECharts option={revenueTrendOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={t('dashboard.executive.monthlyComparison')}>
            <ReactECharts option={monthlyComparisonOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title={t('dashboard.executive.expenseBreakdown')}>
            <ReactECharts option={expenseBreakdownOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t('dashboard.executive.recentActivity')}>
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
          <Card title={t('dashboard.executive.pendingApprovals')}>
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
