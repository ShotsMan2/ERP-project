import { Card, Descriptions, Tag, Table, Button, Space, Timeline, Typography, Row, Col, Statistic } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

const mockPO = { orderNumber: 'PO-2024-0156', supplier: 'TechSupply Inc.', supplierId: 'SUP001', orderDate: '2024-12-15', expectedDate: '2024-12-22', status: 'approved' as const, totalAmount: 45000, currency: 'USD', paymentTerms: 'Net 30', notes: 'Urgent order - please expedite', approvedBy: 'Carol Martinez', approvedAt: '2024-12-16' };

const poLines = [
  { id: '1', product: 'Business Laptop Pro 15"', sku: 'LAP-001', qty: 10, unitPrice: 2499.99, taxRate: '20%', total: 24999.90, received: 0 },
  { id: '2', product: '27" 4K Monitor', sku: 'MON-002', qty: 15, unitPrice: 599.99, taxRate: '20%', total: 8999.85, received: 15 },
  { id: '3', product: 'Mechanical Keyboard', sku: 'KEY-003', qty: 30, unitPrice: 149.99, taxRate: '20%', total: 4499.70, received: 0 },
  { id: '4', product: 'Wireless Mouse', sku: 'MOU-004', qty: 40, unitPrice: 79.99, taxRate: '20%', total: 3199.60, received: 0 },
  { id: '5', product: 'USB-C Docking Station', sku: 'DOCK-008', qty: 10, unitPrice: 249.99, taxRate: '20%', total: 2499.90, received: 0 },
];

const grnHistory = [
  { receiptNumber: 'GRN-2024-0089', date: '2024-12-19', receivedBy: 'John Smith', items: 15, status: 'completed' },
];

const approvalTimeline = [
  { action: 'Created', user: 'John Smith', date: '2024-12-15', time: '10:30 AM' },
  { action: 'Submitted for Approval', user: 'John Smith', date: '2024-12-15', time: '10:35 AM' },
  { action: 'Approved', user: 'Carol Martinez', date: '2024-12-16', time: '02:15 PM' },
];

const PurchaseOrderDetail: React.FC = () => {
  const navigate = useNavigate();
  const totalReceived = poLines.reduce((s, l) => s + l.received, 0);
  const totalQty = poLines.reduce((s, l) => s + l.qty, 0);

  return (
    <div className="p-6">
      <PageHeader title={mockPO.orderNumber} subtitle={'Supplier: ' + mockPO.supplier} onBack={() => navigate('/procurement/purchase-orders')}>
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => navigate('/procurement/purchase-orders/' + mockPO.orderNumber + '/edit')}>Edit PO</Button>
          <Button>Receive Goods</Button>
        </Space>
      </PageHeader>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}><Card><Statistic title="Total Amount" value={mockPO.totalAmount} prefix="$" precision={0} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Items" value={poLines.length} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Received" value={totalReceived} suffix={'/ ' + totalQty} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Status" value={mockPO.status.toUpperCase()} /></Card></Col>
      </Row>
      <Card>
        <Row gutter={24}>
          <Col span={16}>
            <Descriptions bordered column={2} size="small" className="mb-6">
              <Descriptions.Item label="PO Number">{mockPO.orderNumber}</Descriptions.Item>
              <Descriptions.Item label="Supplier"><a>{mockPO.supplier}</a></Descriptions.Item>
              <Descriptions.Item label="Order Date">{mockPO.orderDate}</Descriptions.Item>
              <Descriptions.Item label="Expected Date">{mockPO.expectedDate}</Descriptions.Item>
              <Descriptions.Item label="Status"><Tag color="blue">{mockPO.status.toUpperCase()}</Tag></Descriptions.Item>
              <Descriptions.Item label="Payment Terms">{mockPO.paymentTerms}</Descriptions.Item>
              <Descriptions.Item label="Approved By">{mockPO.approvedBy}</Descriptions.Item>
              <Descriptions.Item label="Approved At">{mockPO.approvedAt}</Descriptions.Item>
            </Descriptions>

            <Text strong className="text-base block mb-3">Line Items</Text>
            <Table dataSource={poLines} rowKey="id" pagination={false} size="small"
              columns={[
                { title: 'Product', dataIndex: 'product' }, { title: 'SKU', dataIndex: 'sku' },
                { title: 'Qty', dataIndex: 'qty' }, { title: 'Unit Price', dataIndex: 'unitPrice', render: (v: number) => '$' + v.toFixed(2) },
                { title: 'Tax', dataIndex: 'taxRate' }, { title: 'Total', dataIndex: 'total', render: (v: number) => '$' + v.toFixed(2) },
                { title: 'Received', dataIndex: 'received', render: (v: number) => <Tag color={v > 0 ? 'green' : 'default'}>{v}</Tag> },
              ]}
            />
          </Col>
          <Col span={8}>
            <Card title="Approval Timeline" size="small" className="mb-4">
              <Timeline items={approvalTimeline.map((t) => ({ children: <><Text strong>{t.action}</Text><br /><Text type="secondary">{t.user} · {t.date} {t.time}</Text></> }))} />
            </Card>
            <Card title="GRN History" size="small">
              <Table dataSource={grnHistory} rowKey="receiptNumber" pagination={false} size="small"
                columns={[{ title: 'Receipt', dataIndex: 'receiptNumber' }, { title: 'Date', dataIndex: 'date' }, { title: 'Items', dataIndex: 'items' }, { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color="green">{s}</Tag> }]} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PurchaseOrderDetail;
