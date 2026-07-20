import { useState } from 'react';
import { Card, Form, Select, Input, InputNumber, Button, Row, Col, Table, Typography, DatePicker, message, Divider } from 'antd';
import { SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

interface InvoiceLine { key: string; product: string; qty: number; unitPrice: number; taxRate: string; total: number; }

const InvoiceForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [lines, setLines] = useState<InvoiceLine[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addLine = () => setLines([...lines, { key: Date.now().toString(), product: '', qty: 1, unitPrice: 0, taxRate: '20%', total: 0 }]);
  const removeLine = (key: string) => setLines(lines.filter((l) => l.key !== key));
  const updateLine = (key: string, field: string, value: any) => setLines(lines.map((l) => {
    if (l.key !== key) return l;
    const updated = { ...l, [field]: value };
    updated.total = (field === 'qty' ? value : l.qty) * (field === 'unitPrice' ? value : l.unitPrice);
    return updated;
  }));
  const grandTotal = lines.reduce((s, l) => s + l.total, 0);

  const columns = [
    { title: 'Product', dataIndex: 'product', render: (v: string, r: InvoiceLine) => <Input value={v} onChange={(e) => updateLine(r.key, 'product', e.target.value)} placeholder="Product name" /> },
    { title: 'Qty', dataIndex: 'qty', width: 80, render: (v: number, r: InvoiceLine) => <InputNumber min={1} value={v} onChange={(val) => updateLine(r.key, 'qty', val)} className="w-full" /> },
    { title: 'Unit Price', dataIndex: 'unitPrice', width: 120, render: (v: number, r: InvoiceLine) => <InputNumber min={0} prefix="$" value={v} onChange={(val) => updateLine(r.key, 'unitPrice', val)} className="w-full" /> },
    { title: 'Tax', dataIndex: 'taxRate', width: 80, render: (v: string, r: InvoiceLine) => <Select value={v} onChange={(val) => updateLine(r.key, 'taxRate', val)} options={[{ value: '0%', label: '0%' }, { value: '8%', label: '8%' }, { value: '20%', label: '20%' }]} /> },
    { title: 'Total', dataIndex: 'total', render: (v: number) => '$' + v.toFixed(2) },
    { title: '', key: 'action', width: 50, render: (_: unknown, r: InvoiceLine) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeLine(r.key)} /> },
  ];

  const onFinish = async () => {
    setSubmitting(true);
    try { await new Promise((r) => setTimeout(r, 1500)); message.success('Invoice created'); navigate('/accounting/invoices'); }
    catch { message.error('Failed'); } finally { setSubmitting(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title="Create Invoice" subtitle={form.getFieldValue('type') === 'sales' ? 'Accounts Receivable' : 'Accounts Payable'} onBack={() => navigate('/accounting/invoices')}>
        <Button type="primary" icon={<SaveOutlined />} loading={submitting} onClick={onFinish}>Create Invoice</Button>
      </PageHeader>
      <Card>
        <Form form={form} layout="vertical" initialValues={{ type: 'sales' }}>
          <Row gutter={16}>
            <Col span={6}><Form.Item label="Direction" name="type"><Select><Select.Option value="sales">Sales (AR)</Select.Option><Select.Option value="purchase">Purchase (AP)</Select.Option></Select></Form.Item></Col>
            <Col span={6}><Form.Item label={form.getFieldValue('type') === 'sales' ? 'Customer' : 'Supplier'} name="party" rules={[{ required: true }]}><Select showSearch><Select.Option value="CUST001">Acme Corp</Select.Option><Select.Option value="CUST002">GlobalTech Inc.</Select.Option><Select.Option value="SUP001">TechSupply Inc.</Select.Option></Select></Form.Item></Col>
            <Col span={6}><Form.Item label="Issue Date" name="issueDate" initialValue={dayjs()}><DatePicker className="w-full" /></Form.Item></Col>
            <Col span={6}><Form.Item label="Due Date" name="dueDate"><DatePicker className="w-full" /></Form.Item></Col>
          </Row>
        </Form>
      </Card>
      <Card title="Line Items" extra={<Button type="dashed" icon={<PlusOutlined />} onClick={addLine}>Add Item</Button>} className="mt-4">
        <Table dataSource={lines} columns={columns} pagination={false} rowKey="key" />
        <Divider />
        <div className="text-right"><Text strong className="text-lg">Total: ${grandTotal.toFixed(2)}</Text></div>
      </Card>
    </div>
  );
};
export default InvoiceForm;
