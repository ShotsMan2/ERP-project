import { Card, Tabs, Descriptions, Tag, Table, Button, Space, Typography, Row, Col, Statistic, Image, List } from 'antd';
import { EditOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

const mockProduct = {
  id: '1', sku: 'LAP-001', name: 'Business Laptop Pro 15"', category: 'Electronics',
  description: 'High-performance business laptop with 15.6" display, Intel i7, 16GB RAM, 512GB SSD.',
  price: 2499.99, cost: 1800, taxRate: '20% VAT', unit: 'pcs', barcode: '5901234567890',
  status: 'active' as const, createdAt: '2024-01-15',
};

const variants = [
  { id: 'v1', name: 'Silver / 16GB RAM / 512GB', sku: 'LAP-001-A', price: 2499.99, stock: 20, status: 'active' },
  { id: 'v2', name: 'Space Gray / 32GB RAM / 1TB', sku: 'LAP-001-B', price: 2999.99, stock: 15, status: 'active' },
  { id: 'v3', name: 'Black / 16GB RAM / 256GB', sku: 'LAP-001-C', price: 2199.99, stock: 0, status: 'discontinued' },
];

const stockLevels = [
  { warehouse: 'Main Warehouse', bin: 'A-01-01', quantity: 20, reserved: 3, available: 17 },
  { warehouse: 'Main Warehouse', bin: 'A-01-02', quantity: 15, reserved: 2, available: 13 },
  { warehouse: 'East Warehouse', bin: 'B-03-05', quantity: 10, reserved: 0, available: 10 },
];

const stockMovements = [
  { date: '2024-12-15', type: 'in', reference: 'PO-2024-0156', quantity: 50, from: '', to: 'Main- A-01-01' },
  { date: '2024-12-14', type: 'out', reference: 'SO-2024-0234', quantity: -2, from: 'Main- A-01-01', to: '' },
  { date: '2024-12-13', type: 'transfer', reference: 'XFER-2024-008', quantity: -10, from: 'Main- A-01-01', to: 'East- B-03-05' },
  { date: '2024-12-12', type: 'adjustment', reference: 'ADJ-2024-003', quantity: -1, from: 'Main- A-01-01', to: '', reason: 'Damaged' },
];

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <PageHeader title={mockProduct.name} subtitle={`SKU: ${mockProduct.sku}`} onBack={() => navigate('/inventory/products')}>
        <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/inventory/products/${id}/edit`)}>
          Edit Product
        </Button>
      </PageHeader>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}><Card><Statistic title="Price" value={mockProduct.price} prefix="$" precision={2} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Cost" value={mockProduct.cost} prefix="$" precision={2} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Margin" value={((mockProduct.price - mockProduct.cost) / mockProduct.price * 100).toFixed(1)} suffix="%" /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title="Total Stock" value={45} /></Card></Col>
      </Row>

      <Card>
        <Tabs defaultActiveKey="details"
          items={[
            {
              key: 'details', label: 'Details',
              children: (
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="Product Name">{mockProduct.name}</Descriptions.Item>
                  <Descriptions.Item label="SKU">{mockProduct.sku}</Descriptions.Item>
                  <Descriptions.Item label="Category"><Tag>{mockProduct.category}</Tag></Descriptions.Item>
                  <Descriptions.Item label="Unit">{mockProduct.unit}</Descriptions.Item>
                  <Descriptions.Item label="Barcode">{mockProduct.barcode}</Descriptions.Item>
                  <Descriptions.Item label="Tax Rate">{mockProduct.taxRate}</Descriptions.Item>
                  <Descriptions.Item label="Status"><Tag color="green">{mockProduct.status}</Tag></Descriptions.Item>
                  <Descriptions.Item label="Created">{mockProduct.createdAt}</Descriptions.Item>
                  <Descriptions.Item label="Description" span={2}>{mockProduct.description}</Descriptions.Item>
                </Descriptions>
              ),
            },
            {
              key: 'variants', label: `Variants (${variants.length})`,
              children: (
                <Table dataSource={variants} rowKey="id" pagination={false} size="small"
                  columns={[
                    { title: 'Name', dataIndex: 'name' },
                    { title: 'SKU', dataIndex: 'sku' },
                    { title: 'Price', dataIndex: 'price', render: (v: number) => `$${v.toFixed(2)}` },
                    { title: 'Stock', dataIndex: 'stock' },
                    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag> },
                  ]}
                />
              ),
            },
            {
              key: 'stock', label: 'Stock Levels',
              children: (
                <Table dataSource={stockLevels} rowKey={(r) => `${r.warehouse}-${r.bin}`} pagination={false} size="small"
                  columns={[
                    { title: 'Warehouse', dataIndex: 'warehouse' },
                    { title: 'Bin', dataIndex: 'bin' },
                    { title: 'Quantity', dataIndex: 'quantity' },
                    { title: 'Reserved', dataIndex: 'reserved' },
                    { title: 'Available', dataIndex: 'available', render: (v: number) => <span className={v <= 10 ? 'text-orange-500 font-semibold' : ''}>{v}</span> },
                  ]}
                />
              ),
            },
            {
              key: 'movements', label: 'Stock Movements',
              children: (
                <Table dataSource={stockMovements} rowKey={(r) => `${r.date}-${r.reference}`} pagination={false} size="small"
                  columns={[
                    { title: 'Date', dataIndex: 'date' },
                    { title: 'Type', dataIndex: 'type', render: (t: string) => <Tag color={t === 'in' ? 'green' : t === 'out' ? 'red' : 'blue'}>{t}</Tag> },
                    { title: 'Reference', dataIndex: 'reference' },
                    { title: 'Qty', dataIndex: 'quantity', render: (v: number) => <span className={v > 0 ? 'text-green-600' : 'text-red-600'}>{v > 0 ? `+${v}` : v}</span> },
                    { title: 'From', dataIndex: 'from' },
                    { title: 'To', dataIndex: 'to' },
                  ]}
                />
              ),
            },
            {
              key: 'images', label: 'Images',
              children: (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4 flex items-center justify-center h-40 bg-gray-50">
                      <Text type="secondary">Image {i}</Text>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default ProductDetail;
