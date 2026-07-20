import { Card, Descriptions, Tag, Table, Row, Col, Statistic, Typography, Space, Button, Tabs } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

const mockInvoice = { invoiceNumber: 'INV-2024-0892', type: 'sales', customer: 'Acme Corp', issueDate: '2024-12-16', dueDate: '2025-01-15', total: 28999.90, taxAmount: 4833.32, subtotal: 24166.58, status: 'unpaid' as const, currency: 'USD', notes: 'Payment due within 30 days' };
const lineItems = [
  { id: '1', product: 'Business Laptop Pro 15"', qty: 5, unitPrice: 2499.99, taxRate: '20%', total: 12499.95 },
  { id: '2', product: '27" 4K Monitor', qty: 10, unitPrice: 599.99, taxRate: '20%', total: 5999.90 },
  { id: '3', product: 'Mechanical Keyboard', qty: 20, unitPrice: 149.99, taxRate: '20%', total: 2999.80 },
];
const payments = [{ id: 'p1', date: '-', amount: 0, method: '-', reference: '-', status: '-' }];

const InvoiceDetail: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <PageHeader title={'Invoice ' + mockInvoice.invoiceNumber} subtitle={mockInvoice.customer} onBack={() => navigate('/accounting/invoices')}>
        <Space><Button icon={<DownloadOutlined />}>Download PDF</Button>{mockInvoice.status === 'unpaid' && <Button type="primary">Record Payment</Button>}</Space>
      </PageHeader>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}><Card><Statistic title="Total" value={mockInvoice.total} prefix="$" precision={2} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Subtotal" value={mockInvoice.subtotal} prefix="$" precision={2} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Tax" value={mockInvoice.taxAmount} prefix="$" precision={2} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Status" value={mockInvoice.status.toUpperCase()} /></Card></Col>
      </Row>
      <Card>
        <Tabs defaultActiveKey="details" items={[
          { key: 'details', label: 'Details', children: (
            <div>
              <Descriptions bordered column={2} size="small" className="mb-6">
                <Descriptions.Item label="Invoice #">{mockInvoice.invoiceNumber}</Descriptions.Item>
                <Descriptions.Item label="Type"><Tag color="blue">{mockInvoice.type.toUpperCase()}</Tag></Descriptions.Item>
                <Descriptions.Item label="Customer">{mockInvoice.customer}</Descriptions.Item>
                <Descriptions.Item label="Status"><Tag color="orange">{mockInvoice.status}</Tag></Descriptions.Item>
                <Descriptions.Item label="Issue Date">{mockInvoice.issueDate}</Descriptions.Item>
                <Descriptions.Item label="Due Date"><span className="text-orange-500">{mockInvoice.dueDate}</span></Descriptions.Item>
                <Descriptions.Item label="Currency">{mockInvoice.currency}</Descriptions.Item>
                <Descriptions.Item label="Notes">{mockInvoice.notes}</Descriptions.Item>
              </Descriptions>
              <Text strong className="text-base block mb-3">Line Items</Text>
              <Table dataSource={lineItems} rowKey="id" pagination={false} size="small"
                columns={[{ title: 'Product', dataIndex: 'product' }, { title: 'Qty', dataIndex: 'qty' }, { title: 'Unit Price', dataIndex: 'unitPrice', render: (v: number) => '$' + v.toFixed(2) }, { title: 'Tax', dataIndex: 'taxRate' }, { title: 'Total', dataIndex: 'total', render: (v: number) => '$' + v.toFixed(2) }]} />
            </div>
          )},
          { key: 'payments', label: 'Payment History', children: (
            <Table dataSource={payments} rowKey="id" pagination={false} size="small"
              columns={[{ title: 'Date', dataIndex: 'date' }, { title: 'Amount', dataIndex: 'amount', render: (v: number) => v ? '$' + v.toFixed(2) : '-' }, { title: 'Method', dataIndex: 'method' }, { title: 'Reference', dataIndex: 'reference' }, { title: 'Status', dataIndex: 'status' }]} />
          )},
          { key: 'pdf', label: 'PDF Preview', children: <div className="text-center py-12 bg-gray-50 rounded-lg"><Text type="secondary">PDF preview will be rendered here</Text></div> },
        ]} />
      </Card>
    </div>
  );
};
export default InvoiceDetail;
