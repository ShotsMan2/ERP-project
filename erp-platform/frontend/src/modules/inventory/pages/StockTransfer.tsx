import { useState } from 'react';
import { Card, Form, Select, InputNumber, Input, Button, Row, Col, Table, Typography, Space, message, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';

const { TextArea } = Input;
const { Text } = Typography;

interface TransferLine {
  key: string;
  product: string;
  sku: string;
  quantity: number;
  unit: string;
}

const StockTransfer: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [lines, setLines] = useState<TransferLine[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addLine = () => {
    const newLine: TransferLine = {
      key: Date.now().toString(),
      product: '',
      sku: '',
      quantity: 1,
      unit: 'pcs',
    };
    setLines([...lines, newLine]);
  };

  const removeLine = (key: string) => {
    setLines(lines.filter((l) => l.key !== key));
  };

  const updateLine = (key: string, field: keyof TransferLine, value: any) => {
    setLines(lines.map((l) => (l.key === key ? { ...l, [field]: value } : l)));
  };

  const onFinish = async () => {
    if (lines.length === 0) {
      message.error('Add at least one product to transfer');
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      message.success('Stock transfer request submitted for approval');
      navigate('/inventory/stock-levels');
    } catch {
      message.error('Failed to create transfer');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'Product', dataIndex: 'product', key: 'product', width: 200,
      render: (v: string, record: TransferLine) => (
        <Select
          value={v || undefined}
          onChange={(val) => {
            const selected = productOptions.find((p) => p.value === val);
            updateLine(record.key, 'product', selected?.label || val);
            updateLine(record.key, 'sku', selected?.sku || '');
          }}
          showSearch
          placeholder="Select product"
          style={{ width: '100%' }}
          options={productOptions}
        />
      ),
    },
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    {
      title: 'Quantity', dataIndex: 'quantity', key: 'quantity', width: 120,
      render: (v: number, record: TransferLine) => (
        <InputNumber min={1} value={v} onChange={(val) => updateLine(record.key, 'quantity', val)} className="w-full" />
      ),
    },
    { title: 'Unit', dataIndex: 'unit', key: 'unit' },
    {
      title: 'Action', key: 'action', width: 60,
      render: (_: unknown, record: TransferLine) => (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeLine(record.key)} />
      ),
    },
  ];

  const productOptions = [
    { value: 'LAP-001', label: 'Business Laptop Pro 15"', sku: 'LAP-001' },
    { value: 'MON-002', label: '27" 4K Monitor', sku: 'MON-002' },
    { value: 'KEY-003', label: 'Mechanical Keyboard', sku: 'KEY-003' },
    { value: 'MOU-004', label: 'Wireless Mouse', sku: 'MOU-004' },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Stock Transfer" subtitle="Transfer stock between warehouses" onBack={() => navigate('/inventory/stock-levels')}>
        <Button type="primary" icon={<SaveOutlined />} loading={submitting} onClick={onFinish}>
          Submit Transfer
        </Button>
      </PageHeader>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Source Warehouse" name="sourceWarehouse" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="main">Main Warehouse</Select.Option>
                      <Select.Option value="east">East Warehouse</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Destination Warehouse" name="destWarehouse" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="main">Main Warehouse</Select.Option>
                      <Select.Option value="east">East Warehouse</Select.Option>
                      <Select.Option value="west">West Warehouse</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        <Col span={24}>
          <Card
            title="Transfer Items"
            extra={<Button type="dashed" icon={<PlusOutlined />} onClick={addLine}>Add Item</Button>}
          >
            <Table
              dataSource={lines}
              columns={columns}
              pagination={false}
              rowKey="key"
              locale={{ emptyText: 'No items added. Click "Add Item" to start.' }}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Notes & Approval">
            <Form.Item label="Transfer Notes">
              <TextArea rows={3} placeholder="Reason for transfer, special instructions..." />
            </Form.Item>
            <Form.Item label="Approval Required">
              <Tag color="orange">Pending Approval</Tag>
              <Text type="secondary" className="ml-2">Transfers over $1,000 require manager approval</Text>
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StockTransfer;
