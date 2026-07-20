import { Card, Tabs, Descriptions, Tag, Table, Button, Space, Timeline, Typography, Row, Col, Statistic, Progress, List, Avatar } from 'antd';
import {
  UserOutlined, FileTextOutlined, ClockCircleOutlined, CalendarOutlined,
  DollarOutlined, TrophyOutlined, EditOutlined, MailOutlined, PhoneOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

const mockEmployee = {
  id: '1', code: 'EMP001', firstName: 'John', lastName: 'Smith',
  email: 'john.smith@company.com', phone: '+1-555-0101', department: 'Engineering',
  jobTitle: 'Senior Developer', manager: 'Alice Johnson', hireDate: '2022-03-15',
  status: 'active' as const, grade: 'L5', workLocation: 'New York Office',
  emergencyContact: 'Jane Smith (+1-555-0199)',
};

const mockDocuments = [
  { name: 'Employment Contract', type: 'PDF', size: '245 KB', uploaded: '2022-03-15', status: 'verified' },
  { name: 'ID Card Copy', type: 'Image', size: '1.2 MB', uploaded: '2022-03-15', status: 'verified' },
  { name: 'Tax Declaration Form', type: 'PDF', size: '180 KB', uploaded: '2023-01-10', status: 'pending' },
  { name: 'Training Certificate', type: 'PDF', size: '520 KB', uploaded: '2023-06-20', status: 'verified' },
];

const mockAttendance = [
  { date: '2024-12-16', clockIn: '08:55', clockOut: '18:05', total: '8h 10m', status: 'normal' },
  { date: '2024-12-15', clockIn: '09:15', clockOut: '18:00', total: '7h 45m', status: 'late' },
  { date: '2024-12-14', clockIn: '08:45', clockOut: '17:30', total: '7h 45m', status: 'early' },
  { date: '2024-12-13', clockIn: '09:00', clockOut: '18:00', total: '8h 00m', status: 'normal' },
];

const payrollHistory = [
  { period: 'Dec 2024', gross: 8500, net: 6250, status: 'paid' },
  { period: 'Nov 2024', gross: 8500, net: 6250, status: 'paid' },
  { period: 'Oct 2024', gross: 8500, net: 6250, status: 'paid' },
];

const performanceReviews = [
  { period: 'Q3 2024', rating: 4.5, reviewer: 'Alice Johnson', status: 'completed', comments: 'Excellent performance' },
  { period: 'Q2 2024', rating: 4.0, reviewer: 'Alice Johnson', status: 'completed', comments: 'Good progress' },
  { period: 'Q1 2024', rating: 3.5, reviewer: 'Alice Johnson', status: 'completed', comments: 'Meeting expectations' },
];

const EmployeeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <PageHeader
        title={`${mockEmployee.firstName} ${mockEmployee.lastName}`}
        subtitle={`${mockEmployee.code} · ${mockEmployee.jobTitle}`}
        onBack={() => navigate('/hr/employees')}
      >
        <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/hr/employees/${id}/edit`)}>
          Edit Employee
        </Button>
      </PageHeader>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}><Card><Statistic title="Attendance (This Month)" value={96} suffix="%" precision={0} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Leaves Taken" value={12} suffix="/ 20 days" /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Payroll (YTD)" value={68750} prefix="$" precision={0} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Performance Avg" value={4.0} precision={1} /></Card></Col>
      </Row>

      <Card>
        <Tabs defaultActiveKey="profile"
          items={[
            {
              key: 'profile', label: <span><UserOutlined /> Profile</span>,
              children: (
                <div>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl text-blue-600 font-bold">J</span>
                    </div>
                    <div>
                      <Text strong className="text-xl">{mockEmployee.firstName} {mockEmployee.lastName}</Text>
                      <br />
                      <Tag color="green" className="mt-1">{mockEmployee.status.toUpperCase()}</Tag>
                    </div>
                  </div>
                  <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Employee Code">{mockEmployee.code}</Descriptions.Item>
                    <Descriptions.Item label="Department">{mockEmployee.department}</Descriptions.Item>
                    <Descriptions.Item label="Job Title">{mockEmployee.jobTitle}</Descriptions.Item>
                    <Descriptions.Item label="Grade">{mockEmployee.grade}</Descriptions.Item>
                    <Descriptions.Item label="Manager">{mockEmployee.manager}</Descriptions.Item>
                    <Descriptions.Item label="Work Location">{mockEmployee.workLocation}</Descriptions.Item>
                    <Descriptions.Item label="Email"><Space><MailOutlined />{mockEmployee.email}</Space></Descriptions.Item>
                    <Descriptions.Item label="Phone"><Space><PhoneOutlined />{mockEmployee.phone}</Space></Descriptions.Item>
                    <Descriptions.Item label="Hire Date">{mockEmployee.hireDate}</Descriptions.Item>
                    <Descriptions.Item label="Emergency Contact">{mockEmployee.emergencyContact}</Descriptions.Item>
                  </Descriptions>
                </div>
              ),
            },
            {
              key: 'documents', label: <span><FileTextOutlined /> Documents</span>,
              children: (
                <Table dataSource={mockDocuments} rowKey="name" pagination={false} size="small"
                  columns={[
                    { title: 'Name', dataIndex: 'name' },
                    { title: 'Type', dataIndex: 'type' },
                    { title: 'Size', dataIndex: 'size' },
                    { title: 'Uploaded', dataIndex: 'uploaded' },
                    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'verified' ? 'green' : 'orange'}>{s}</Tag> },
                    { title: 'Action', render: () => <Button type="link" size="small">Download</Button> },
                  ]}
                />
              ),
            },
            {
              key: 'attendance', label: <span><ClockCircleOutlined /> Attendance</span>,
              children: (
                <Table dataSource={mockAttendance} rowKey="date" pagination={false} size="small"
                  columns={[
                    { title: 'Date', dataIndex: 'date' },
                    { title: 'Clock In', dataIndex: 'clockIn', render: (t: string) => <Tag color={t > '09:00' ? 'orange' : 'green'}>{t}</Tag> },
                    { title: 'Clock Out', dataIndex: 'clockOut' },
                    { title: 'Total Hours', dataIndex: 'total' },
                    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'normal' ? 'green' : s === 'late' ? 'orange' : 'blue'}>{s}</Tag> },
                  ]}
                />
              ),
            },
            {
              key: 'leaves', label: <span><CalendarOutlined /> Leaves</span>,
              children: (
                <div className="text-center py-8">
                  <Text type="secondary">Leave history will be displayed here</Text>
                </div>
              ),
            },
            {
              key: 'payroll', label: <span><DollarOutlined /> Payroll</span>,
              children: (
                <Table dataSource={payrollHistory} rowKey="period" pagination={false} size="small"
                  columns={[
                    { title: 'Period', dataIndex: 'period' },
                    { title: 'Gross', dataIndex: 'gross', render: (v: number) => `$${v.toLocaleString()}` },
                    { title: 'Net', dataIndex: 'net', render: (v: number) => `$${v.toLocaleString()}` },
                    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color="green">{s}</Tag> },
                    { title: 'Action', render: () => <Button type="link" size="small">View Payslip</Button> },
                  ]}
                />
              ),
            },
            {
              key: 'performance', label: <span><TrophyOutlined /> Performance</span>,
              children: (
                <Table dataSource={performanceReviews} rowKey="period" pagination={false} size="small"
                  columns={[
                    { title: 'Period', dataIndex: 'period' },
                    { title: 'Rating', dataIndex: 'rating', render: (v: number) => <span>{'★'.repeat(Math.round(v))}{'☆'.repeat(5 - Math.round(v))} {v}</span> },
                    { title: 'Reviewer', dataIndex: 'reviewer' },
                    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'completed' ? 'green' : 'orange'}>{s}</Tag> },
                    { title: 'Comments', dataIndex: 'comments' },
                  ]}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default EmployeeDetail;
