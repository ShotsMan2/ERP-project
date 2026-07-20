import { useState } from 'react';
import { Card, Form, Select, Input, InputNumber, Button, Row, Col, Table, Typography, message, Tag } from 'antd';
import { SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;
const { TextArea } = Input;
interface ShipmentLine { key: string; product: string; sku: string; qty: number; }

const ShipmentForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [lines, setLines] = useState<ShipmentLine[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSOSelect = (value: string) => {
    setLines([
      { key: '1', product: 'Business Laptop Pro 15"', sku: 'LAP-001', qty: 3 },
      { key: '2', product: '27" 4K Monitor', sku: 'MON-002', qty: 5 },
    ]);
  };

  const onFinish = async () => {
    setSubmitting(true);
    try { await new Promise((r) => setTimeout(r, 1000)); message.success('Shipment created'); navigate('/sales/orders'); }
    catch { message.error('Failed to create shipment'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title="Create Shipment" subtitle="Create shipment from sales order" onBack={() => navigate('/sales/orders')}>
        <Button type="primary" icon={<SaveOutlined />} loading={submitting} onClick={onFinish}>Create Shipment</Button>
      </PageHeader>
      <Card>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}><Form.Item label="Sales Order" name="soNumber" rules={[{ required: true }]}><Select showSearch placeholder="Select SO" onChange={handleSOSelect}><Select.Option value="SO-2024-0234">SO-2024-0234 - Acme Corp</Select.Option><Select.Option value="SO-2024-0233">SO-2024-0233 - GlobalTech Inc.</Select.Option></Select></Form.Item></Col>
            <Col span={8}><Form.Item label="Carrier" name="carrier"><Select><Select.Option value="fedex">FedEx</Select.Option><Select.Option value="ups">UPS</Select.Option><Select.Option value="dhl">DHL</Select.Option></Select></Form.Item></Col>
            <Col span={8}><Form.Item label="Tracking Number" name="tracking"><Input /></Form.Item></Col>
          </Row>
        </Form>
        {lines.length > 0 && (
          <>
            <Text strong className="block mb-3">Items to Ship</Text>
            <Table dataSource={lines} rowKey="key" pagination={false} size="small"
              columns={[{ title: 'Product', dataIndex: 'product' }, { title: 'SKU', dataIndex: 'sku' }, { title: 'Qty to Ship', dataIndex: 'qty', render: (v: number) => <InputNumber min={1} max={v} value={v} /> }]} />
          </>
        )}
      </Card>
    </div>
  );
};
export default ShipmentForm;
