import { Card, Tabs, Descriptions, Tag, Table, Button, Space, Timeline, Typography, Row, Col, Statistic, Progress, List, Avatar } from 'antd';
import {
  UserOutlined, FileTextOutlined, ClockCircleOutlined, CalendarOutlined,
  DollarOutlined, TrophyOutlined, EditOutlined, MailOutlined, PhoneOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          {t('hr.editEmployeeBtn')}
        </Button>
      </PageHeader>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}><Card><Statistic title={t('hr.attendanceThisMonth')} value={96} suffix="%" precision={0} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title={t('hr.leavesTaken')} value={12} suffix={`/ 20 ${t('hr.daysLabel')}`} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title={t('hr.payrollYTD')} value={68750} prefix="$" precision={0} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title={t('hr.performanceAvg')} value={4.0} precision={1} /></Card></Col>
      </Row>

      <Card>
        <Tabs defaultActiveKey="profile"
          items={[
            {
              key: 'profile', label: <span><UserOutlined /> {t('hr.personalInformation')}</span>,
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
                    <Descriptions.Item label={t('hr.employeeCodeLabel')}>{mockEmployee.code}</Descriptions.Item>
                    <Descriptions.Item label={t('hr.department')}>{mockEmployee.department}</Descriptions.Item>
                    <Descriptions.Item label={t('hr.jobTitle')}>{mockEmployee.jobTitle}</Descriptions.Item>
                    <Descriptions.Item label={t('hr.grade')}>{mockEmployee.grade}</Descriptions.Item>
                    <Descriptions.Item label={t('hr.reportsTo')}>{mockEmployee.manager}</Descriptions.Item>
                    <Descriptions.Item label={t('hr.workLocation')}>{mockEmployee.workLocation}</Descriptions.Item>
                    <Descriptions.Item label={t('hr.email')}><Space><MailOutlined />{mockEmployee.email}</Space></Descriptions.Item>
                    <Descriptions.Item label={t('hr.phone')}><Space><PhoneOutlined />{mockEmployee.phone}</Space></Descriptions.Item>
                    <Descriptions.Item label={t('hr.hireDate')}>{mockEmployee.hireDate}</Descriptions.Item>
                    <Descriptions.Item label={t('hr.emergencyContact')}>{mockEmployee.emergencyContact}</Descriptions.Item>
                  </Descriptions>
                </div>
              ),
            },
            {
              key: 'documents', label: <span><FileTextOutlined /> {t('hr.documents')}</span>,
              children: (
                <Table dataSource={mockDocuments} rowKey="name" pagination={false} size="small"
                  columns={[
                    { title: t('hr.name'), dataIndex: 'name' },
                    { title: t('hr.type'), dataIndex: 'type' },
                    { title: t('hr.size'), dataIndex: 'size' },
                    { title: t('hr.date'), dataIndex: 'uploaded' },
                    { title: t('hr.status'), dataIndex: 'status', render: (s: string) => <Tag color={s === 'verified' ? 'green' : 'orange'}>{s}</Tag> },
                    { title: t('common.actions'), render: () => <Button type="link" size="small">{t('common.download')}</Button> },
                  ]}
                />
              ),
            },
            {
              key: 'attendance', label: <span><ClockCircleOutlined /> {t('hr.attendance')}</span>,
              children: (
                <Table dataSource={mockAttendance} rowKey="date" pagination={false} size="small"
                  columns={[
                    { title: t('hr.date'), dataIndex: 'date' },
                    { title: t('hr.clockIn'), dataIndex: 'clockIn', render: (t: string) => <Tag color={t > '09:00' ? 'orange' : 'green'}>{t}</Tag> },
                    { title: t('hr.clockOut'), dataIndex: 'clockOut' },
                    { title: t('hr.totalHours'), dataIndex: 'total' },
                    { title: t('hr.status'), dataIndex: 'status', render: (s: string) => <Tag color={s === 'normal' ? 'green' : s === 'late' ? 'orange' : 'blue'}>{s}</Tag> },
                  ]}
                />
              ),
            },
            {
              key: 'leaves', label: <span><CalendarOutlined /> {t('hr.leaveManagement')}</span>,
              children: (
                <div className="text-center py-8">
                  <Text type="secondary">{t('hr.leaveHistory')}</Text>
                </div>
              ),
            },
            {
              key: 'payroll', label: <span><DollarOutlined /> {t('hr.payroll')}</span>,
              children: (
                <Table dataSource={payrollHistory} rowKey="period" pagination={false} size="small"
                  columns={[
                    { title: t('hr.period'), dataIndex: 'period' },
                    { title: t('hr.gross'), dataIndex: 'gross', render: (v: number) => `$${v.toLocaleString()}` },
                    { title: t('hr.net'), dataIndex: 'net', render: (v: number) => `$${v.toLocaleString()}` },
                    { title: t('hr.status'), dataIndex: 'status', render: (s: string) => <Tag color="green">{s}</Tag> },
                    { title: t('common.actions'), render: () => <Button type="link" size="small">{t('hr.viewPayslip')}</Button> },
                  ]}
                />
              ),
            },
            {
              key: 'performance', label: <span><TrophyOutlined /> {t('hr.performance')}</span>,
              children: (
                <Table dataSource={performanceReviews} rowKey="period" pagination={false} size="small"
                  columns={[
                    { title: t('hr.period'), dataIndex: 'period' },
                    { title: t('hr.rating'), dataIndex: 'rating', render: (v: number) => <span>{'★'.repeat(Math.round(v))}{'☆'.repeat(5 - Math.round(v))} {v}</span> },
                    { title: t('hr.reviewer'), dataIndex: 'reviewer' },
                    { title: t('hr.status'), dataIndex: 'status', render: (s: string) => <Tag color={s === 'completed' ? 'green' : 'orange'}>{s}</Tag> },
                    { title: t('hr.comments'), dataIndex: 'comments' },
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
