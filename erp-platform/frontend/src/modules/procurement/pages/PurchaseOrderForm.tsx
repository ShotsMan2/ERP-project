import { useState } from 'react';
import { Card, Form, Select, InputNumber, Input, Button, Row, Col, Table, Typography, Space, message, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;
const { TextArea } = Input;
interface POLine { key: string; product: string; sku: string; qty: number; unitPrice: number; taxRate: string; total: number; }

const PurchaseOrderForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [lines, setLines] = useState<POLine[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const calcTotal = (qty: number, price: number) => qty * price;
  const addLine = () => { setLines([...lines, { key: Date.now().toString(), product: '', sku: '', qty: 1, unitPrice: 0, taxRate: '20%', total: 0 }]); };
  const removeLine = (key: string) => setLines(lines.filter((l) => l.key !== key));
  const updateLine = (key: string, field: string, value: any) => {
    setLines(lines.map((l) => {
      if (l.key !== key) return l;
      const updated = { ...l, [field]: value };
      if (field === 'qty' || field === 'unitPrice') updated.total = calcTotal(field === 'qty' ? value : l.qty, field === 'unitPrice' ? value : l.unitPrice);
      return updated;
    }));
  };

  const grandTotal = lines.reduce((s, l) => s + l.total, 0);

  const onFinish = async () => {
    if (lines.length === 0) { message.error('Add at least one line item'); return; }
    setSubmitting(true);
    try { await new Promise((r) => setTimeout(r, 1500)); message.success('Purchase order created successfully'); navigate('/procurement/purchase-orders'); }
    catch { message.error('Failed to create purchase order'); }
    finally { setSubmitting(false); }
  };

  const lineColumns = [
    { title: 'Product', dataIndex: 'product', key: 'product', width: 200,
      render: (v: string, r: POLine) => (
        <Select value={v || undefined} onChange={(val) => { const p = products.find((x) => x.value === val); updateLine(r.key, 'product', p?.label || val); updateLine(r.key, 'sku', p?.sku || ''); updateLine(r.key, 'unitPrice', p?.price || 0); }} showSearch placeholder="Select" style={{ width: '100%' }}
          options={products.map((p) => ({ value: p.value, label: p.label }))} />
      ),
    },
    { title: 'SKU', dataIndex: 'sku', key: 'sku', width: 100 },
    { title: 'Qty', dataIndex: 'qty', key: 'qty', width: 80, render: (v: number, r: POLine) => <InputNumber min={1} value={v} onChange={(val) => updateLine(r.key, 'qty', val)} className="w-full" /> },
    { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice', width: 120, render: (v: number, r: POLine) => <InputNumber min={0} prefix="$" value={v} onChange={(val) => updateLine(r.key, 'unitPrice', val)} className="w-full" /> },
    { title: 'Tax', dataIndex: 'taxRate', key: 'taxRate', width: 80, render: (v: string, r: POLine) => <Select value={v} onChange={(val) => updateLine(r.key, 'taxRate', val)} options={[{ value: '0%', label: '0%' }, { value: '8%', label: '8%' }, { value: '20%', label: '20%' }]} /> },
    { title: 'Total', dataIndex: 'total', key: 'total', render: (v: number) => '$' + v.toFixed(2) },
    { title: '', key: 'action', width: 50, render: (_: unknown, r: POLine) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeLine(r.key)} /> },
  ];

  const products = [
    { value: 'LAP-001', label: 'Business Laptop Pro 15"', sku: 'LAP-001', price: 2499.99 },
    { value: 'MON-002', label: '27" 4K Monitor', sku: 'MON-002', price: 599.99 },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Create Purchase Order" subtitle="Create a new purchase order" onBack={() => navigate('/procurement/purchase-orders')}>
        <Button type="primary" icon={<SaveOutlined />} loading={submitting} onClick={onFinish}>Create PO</Button>
      </PageHeader>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Supplier" name="supplier" rules={[{ required: true }]}>
                    <Select showSearch placeholder="Select supplier">
                      <Select.Option value="SUP001">TechSupply Inc.</Select.Option>
                      <Select.Option value="SUP002">OfficeWorld Ltd.</Select.Option>
                      <Select.Option value="SUP003">Global Parts Co.</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Payment Terms" name="paymentTerms" initialValue="net30">
                    <Select>
                      <Select.Option value="net15">Net 15</Select.Option>
                      <Select.Option value="net30">Net 30</Select.Option>
                      <Select.Option value="net60">Net 60</Select.Option>
                      <Select.Option value="cod">Cash on Delivery</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Currency" name="currency" initialValue="USD">
                    <Select><Select.Option value="USD">USD</Select.Option><Select.Option value="EUR">EUR</Select.Option><Select.Option value="TRY">TRY</Select.Option></Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Notes" name="notes"><TextArea rows={2} /></Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Line Items" extra={<Button type="dashed" icon={<PlusOutlined />} onClick={addLine}>Add Item</Button>}>
            <Table dataSource={lines} columns={lineColumns} pagination={false} rowKey="key" />
            <Divider />
            <div className="text-right"><Text strong className="text-lg">Grand Total: ${grandTotal.toFixed(2)}</Text></div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PurchaseOrderForm;
