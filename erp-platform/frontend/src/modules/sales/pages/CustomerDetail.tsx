import { Card, Descriptions, Tag, Table, Tabs, Row, Col, Statistic, Typography, Space, Button, Timeline } from 'antd';
import { EditOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

const mockCustomer = { id: '1', code: 'CUST001', name: 'Acme Corp', email: 'billing@acme.com', phone: '+1-555-0501', segment: 'Enterprise', creditLimit: 100000, balance: 45000, status: 'active' as const, paymentTerms: 'Net 30', currency: 'USD', taxId: 'TX-1234567', address: '123 Main St, New York, NY 10001', website: 'www.acmecorp.com' };
const recentOrders = [
  { so: 'SO-2024-0234', date: '2024-12-15', total: 28999.90, status: 'pending' },
  { so: 'SO-2024-0231', date: '2024-12-10', total: 45000.00, status: 'delivered' },
  { so: 'SO-2024-0229', date: '2024-12-05', total: 7500.00, status: 'invoiced' },
];
const invoices = [
  { inv: 'INV-2024-0892', date: '2024-12-16', amount: 28999.90, dueDate: '2025-01-15', status: 'unpaid' },
  { inv: 'INV-2024-0885', date: '2024-12-11', amount: 45000.00, dueDate: '2025-01-10', status: 'paid' },
];
const tickets = [
  { id: 'TK001', subject: 'Shipping delay inquiry', priority: 'Medium', status: 'open', created: '2024-12-14' },
  { id: 'TK002', subject: 'Invoice discrepancy', priority: 'High', status: 'resolved', created: '2024-12-10' },
];
const activityTimeline = [
  { action: 'Order placed', detail: 'SO-2024-0234 for $28,999.90', time: '2024-12-15' },
  { action: 'Payment received', detail: 'INV-2024-0885 for $45,000.00', time: '2024-12-14' },
  { action: 'Support ticket created', detail: 'Shipping delay inquiry', time: '2024-12-14' },
];

const CustomerDetail: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <PageHeader title={mockCustomer.name} subtitle={'Code: ' + mockCustomer.code} onBack={() => navigate('/sales/customers')}>
        <Button type="primary" icon={<EditOutlined />} onClick={() => navigate('/sales/customers/' + mockCustomer.id + '/edit')}>Edit Customer</Button>
      </PageHeader>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}><Card><Statistic title="Credit Limit" value={mockCustomer.creditLimit} prefix="$" precision={0} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Balance" value={mockCustomer.balance} prefix="$" precision={0} valueStyle={{ color: mockCustomer.balance > 0 ? '#faad14' : undefined }} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Total Orders" value={recentOrders.length} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Open Tickets" value={tickets.filter((t) => t.status === 'open').length} /></Card></Col>
      </Row>
      <Card>
        <Tabs defaultActiveKey="profile" items={[
          { key: 'profile', label: 'Profile', children: (
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Name">{mockCustomer.name}</Descriptions.Item>
              <Descriptions.Item label="Code">{mockCustomer.code}</Descriptions.Item>
              <Descriptions.Item label="Segment"><Tag color="blue">{mockCustomer.segment}</Tag></Descriptions.Item>
              <Descriptions.Item label="Status"><Tag color="green">{mockCustomer.status}</Tag></Descriptions.Item>
              <Descriptions.Item label="Payment Terms">{mockCustomer.paymentTerms}</Descriptions.Item>
              <Descriptions.Item label="Currency">{mockCustomer.currency}</Descriptions.Item>
              <Descriptions.Item label="Tax ID">{mockCustomer.taxId}</Descriptions.Item>
              <Descriptions.Item label="Credit Limit">${mockCustomer.creditLimit.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Email"><Space><MailOutlined />{mockCustomer.email}</Space></Descriptions.Item>
              <Descriptions.Item label="Phone"><Space><PhoneOutlined />{mockCustomer.phone}</Space></Descriptions.Item>
              <Descriptions.Item label="Address" span={2}><Space><EnvironmentOutlined />{mockCustomer.address}</Space></Descriptions.Item>
            </Descriptions>
          )},
          { key: 'orders', label: 'Orders', children: <Table dataSource={recentOrders} rowKey="so" pagination={false} size="small" columns={[{ title: 'Order #', dataIndex: 'so', render: (v: string) => <a onClick={() => navigate('/sales/orders/' + v)}>{v}</a> }, { title: 'Date', dataIndex: 'date' }, { title: 'Total', dataIndex: 'total', render: (v: number) => '$' + v.toLocaleString() }, { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'delivered' ? 'green' : s === 'invoiced' ? 'purple' : 'orange'}>{s}</Tag> }]} /> },
          { key: 'invoices', label: 'Invoices', children: <Table dataSource={invoices} rowKey="inv" pagination={false} size="small" columns={[{ title: 'Invoice', dataIndex: 'inv' }, { title: 'Date', dataIndex: 'date' }, { title: 'Amount', dataIndex: 'amount', render: (v: number) => '$' + v.toLocaleString() }, { title: 'Due Date', dataIndex: 'dueDate' }, { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'paid' ? 'green' : 'red'}>{s}</Tag> }]} /> },
          { key: 'tickets', label: 'Support Tickets', children: <Table dataSource={tickets} rowKey="id" pagination={false} size="small" columns={[{ title: 'Subject', dataIndex: 'subject' }, { title: 'Priority', dataIndex: 'priority', render: (p: string) => <Tag color={p === 'High' ? 'red' : 'orange'}>{p}</Tag> }, { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'open' ? 'blue' : 'green'}>{s}</Tag> }, { title: 'Created', dataIndex: 'created' }]} /> },
          { key: 'activity', label: 'Activity', children: <Timeline items={activityTimeline.map((a) => ({ children: <><Text strong>{a.action}</Text><br /><Text type="secondary">{a.detail} · {a.time}</Text></> }))} /> },
        ]} />
      </Card>
    </div>
  );
};
export default CustomerDetail;
