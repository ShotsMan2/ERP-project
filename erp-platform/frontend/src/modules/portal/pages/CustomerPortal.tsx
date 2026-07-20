import { Card, Row, Col, Statistic, Table, Tag, Typography, Tabs, List, Button, Space, Badge } from 'antd';
import { ShoppingCartOutlined, FileTextOutlined, CustomerServiceOutlined, UserOutlined } from '@ant-design/icons';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

const recentOrders = [
  { id: 'SO-2024-0234', date: '2024-12-15', total: 28999.90, status: 'shipped', items: 3 },
  { id: 'SO-2024-0231', date: '2024-12-10', total: 45000.00, status: 'delivered', items: 5 },
  { id: 'SO-2024-0229', date: '2024-12-05', total: 7500.00, status: 'invoiced', items: 2 },
];
const invoices = [
  { inv: 'INV-2024-0892', date: '2024-12-16', amount: 28999.90, dueDate: '2025-01-15', status: 'unpaid' },
  { inv: 'INV-2024-0885', date: '2024-12-11', amount: 45000.00, dueDate: '2025-01-10', status: 'paid' },
];
const tickets = [
  { id: 'TK001', subject: 'Shipping status update', priority: 'Medium', status: 'open', updated: '2024-12-15' },
  { id: 'TK002', subject: 'Invoice question', priority: 'Low', status: 'resolved', updated: '2024-12-14' },
];

const CustomerPortal: React.FC = () => {
  return (
    <div className="p-6">
      <PageHeader title="Customer Portal" subtitle="Welcome back, Acme Corp" />

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}><Card><Statistic title="Open Orders" value={2} prefix={<ShoppingCartOutlined />} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Pending Invoices" value={1} prefix={<FileTextOutlined />} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Open Tickets" value={1} prefix={<CustomerServiceOutlined />} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Account Age" value={3} suffix="years" prefix={<UserOutlined />} /></Card></Col>
      </Row>

      <Card>
        <Tabs defaultActiveKey="orders"
          items={[
            { key: 'orders', label: 'My Orders', children: (
              <Table dataSource={recentOrders} rowKey="id" pagination={false} size="small"
                columns={[
                  { title: 'Order #', dataIndex: 'id', render: (v: string) => <a>{v}</a> },
                  { title: 'Date', dataIndex: 'date' }, { title: 'Items', dataIndex: 'items' },
                  { title: 'Total', dataIndex: 'total', render: (v: number) => '$' + v.toLocaleString() },
                  { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'delivered' ? 'green' : s === 'shipped' ? 'blue' : 'purple'}>{s}</Tag> },
                  { title: 'Action', render: () => <Button type="link" size="small">View</Button> },
                ]}
              />
            )},
            { key: 'invoices', label: 'Invoices', children: (
              <Table dataSource={invoices} rowKey="inv" pagination={false} size="small"
                columns={[
                  { title: 'Invoice #', dataIndex: 'inv' }, { title: 'Date', dataIndex: 'date' },
                  { title: 'Amount', dataIndex: 'amount', render: (v: number) => '$' + v.toLocaleString() },
                  { title: 'Due Date', dataIndex: 'dueDate' },
                  { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'paid' ? 'green' : 'red'}>{s}</Tag> },
                  { title: 'Action', render: () => <Button type="link" size="small">Pay Now</Button> },
                ]}
              />
            )},
            { key: 'tickets', label: 'Support Tickets', children: (
              <Table dataSource={tickets} rowKey="id" pagination={false} size="small"
                columns={[
                  { title: 'Subject', dataIndex: 'subject' }, { title: 'Priority', dataIndex: 'priority', render: (p: string) => <Tag color={p === 'High' ? 'red' : p === 'Medium' ? 'orange' : 'blue'}>{p}</Tag> },
                  { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'open' ? 'blue' : 'green'}>{s}</Tag> },
                  { title: 'Updated', dataIndex: 'updated' }, { title: 'Action', render: () => <Button type="link" size="small">View</Button> },
                ]}
              />
            )},
          ]}
        />
      </Card>
    </div>
  );
};
export default CustomerPortal;
