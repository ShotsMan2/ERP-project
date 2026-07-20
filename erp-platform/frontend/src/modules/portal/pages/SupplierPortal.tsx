import { Card, Row, Col, Statistic, Table, Tag, Typography, Tabs, Button, Space } from 'antd';
import { ShoppingCartOutlined, FileTextOutlined, CheckCircleOutlined, TruckOutlined } from '@ant-design/icons';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

const pendingPOs = [
  { po: 'PO-2024-0156', date: '2024-12-15', total: 45000, status: 'pending', items: 5 },
  { po: 'PO-2024-0152', date: '2024-12-08', total: 32000, status: 'draft', items: 6 },
];
const supplierInvoices = [
  { inv: 'INV-2024-0890', date: '2024-12-14', amount: 45000, dueDate: '2025-01-13', status: 'unpaid' },
  { inv: 'INV-2024-0887', date: '2024-12-10', amount: 12500, dueDate: '2024-12-25', status: 'paid' },
];
const deliveries = [
  { delivery: 'DEL-2024-0089', po: 'PO-2024-0154', date: '2024-12-19', status: 'in_transit' },
  { delivery: 'DEL-2024-0088', po: 'PO-2024-0153', date: '2024-12-17', status: 'delivered' },
];

const SupplierPortal: React.FC = () => {
  return (
    <div className="p-6">
      <PageHeader title="Supplier Portal" subtitle="Welcome, TechSupply Inc." />

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}><Card><Statistic title="Open POs" value={2} prefix={<ShoppingCartOutlined />} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Pending Invoices" value={1} prefix={<FileTextOutlined />} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Deliveries" value={1} prefix={<TruckOutlined />} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Completed" value={15} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Card>
        <Tabs defaultActiveKey="pos"
          items={[
            { key: 'pos', label: 'Purchase Orders', children: (
              <Table dataSource={pendingPOs} rowKey="po" pagination={false} size="small"
                columns={[
                  { title: 'PO #', dataIndex: 'po' }, { title: 'Date', dataIndex: 'date' },
                  { title: 'Items', dataIndex: 'items' }, { title: 'Total', dataIndex: 'total', render: (v: number) => '$' + v.toLocaleString() },
                  { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'pending' ? 'orange' : 'default'}>{s}</Tag> },
                  { title: 'Action', render: () => <Button type="link" size="small">View</Button> },
                ]}
              />
            )},
            { key: 'invoices', label: 'Invoices', children: (
              <Table dataSource={supplierInvoices} rowKey="inv" pagination={false} size="small"
                columns={[
                  { title: 'Invoice #', dataIndex: 'inv' }, { title: 'Date', dataIndex: 'date' },
                  { title: 'Amount', dataIndex: 'amount', render: (v: number) => '$' + v.toLocaleString() },
                  { title: 'Due Date', dataIndex: 'dueDate' },
                  { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'paid' ? 'green' : 'red'}>{s}</Tag> },
                  { title: 'Action', render: () => <Button type="link" size="small">View</Button> },
                ]}
              />
            )},
            { key: 'deliveries', label: 'Deliveries', children: (
              <Table dataSource={deliveries} rowKey="delivery" pagination={false} size="small"
                columns={[
                  { title: 'Delivery #', dataIndex: 'delivery' }, { title: 'PO Reference', dataIndex: 'po' },
                  { title: 'Date', dataIndex: 'date' },
                  { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'delivered' ? 'green' : 'blue'}>{s.replace('_', ' ')}</Tag> },
                  { title: 'Action', render: () => <Button type="link" size="small">Update</Button> },
                ]}
              />
            )},
          ]}
        />
      </Card>
    </div>
  );
};
export default SupplierPortal;
