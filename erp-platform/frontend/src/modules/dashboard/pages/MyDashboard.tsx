import { Card, Row, Col, Statistic, List, Tag, Button, Typography, Progress, Space, Table } from 'antd';
import {
  CheckCircleOutlined, ClockCircleOutlined, CalendarOutlined,
  TeamOutlined, TrophyOutlined, PlusOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';

const { Text, Title } = Typography;

const MyDashboard: React.FC = () => {
  const { t } = useTranslation();

  const kpiKeys = ['tasksCompleted', 'inProgress', 'upcomingLeaves', 'attendanceRate'] as const;
  const kpiConfig: Record<string, { value: number; suffix?: string; icon: React.ReactNode }> = {
    tasksCompleted: { value: 12, suffix: '/ 18', icon: <CheckCircleOutlined className="text-green-500" /> },
    inProgress: { value: 4, icon: <ClockCircleOutlined className="text-blue-500" /> },
    upcomingLeaves: { value: 2, icon: <CalendarOutlined className="text-orange-500" /> },
    attendanceRate: { value: 96, suffix: '%', icon: <TeamOutlined className="text-purple-500" /> },
  };

  const taskData = [
    { titleKey: 'reviewQ3Budget', priority: 'high', due: '2024-12-20', status: 'inProgress' },
    { titleKey: 'completeOnboarding', priority: 'medium', due: '2024-12-22', status: 'todo' },
    { titleKey: 'updateProjectTimeline', priority: 'low', due: '2024-12-25', status: 'todo' },
    { titleKey: 'prepareMonthlyPresentation', priority: 'high', due: '2024-12-18', status: 'done' },
    { titleKey: 'teamFeedbackSession', priority: 'medium', due: '2024-12-19', status: 'inProgress' },
  ];

  const leaveData = [
    { typeKey: 'annualLeave', start: 'Dec 24', end: 'Dec 26', days: 3, statusKey: 'approved' },
    { typeKey: 'personalDay', start: 'Jan 5', end: 'Jan 5', days: 1, statusKey: 'pendingStatus' },
  ];

  const priorityColor: Record<string, string> = { high: 'red', medium: 'orange', low: 'blue' };
  const statusColor: Record<string, string> = { todo: 'default', inProgress: 'processing', done: 'success' };

  const taskColumns = [
    { title: t('dashboard.myDashboard.task'), dataIndex: 'title', key: 'title' },
    {
      title: t('dashboard.myDashboard.priority'), dataIndex: 'priority', key: 'priority',
      render: (p: string) => <Tag color={priorityColor[p]}>{t(`dashboard.myDashboard.${p}`)}</Tag>,
    },
    { title: t('dashboard.myDashboard.dueDate'), dataIndex: 'due', key: 'due' },
    {
      title: t('dashboard.myDashboard.status'), dataIndex: 'status', key: 'status',
      render: (s: string) => <Tag color={statusColor[s]}>{t(`dashboard.myDashboard.${s}`)}</Tag>,
    },
  ];

  return (
    <div className="p-6">
      <PageHeader title={t('dashboard.myDashboard.title')} subtitle={t('dashboard.myDashboard.subtitle')}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>{t('dashboard.myDashboard.quickTask')}</Button>
          <Button icon={<CalendarOutlined />}>{t('dashboard.myDashboard.mySchedule')}</Button>
        </Space>
      </PageHeader>

      <Row gutter={[16, 16]} className="mb-6">
        {kpiKeys.map((key) => (
          <Col xs={24} sm={12} lg={6} key={key}>
            <Card hoverable>
              <Statistic
                title={<span className="flex items-center gap-2">{kpiConfig[key].icon} {t(`dashboard.myDashboard.${key}`)}</span>}
                value={kpiConfig[key].value}
                suffix={kpiConfig[key].suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={t('dashboard.myDashboard.myTasks')} extra={<Button type="link">{t('dashboard.myDashboard.viewAll')}</Button>}>
            <Table
              dataSource={taskData.map((d) => ({ ...d, title: t(`dashboard.myDashboard.${d.titleKey}`) }))}
              columns={taskColumns}
              rowKey="titleKey"
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title={t('dashboard.myDashboard.upcomingLeavesTitle')}>
                <List
                  dataSource={leaveData}
                  renderItem={(item) => (
                    <List.Item>
                      <div className="w-full flex justify-between items-center">
                        <div>
                          <Text strong>{t(`dashboard.myDashboard.${item.typeKey}`)}</Text>
                          <br />
                          <Text type="secondary" className="text-sm">
                            {item.start} - {item.end} ({item.days} {item.days > 1 ? t('dashboard.myDashboard.days') : t('dashboard.myDashboard.day')})
                          </Text>
                        </div>
                        <Tag color={item.statusKey === 'approved' ? 'green' : 'orange'}>
                          {t(`dashboard.myDashboard.${item.statusKey}`)}
                        </Tag>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card title={t('dashboard.myDashboard.attendanceSummary')}>
                <Space direction="vertical" className="w-full">
                  <div className="flex justify-between items-center">
                    <Text>{t('dashboard.myDashboard.thisMonthLabel')}</Text>
                    <Text strong>22 / 22 {t('dashboard.myDashboard.days')}</Text>
                  </div>
                  <Progress percent={100} size="small" />
                  <div className="flex justify-between items-center mt-2">
                    <Text>{t('dashboard.myDashboard.onTime')}</Text>
                    <Text strong>20 {t('dashboard.myDashboard.days')}</Text>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text>{t('dashboard.myDashboard.late')}</Text>
                    <Text strong>1 {t('dashboard.myDashboard.day')}</Text>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text>{t('dashboard.myDashboard.earlyLeave')}</Text>
                    <Text strong>1 {t('dashboard.myDashboard.day')}</Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24}>
          <Card title={t('dashboard.quickActions')}>
            <Space wrap size="large">
              <Button type="default" icon={<PlusOutlined />}>{t('dashboard.myDashboard.requestLeave')}</Button>
              <Button type="default" icon={<ClockCircleOutlined />}>{t('dashboard.myDashboard.clockInOut')}</Button>
              <Button type="default" icon={<CalendarOutlined />}>{t('dashboard.myDashboard.viewSchedule')}</Button>
              <Button type="default" icon={<TrophyOutlined />}>{t('dashboard.myDashboard.myPerformance')}</Button>
              <Button type="default" icon={<TeamOutlined />}>{t('dashboard.myDashboard.teamDirectory')}</Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyDashboard;
