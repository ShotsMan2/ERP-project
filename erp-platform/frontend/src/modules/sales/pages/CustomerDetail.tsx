import { Card, Descriptions, Tag, Table, Tabs, Row, Col, Statistic, Typography, Space, Button, Timeline } from 'antd';
import { EditOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <PageHeader title={mockCustomer.name} subtitle={t('sales.customerDetail.subtitle', { code: mockCustomer.code })} onBack={() => navigate('/sales/customers')}>
        <Button type="primary" icon={<EditOutlined />} onClick={() => navigate('/sales/customers/' + mockCustomer.id + '/edit')}>{t('sales.customerDetail.editCustomer')}</Button>
      </PageHeader>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}><Card><Statistic title={t('sales.customerDetail.creditLimit')} value={mockCustomer.creditLimit} prefix="$" precision={0} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title={t('sales.customerDetail.balance')} value={mockCustomer.balance} prefix="$" precision={0} valueStyle={{ color: mockCustomer.balance > 0 ? '#faad14' : undefined }} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title={t('sales.customerDetail.totalOrders')} value={recentOrders.length} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title={t('sales.customerDetail.openTickets')} value={tickets.filter((t) => t.status === 'open').length} /></Card></Col>
      </Row>
      <Card>
        <Tabs defaultActiveKey="profile" items={[
          { key: 'profile', label: t('sales.customerDetail.profile'), children: (
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label={t('sales.customerDetail.name')}>{mockCustomer.name}</Descriptions.Item>
              <Descriptions.Item label={t('sales.customerDetail.code')}>{mockCustomer.code}</Descriptions.Item>
              <Descriptions.Item label={t('sales.customerDetail.segment')}><Tag color="blue">{mockCustomer.segment}</Tag></Descriptions.Item>
              <Descriptions.Item label={t('sales.customerDetail.status')}><Tag color="green">{mockCustomer.status}</Tag></Descriptions.Item>
              <Descriptions.Item label={t('sales.customerDetail.paymentTerms')}>{mockCustomer.paymentTerms}</Descriptions.Item>
              <Descriptions.Item label={t('sales.customerDetail.currency')}>{mockCustomer.currency}</Descriptions.Item>
              <Descriptions.Item label={t('sales.customerDetail.taxId')}>{mockCustomer.taxId}</Descriptions.Item>
              <Descriptions.Item label={t('sales.customerDetail.creditLimit')}>${mockCustomer.creditLimit.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label={t('sales.customerDetail.email')}><Space><MailOutlined />{mockCustomer.email}</Space></Descriptions.Item>
              <Descriptions.Item label={t('sales.customerDetail.phone')}><Space><PhoneOutlined />{mockCustomer.phone}</Space></Descriptions.Item>
              <Descriptions.Item label={t('sales.customerDetail.address')} span={2}><Space><EnvironmentOutlined />{mockCustomer.address}</Space></Descriptions.Item>
            </Descriptions>
          )},
          { key: 'orders', label: t('sales.customerDetail.orders'), children: <Table dataSource={recentOrders} rowKey="so" pagination={false} size="small" columns={[{ title: t('sales.customerDetail.orderNumber'), dataIndex: 'so', render: (v: string) => <a onClick={() => navigate('/sales/orders/' + v)}>{v}</a> }, { title: t('sales.customerDetail.date'), dataIndex: 'date' }, { title: t('sales.customerDetail.total'), dataIndex: 'total', render: (v: number) => '$' + v.toLocaleString() }, { title: t('sales.customerDetail.status'), dataIndex: 'status', render: (s: string) => <Tag color={s === 'delivered' ? 'green' : s === 'invoiced' ? 'purple' : 'orange'}>{s}</Tag> }]} /> },
          { key: 'invoices', label: t('sales.customerDetail.invoices'), children: <Table dataSource={invoices} rowKey="inv" pagination={false} size="small" columns={[{ title: t('sales.customerDetail.invoice'), dataIndex: 'inv' }, { title: t('sales.customerDetail.date'), dataIndex: 'date' }, { title: t('sales.customerDetail.amount'), dataIndex: 'amount', render: (v: number) => '$' + v.toLocaleString() }, { title: t('sales.customerDetail.dueDate'), dataIndex: 'dueDate' }, { title: t('sales.customerDetail.status'), dataIndex: 'status', render: (s: string) => <Tag color={s === 'paid' ? 'green' : 'red'}>{s}</Tag> }]} /> },
          { key: 'tickets', label: t('sales.customerDetail.supportTickets'), children: <Table dataSource={tickets} rowKey="id" pagination={false} size="small" columns={[{ title: t('sales.customerDetail.subject'), dataIndex: 'subject' }, { title: t('sales.customerDetail.priority'), dataIndex: 'priority', render: (p: string) => <Tag color={p === 'High' ? 'red' : 'orange'}>{p}</Tag> }, { title: t('sales.customerDetail.status'), dataIndex: 'status', render: (s: string) => <Tag color={s === 'open' ? 'blue' : 'green'}>{s}</Tag> }, { title: t('sales.customerDetail.created'), dataIndex: 'created' }]} /> },
          { key: 'activity', label: t('sales.customerDetail.activity'), children: <Timeline items={activityTimeline.map((a) => ({ children: <><Text strong>{a.action}</Text><br /><Text type="secondary">{a.detail} • {a.time}</Text></> }))} /> },
        ]} />
      </Card>
    </div>
  );
};
export default CustomerDetail;
