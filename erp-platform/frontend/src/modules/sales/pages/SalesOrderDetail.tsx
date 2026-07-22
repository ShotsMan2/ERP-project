import { Card, Descriptions, Tag, Table, Button, Space, Timeline, Row, Col, Statistic, Typography } from 'antd';
import { EditOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <PageHeader title={mockSO.orderNumber} subtitle={t('sales.salesOrderDetail.customer', { name: mockSO.customer })} onBack={() => navigate('/sales/orders')}>
        <Space><Button type="primary" icon={<EditOutlined />}>{t('sales.salesOrderDetail.editOrder')}</Button><Button icon={<ShoppingOutlined />}>{t('sales.salesOrderDetail.createShipment')}</Button></Space>
      </PageHeader>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}><Card><Statistic title={t('sales.salesOrderDetail.totalAmount')} value={mockSO.total} prefix="$" precision={2} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title={t('sales.salesOrderDetail.items')} value={soLines.length} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title={t('sales.salesOrderDetail.delivered')} value={0} suffix={'/ ' + soLines.reduce((s, l) => s + l.qty, 0)} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title={t('sales.salesOrderDetail.status')} value={mockSO.status.toUpperCase()} /></Card></Col>
      </Row>
      <Card>
        <Row gutter={24}>
          <Col span={16}>
            <Descriptions bordered column={2} size="small" className="mb-6">
              <Descriptions.Item label={t('sales.salesOrderDetail.orderNumber')}>{mockSO.orderNumber}</Descriptions.Item>
              <Descriptions.Item label={t('sales.salesOrderDetail.customer')}><a>{mockSO.customer}</a></Descriptions.Item>
              <Descriptions.Item label={t('sales.salesOrderDetail.orderDate')}>{mockSO.orderDate}</Descriptions.Item>
              <Descriptions.Item label={t('sales.salesOrderDetail.deliveryDate')}>{mockSO.deliveryDate}</Descriptions.Item>
              <Descriptions.Item label={t('sales.salesOrderDetail.status')}><Tag color="orange">{mockSO.status.toUpperCase()}</Tag></Descriptions.Item>
              <Descriptions.Item label={t('sales.salesOrderDetail.currency')}>{mockSO.currency}</Descriptions.Item>
              <Descriptions.Item label={t('sales.salesOrderDetail.shippingAddress')} span={2}>{mockSO.shippingAddress}</Descriptions.Item>
            </Descriptions>
            <Text strong className="text-base block mb-3">{t('sales.salesOrderDetail.lineItems')}</Text>
            <Table dataSource={soLines} rowKey="id" pagination={false} size="small"
              columns={[
                { title: t('sales.salesOrderDetail.product'), dataIndex: 'product' }, { title: t('sales.salesOrderDetail.sku'), dataIndex: 'sku' },
                { title: t('sales.salesOrderDetail.qty'), dataIndex: 'qty' }, { title: t('sales.salesOrderDetail.unitPrice'), dataIndex: 'unitPrice', render: (v: number) => '$' + v.toFixed(2) },
                { title: t('sales.salesOrderDetail.discountPercent'), dataIndex: 'discount' }, { title: t('sales.salesOrderDetail.tax'), dataIndex: 'taxRate' },
                { title: t('sales.salesOrderDetail.total'), dataIndex: 'total', render: (v: number) => '$' + v.toFixed(2) },
                { title: t('sales.salesOrderDetail.delivered'), dataIndex: 'deliveredQty' },
              ]}
            />
          </Col>
          <Col span={8}>
            <Card title={t('sales.salesOrderDetail.shipments')} size="small" className="mb-4">
              <Table dataSource={shipments} rowKey="id" pagination={false} size="small"
                columns={[{ title: t('sales.salesOrderDetail.number'), dataIndex: 'number' }, { title: t('sales.salesOrderDetail.status'), dataIndex: 'status', render: (s: string) => <Tag color="blue">{s.replace('_', ' ')}</Tag> }]} />
            </Card>
            <Card title={t('sales.salesOrderDetail.invoiceStatus')} size="small">
              <Table dataSource={invoiceStatus} rowKey="inv" pagination={false} size="small"
                columns={[{ title: t('sales.salesOrderDetail.invoice'), dataIndex: 'inv' }, { title: t('sales.salesOrderDetail.amount'), dataIndex: 'amount', render: (v: number) => '$' + v.toFixed(2) }, { title: t('sales.salesOrderDetail.status'), dataIndex: 'status', render: (s: string) => <Tag color="red">{s}</Tag> }]} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
export default SalesOrderDetail;
