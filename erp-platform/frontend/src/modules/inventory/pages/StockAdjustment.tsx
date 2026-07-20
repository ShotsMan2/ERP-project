import { useState } from 'react';
import { Card, Form, Select, InputNumber, Input, Button, Row, Col, Typography, message, Descriptions, Tag } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';

const { TextArea } = Input;
const { Text } = Typography;

interface AdjustmentFormData {
  product: string;
  warehouse: string;
  bin: string;
  adjustmentType: string;
  quantity: number;
  reason: string;
  reference: string;
  notes: string;
}

const StockAdjustment: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<AdjustmentFormData>();
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [preview, setPreview] = useState<{ currentStock: number; newStock: number } | null>(null);

  const watchType = Form.useWatch('adjustmentType', form);
  const watchQty = Form.useWatch('quantity', form);

  const handleProductChange = (value: string) => {
    setSelectedProduct(value);
    if (value) {
      setPreview({ currentStock: 45, newStock: 45 });
    }
  };

  const handleQtyChange = (value: number | null) => {
    if (selectedProduct && value) {
      const current = 45;
      const delta = watchType === 'addition' ? value : -value;
      setPreview({ currentStock: current, newStock: current + delta });
    }
  };

  const onFinish = async (values: AdjustmentFormData) => {
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      message.success('Stock adjustment completed successfully');
      navigate('/inventory/stock-levels');
    } catch {
      message.error('Failed to process adjustment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <PageHeader title="Stock Adjustment" subtitle="Adjust inventory quantities" onBack={() => navigate('/inventory/stock-levels')}>
        <Button type="primary" icon={<SaveOutlined />} loading={submitting} onClick={() => form.submit()}>
          Save Adjustment
        </Button>
      </PageHeader>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Adjustment Details">
            <Form<AdjustmentFormData>
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onValuesChange={(changed) => {
                if (changed.quantity || changed.adjustmentType) {
                  handleQtyChange(form.getFieldValue('quantity'));
                }
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Product" name="product" rules={[{ required: true }]}>
                    <Select showSearch placeholder="Search product..." onChange={handleProductChange}>
                      <Select.Option value="LAP-001">Business Laptop Pro 15" (LAP-001)</Select.Option>
                      <Select.Option value="MON-002">27" 4K Monitor (MON-002)</Select.Option>
                      <Select.Option value="KEY-003">Mechanical Keyboard (KEY-003)</Select.Option>
                      <Select.Option value="MOU-004">Wireless Mouse (MOU-004)</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Warehouse" name="warehouse" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="main">Main Warehouse</Select.Option>
                      <Select.Option value="east">East Warehouse</Select.Option>
                      <Select.Option value="west">West Warehouse</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Bin Location" name="bin" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="A-01-01">A-01-01</Select.Option>
                      <Select.Option value="A-01-02">A-01-02</Select.Option>
                      <Select.Option value="B-01-01">B-01-01</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Adjustment Type" name="adjustmentType" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="addition">Add Stock (+)</Select.Option>
                      <Select.Option value="removal">Remove Stock (-)</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Quantity" name="quantity" rules={[{ required: true, type: 'number', min: 1 }]}>
                    <InputNumber min={1} className="w-full" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Reference Document" name="reference">
                    <Input placeholder="Optional reference number" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Reason" name="reason" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="damaged">Damaged / Defective</Select.Option>
                  <Select.Option value="lost">Lost / Missing</Select.Option>
                  <Select.Option value="found">Found / Discovered</Select.Option>
                  <Select.Option value="count">Physical Count Difference</Select.Option>
                  <Select.Option value="return">Customer Return</Select.Option>
                  <Select.Option value="quality">Quality Control Reject</Select.Option>
                  <Select.Option value="other">Other</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Notes" name="notes">
                <TextArea rows={3} placeholder="Additional notes about this adjustment..." />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Preview">
            {preview ? (
              <div className="space-y-4">
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="Current Stock">
                    <Text strong>{preview.currentStock}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Adjustment">
                    <Tag color={watchType === 'addition' ? 'green' : 'red'}>
                      {watchType === 'addition' ? `+${watchQty || 0}` : `-${watchQty || 0}`}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="New Stock">
                    <Text strong className={preview.newStock < 0 ? 'text-red-500' : ''}>{preview.newStock}</Text>
                  </Descriptions.Item>
                </Descriptions>
                {preview.newStock < 0 && (
                  <div className="text-red-500 text-sm">Warning: New stock will be negative!</div>
                )}
              </div>
            ) : (
              <Text type="secondary">Select a product to see preview</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StockAdjustment;
