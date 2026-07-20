import { Card, Descriptions, Tag, Table, Button, Space, Timeline, Row, Col, Statistic, Typography } from 'antd';
import { EditOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

const mockSO = { orderNumber: 'SO-2024-0234', customer: 'Acme Corp', orderDate: '2024-12-15', deliveryDate: '2024-12-20', status: 'pending' as const, total: 28999.90, currency: 'USD', shippingAddress: '123 Main St, New York, NY 10001', notes: 'Handle with care' };
const soLines = [
  { id: '1', product: 'Business Laptop Pro 15"', sku: 'LAP-001', qty: 5, unitPrice: 2499.99, discount: 0, taxRate: '20%', total: 12499.95, deliveredQty: 0 },
  { id: '2', product: '27" 4K Monitor', sku: 'MON-002', qty: 10, unitPrice: 599.99, discount: 5, taxRate: '20%', total: 5699.91, deliveredQty: 0 },
  { id: '3', product: 'Mechanical Keyboard', sku: 'KEY-003', qty: 20, unitPrice: 149.99, discount: 10, taxRate: '20%', total: 2999.80, deliveredQty: 0 },
];
const shipments = [{ id: 'SH001', number: 'SH-2024-0089', date: '2024-12-18', carrier: 'FedEx', tracking: 'FX123456789', status: 'in_transit' }];
const invoiceStatus = [{ inv: 'INV-2024-0892', amount: 28999.90, status: 'unpaid' }];

const SalesOrderDetail: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <PageHeader title={mockSO.orderNumber} subtitle={'Customer: ' + mockSO.customer} onBack={() => navigate('/sales/orders')}>
        <Space><Button type="primary" icon={<EditOutlined />}>Edit Order</Button><Button icon={<ShoppingOutlined />}>Create Shipment</Button></Space>
      </PageHeader>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}><Card><Statistic title="Total Amount" value={mockSO.total} prefix="$" precision={2} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Items" value={soLines.length} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Delivered" value={0} suffix={'/ ' + soLines.reduce((s, l) => s + l.qty, 0)} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Status" value={mockSO.status.toUpperCase()} /></Card></Col>
      </Row>
      <Card>
        <Row gutter={24}>
          <Col span={16}>
            <Descriptions bordered column={2} size="small" className="mb-6">
              <Descriptions.Item label="Order Number">{mockSO.orderNumber}</Descriptions.Item>
              <Descriptions.Item label="Customer"><a>{mockSO.customer}</a></Descriptions.Item>
              <Descriptions.Item label="Order Date">{mockSO.orderDate}</Descriptions.Item>
              <Descriptions.Item label="Delivery Date">{mockSO.deliveryDate}</Descriptions.Item>
              <Descriptions.Item label="Status"><Tag color="orange">{mockSO.status.toUpperCase()}</Tag></Descriptions.Item>
              <Descriptions.Item label="Currency">{mockSO.currency}</Descriptions.Item>
              <Descriptions.Item label="Shipping Address" span={2}>{mockSO.shippingAddress}</Descriptions.Item>
            </Descriptions>
            <Text strong className="text-base block mb-3">Line Items</Text>
            <Table dataSource={soLines} rowKey="id" pagination={false} size="small"
              columns={[
                { title: 'Product', dataIndex: 'product' }, { title: 'SKU', dataIndex: 'sku' },
                { title: 'Qty', dataIndex: 'qty' }, { title: 'Unit Price', dataIndex: 'unitPrice', render: (v: number) => '$' + v.toFixed(2) },
                { title: 'Discount %', dataIndex: 'discount' }, { title: 'Tax', dataIndex: 'taxRate' },
                { title: 'Total', dataIndex: 'total', render: (v: number) => '$' + v.toFixed(2) },
                { title: 'Delivered', dataIndex: 'deliveredQty' },
              ]}
            />
          </Col>
          <Col span={8}>
            <Card title="Shipments" size="small" className="mb-4">
              <Table dataSource={shipments} rowKey="id" pagination={false} size="small"
                columns={[{ title: 'Number', dataIndex: 'number' }, { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color="blue">{s.replace('_', ' ')}</Tag> }]} />
            </Card>
            <Card title="Invoice Status" size="small">
              <Table dataSource={invoiceStatus} rowKey="inv" pagination={false} size="small"
                columns={[{ title: 'Invoice', dataIndex: 'inv' }, { title: 'Amount', dataIndex: 'amount', render: (v: number) => '$' + v.toFixed(2) }, { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color="red">{s}</Tag> }]} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
export default SalesOrderDetail;
