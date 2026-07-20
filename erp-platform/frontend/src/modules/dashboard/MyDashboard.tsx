import { Row, Col, Card, List, Tag, Typography } from 'antd';
import { StatCard } from '@/components/ui/StatCard';
import { CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, BellOutlined } from '@ant-design/icons';

const { Title } = Typography;

const pendingTasks = [
  { title: 'Review purchase orders', priority: 'High', due: 'Today' },
  { title: 'Approve leave requests', priority: 'Medium', due: 'Tomorrow' },
  { title: 'Complete monthly report', priority: 'High', due: 'In 3 days' },
  { title: 'Update inventory counts', priority: 'Low', due: 'Next week' },
];

export default function MyDashboard() {
  return (
    <div>
      <Title level={4}>My Dashboard</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard icon={<CheckCircleOutlined />} title="Tasks Completed" value="24" trend={8} trendLabel="this week" color="#52c41a" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard icon={<ClockCircleOutlined />} title="Pending Tasks" value="12" trend={-3} trendLabel="this week" color="#faad14" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard icon={<FileTextOutlined />} title="Reports Due" value="3" trend={0} trendLabel="this week" color="#1677ff" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard icon={<BellOutlined />} title="Notifications" value="8" trend={5} trendLabel="unread" color="#ff4d4f" />
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} lg={12}>
          <Card title="Pending Tasks">
            <List
              dataSource={pendingTasks}
              renderItem={(item) => (
                <List.Item extra={<Tag color={item.priority === 'High' ? 'red' : item.priority === 'Medium' ? 'orange' : 'blue'}>{item.priority}</Tag>}>
                  <List.Item.Meta title={item.title} description={`Due: ${item.due}`} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
