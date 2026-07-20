import { useState } from 'react';
import { Card, Form, Select, InputNumber, Input, Button, Row, Col, Table, Typography, Space, message, Tag } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';

const { TextArea } = Input;
interface GRNLine { key: string; poLine: string; product: string; expectedQty: number; receivedQty: number; bin: string; }

const GoodsReceipt: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedPO, setSelectedPO] = useState<string>('');
  const [lines, setLines] = useState<GRNLine[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handlePOSelect = (value: string) => {
    setSelectedPO(value);
    setLines([
      { key: '1', poLine: '1', product: 'Business Laptop Pro 15"', expectedQty: 10, receivedQty: 0, bin: '' },
      { key: '2', poLine: '2', product: '27" 4K Monitor', expectedQty: 15, receivedQty: 0, bin: '' },
    ]);
  };

  const updateLine = (key: string, field: string, value: any) => {
    setLines(lines.map((l) => l.key === key ? { ...l, [field]: value } : l));
  };

  const onFinish = async () => {
    if (lines.some((l) => l.receivedQty <= 0)) { message.error('All lines must have a received quantity'); return; }
    setSubmitting(true);
    try { await new Promise((r) => setTimeout(r, 1500)); message.success('Goods receipt created successfully'); navigate('/procurement/purchase-orders'); }
    catch { message.error('Failed to create goods receipt'); }
    finally { setSubmitting(false); }
  };

  const columns = [
    { title: 'PO Line', dataIndex: 'poLine', key: 'poLine' },
    { title: 'Product', dataIndex: 'product', key: 'product' },
    { title: 'Expected Qty', dataIndex: 'expectedQty', key: 'expectedQty' },
    { title: 'Received Qty', dataIndex: 'receivedQty', key: 'receivedQty', render: (v: number, r: GRNLine) => <InputNumber min={0} max={r.expectedQty} value={v} onChange={(val) => updateLine(r.key, 'receivedQty', val)} /> },
    { title: 'Bin Location', dataIndex: 'bin', key: 'bin', render: (v: string, r: GRNLine) => <Select value={v || undefined} onChange={(val) => updateLine(r.key, 'bin', val)} placeholder="Select bin" style={{ width: 140 }} options={[{ value: 'A-01-01', label: 'A-01-01' }, { value: 'A-01-02', label: 'A-01-02' }, { value: 'B-01-01', label: 'B-01-01' }]} /> },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Goods Receipt" subtitle="Receive goods against a purchase order" onBack={() => navigate('/procurement/purchase-orders')}>
        <Button type="primary" icon={<SaveOutlined />} loading={submitting} onClick={onFinish}>Save Receipt</Button>
      </PageHeader>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Purchase Order" name="poNumber" rules={[{ required: true }]}>
                    <Select showSearch placeholder="Select PO" onChange={handlePOSelect}>
                      <Select.Option value="PO-2024-0156">PO-2024-0156 - TechSupply Inc.</Select.Option>
                      <Select.Option value="PO-2024-0155">PO-2024-0155 - OfficeWorld Ltd.</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Receipt Date" name="receiptDate" initialValue="Today">Today</Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Reference" name="reference"><Input placeholder="Optional delivery note #" /></Form.Item>
                </Col>
              </Row>
              {selectedPO && (
                <div className="mb-4"><Tag color="blue">PO-2024-0156</Tag> <Tag color="green">TechSupply Inc.</Tag> <span className="text-sm text-gray-500 ml-2">Expected: 2024-12-22</span></div>
              )}
            </Form>
          </Card>
        </Col>
        {selectedPO && (
          <Col span={24}>
            <Card title="Receipt Lines">
              <Table dataSource={lines} columns={columns} pagination={false} rowKey="key" />
              <Form.Item label="Notes" className="mt-4"><TextArea rows={2} placeholder="Quality check notes, damages, etc..." /></Form.Item>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default GoodsReceipt;
