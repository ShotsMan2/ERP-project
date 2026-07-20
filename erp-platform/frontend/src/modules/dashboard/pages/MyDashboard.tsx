import { Card, Row, Col, Statistic, List, Tag, Button, Typography, Progress, Space, Table } from 'antd';
import {
  CheckCircleOutlined, ClockCircleOutlined, CalendarOutlined,
  TeamOutlined, TrophyOutlined, PlusOutlined,
} from '@ant-design/icons';
import PageHeader from '@/components/ui/PageHeader';

const { Text, Title } = Typography;

const myKpis = [
  { title: 'Tasks Completed', value: 12, suffix: '/ 18', icon: <CheckCircleOutlined className="text-green-500" /> },
  { title: 'In Progress', value: 4, icon: <ClockCircleOutlined className="text-blue-500" /> },
  { title: 'Upcoming Leaves', value: 2, icon: <CalendarOutlined className="text-orange-500" /> },
  { title: 'Attendance Rate', value: 96, suffix: '%', icon: <TeamOutlined className="text-purple-500" /> },
];

const myTasks = [
  { title: 'Review Q3 budget report', priority: 'High', due: '2024-12-20', status: 'In Progress' },
  { title: 'Complete onboarding docs', priority: 'Medium', due: '2024-12-22', status: 'To Do' },
  { title: 'Update project timeline', priority: 'Low', due: '2024-12-25', status: 'To Do' },
  { title: 'Prepare monthly presentation', priority: 'High', due: '2024-12-18', status: 'Done' },
  { title: 'Team feedback session', priority: 'Medium', due: '2024-12-19', status: 'In Progress' },
];

const upcomingLeaves = [
  { type: 'Annual Leave', start: 'Dec 24', end: 'Dec 26', days: 3, status: 'approved' },
  { type: 'Personal Day', start: 'Jan 5', end: 'Jan 5', days: 1, status: 'pending' },
];

const priorityColors: Record<string, string> = { High: 'red', Medium: 'orange', Low: 'blue' };
const statusColors: Record<string, string> = { 'To Do': 'default', 'In Progress': 'processing', Done: 'success' };

const taskColumns = [
  { title: 'Task', dataIndex: 'title', key: 'title' },
  {
    title: 'Priority', dataIndex: 'priority', key: 'priority',
    render: (p: string) => <Tag color={priorityColors[p]}>{p}</Tag>,
  },
  { title: 'Due Date', dataIndex: 'due', key: 'due' },
  {
    title: 'Status', dataIndex: 'status', key: 'status',
    render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag>,
  },
];

const MyDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <PageHeader title="My Dashboard" subtitle="Your personal overview and quick actions">
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>Quick Task</Button>
          <Button icon={<CalendarOutlined />}>My Schedule</Button>
        </Space>
      </PageHeader>

      <Row gutter={[16, 16]} className="mb-6">
        {myKpis.map((kpi) => (
          <Col xs={24} sm={12} lg={6} key={kpi.title}>
            <Card hoverable>
              <Statistic
                title={<span className="flex items-center gap-2">{kpi.icon} {kpi.title}</span>}
                value={kpi.value}
                suffix={kpi.suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="My Tasks" extra={<Button type="link">View All</Button>}>
            <Table
              dataSource={myTasks}
              columns={taskColumns}
              rowKey="title"
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Upcoming Leaves">
                <List
                  dataSource={upcomingLeaves}
                  renderItem={(item) => (
                    <List.Item>
                      <div className="w-full flex justify-between items-center">
                        <div>
                          <Text strong>{item.type}</Text>
                          <br />
                          <Text type="secondary" className="text-sm">
                            {item.start} - {item.end} ({item.days} day{item.days > 1 ? 's' : ''})
                          </Text>
                        </div>
                        <Tag color={item.status === 'approved' ? 'green' : 'orange'}>
                          {item.status}
                        </Tag>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card title="Attendance Summary">
                <Space direction="vertical" className="w-full">
                  <div className="flex justify-between items-center">
                    <Text>This Month</Text>
                    <Text strong>22 / 22 days</Text>
                  </div>
                  <Progress percent={100} size="small" />
                  <div className="flex justify-between items-center mt-2">
                    <Text>On Time</Text>
                    <Text strong>20 days</Text>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text>Late</Text>
                    <Text strong>1 day</Text>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text>Early Leave</Text>
                    <Text strong>1 day</Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24}>
          <Card title="Quick Actions">
            <Space wrap size="large">
              <Button type="default" icon={<PlusOutlined />}>Request Leave</Button>
              <Button type="default" icon={<ClockCircleOutlined />}>Clock In/Out</Button>
              <Button type="default" icon={<CalendarOutlined />}>View Schedule</Button>
              <Button type="default" icon={<TrophyOutlined />}>My Performance</Button>
              <Button type="default" icon={<TeamOutlined />}>Team Directory</Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyDashboard;
