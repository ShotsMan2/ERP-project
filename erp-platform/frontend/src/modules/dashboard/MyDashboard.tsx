import { Row, Col, Card, List, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { StatCard } from '@/components/ui/StatCard';
import { CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, BellOutlined } from '@ant-design/icons';
import { useNotificationStore } from '@/store/notificationStore';

const { Title } = Typography;

export default function MyDashboard() {
  const { t } = useTranslation();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const pendingTasks = [
    { title: t('dashboard.myDashboard.reviewPurchaseOrders'), priority: t('dashboard.myDashboard.high'), due: t('dashboard.myDashboard.today') },
    { title: t('dashboard.myDashboard.approveLeaveRequests'), priority: t('dashboard.myDashboard.medium'), due: t('dashboard.myDashboard.tomorrow') },
    { title: t('dashboard.myDashboard.completeMonthlyReport'), priority: t('dashboard.myDashboard.high'), due: t('dashboard.myDashboard.in3Days') },
    { title: t('dashboard.myDashboard.updateInventoryCounts'), priority: t('dashboard.myDashboard.low'), due: t('dashboard.myDashboard.nextWeek') },
  ];

  return (
    <div>
      <Title level={4}>{t('dashboard.myDashboard.title')}</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard icon={<CheckCircleOutlined />} title={t('dashboard.myDashboard.tasksCompleted')} value="24" trend={8} trendLabel={t('dashboard.myDashboard.thisWeek')} color="#52c41a" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard icon={<ClockCircleOutlined />} title={t('dashboard.myDashboard.pendingTasks')} value="12" trend={-3} trendLabel={t('dashboard.myDashboard.thisWeek')} color="#faad14" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard icon={<FileTextOutlined />} title={t('dashboard.myDashboard.reportsDue')} value="3" trend={0} trendLabel={t('dashboard.myDashboard.thisWeek')} color="#1677ff" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard icon={<BellOutlined />} title={t('dashboard.myDashboard.notifications')} value={String(unreadCount)} trend={5} trendLabel={t('dashboard.myDashboard.unread')} color="#ff4d4f" />
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} lg={12}>
          <Card title={t('dashboard.myDashboard.pendingTasks')}>
            <List
              dataSource={pendingTasks}
              renderItem={(item) => (
                <List.Item extra={<Tag color={item.priority === t('dashboard.myDashboard.high') ? 'red' : item.priority === t('dashboard.myDashboard.medium') ? 'orange' : 'blue'}>{item.priority}</Tag>}>
                  <List.Item.Meta title={item.title} description={`${t('dashboard.myDashboard.due')}: ${item.due}`} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
