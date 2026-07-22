import { useState } from 'react';
import { Card, Form, Select, InputNumber, Input, Button, Row, Col, Table, Typography, Divider, message, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;
const { TextArea } = Input;
interface SOLine { key: string; product: string; sku: string; qty: number; unitPrice: number; discount: number; taxRate: string; total: number; }

const SalesOrderForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [lines, setLines] = useState<SOLine[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addLine = () => setLines([...lines, { key: Date.now().toString(), product: '', sku: '', qty: 1, unitPrice: 0, discount: 0, taxRate: '20%', total: 0 }]);
  const removeLine = (key: string) => setLines(lines.filter((l) => l.key !== key));
  const updateLine = (key: string, field: string, value: any) => setLines(lines.map((l) => {
    if (l.key !== key) return l;
    const updated = { ...l, [field]: value };
    const base = (field === 'qty' ? value : l.qty) * (field === 'unitPrice' ? value : l.unitPrice);
    const disc = field === 'discount' ? value : l.discount;
    updated.total = base * (1 - disc / 100);
    return updated;
  }));
  const grandTotal = lines.reduce((s, l) => s + l.total, 0);

  const products = [{ value: 'LAP-001', label: 'Business Laptop Pro 15"', sku: 'LAP-001', price: 2499.99 }, { value: 'MON-002', label: '27" 4K Monitor', sku: 'MON-002', price: 599.99 }];

  const lineColumns = [
    { title: t('sales.salesOrderForm.product'), dataIndex: 'product', width: 200, render: (v: string, r: SOLine) => (
      <Select value={v || undefined} onChange={(val) => { const p = products.find((x) => x.value === val); updateLine(r.key, 'product', p?.label || val); updateLine(r.key, 'sku', p?.sku || ''); updateLine(r.key, 'unitPrice', p?.price || 0); }} showSearch placeholder="Select" style={{ width: '100%' }}
        options={products.map((p) => ({ value: p.value, label: p.label }))} />
    )},
    { title: t('sales.salesOrderForm.sku'), dataIndex: 'sku', width: 100 },
    { title: t('sales.salesOrderForm.qty'), dataIndex: 'qty', width: 70, render: (v: number, r: SOLine) => <InputNumber min={1} value={v} onChange={(val) => updateLine(r.key, 'qty', val)} className="w-full" /> },
    { title: t('sales.salesOrderForm.price'), dataIndex: 'unitPrice', width: 100, render: (v: number, r: SOLine) => <InputNumber min={0} prefix="$" value={v} onChange={(val) => updateLine(r.key, 'unitPrice', val)} className="w-full" /> },
    { title: t('sales.salesOrderForm.discPercent'), dataIndex: 'discount', width: 70, render: (v: number, r: SOLine) => <InputNumber min={0} max={100} value={v} onChange={(val) => updateLine(r.key, 'discount', val)} className="w-full" /> },
    { title: t('sales.salesOrderForm.total'), dataIndex: 'total', render: (v: number) => '$' + v.toFixed(2) },
    { title: '', key: 'action', width: 50, render: (_: unknown, r: SOLine) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeLine(r.key)} /> },
  ];

  const onFinish = async () => {
    if (lines.length === 0) { message.error(t('sales.salesOrderForm.addAtLeastOneItem')); return; }
    setSubmitting(true);
    try { await new Promise((r) => setTimeout(r, 1500)); message.success(t('sales.salesOrderForm.salesOrderCreated')); navigate('/sales/orders'); }
    catch { message.error(t('sales.salesOrderForm.failedToCreateOrder')); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title={t('sales.salesOrderForm.title')} subtitle={t('sales.salesOrderForm.subtitle')} onBack={() => navigate('/sales/orders')}>
        <Button type="primary" icon={<SaveOutlined />} loading={submitting} onClick={onFinish}>{t('sales.salesOrderForm.createOrder')}</Button>
      </PageHeader>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card><Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}><Form.Item label={t('sales.salesOrderForm.customer')} name="customer" rules={[{ required: true }]}><Select showSearch placeholder={t('sales.salesOrderForm.selectCustomer')}><Select.Option value="CUST001">Acme Corp</Select.Option><Select.Option value="CUST002">GlobalTech Inc.</Select.Option></Select></Form.Item></Col>
              <Col span={6}><Form.Item label={t('sales.salesOrderForm.deliveryDate')} name="deliveryDate"><Input placeholder="YYYY-MM-DD" /></Form.Item></Col>
              <Col span={6}><Form.Item label={t('sales.salesOrderForm.currency')} name="currency" initialValue="USD"><Select><Select.Option value="USD">USD</Select.Option><Select.Option value="EUR">EUR</Select.Option></Select></Form.Item></Col>
            </Row>
            <Form.Item label={t('sales.salesOrderForm.shippingAddress')} name="shippingAddress"><TextArea rows={2} /></Form.Item>
          </Form></Card>
        </Col>
        <Col span={24}>
          <Card title={t('sales.salesOrderForm.lineItems')} extra={<Button type="dashed" icon={<PlusOutlined />} onClick={addLine}>{t('sales.salesOrderForm.addItem')}</Button>}>
            <Table dataSource={lines} columns={lineColumns} pagination={false} rowKey="key" />
            <Divider />
            <div className="text-right"><Space><Text>{t('sales.salesOrderForm.subtotal', { amount: grandTotal.toFixed(2) })}</Text><Text strong className="text-lg">{t('sales.salesOrderForm.grandTotal', { amount: grandTotal.toFixed(2) })}</Text></Space></div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default SalesOrderForm;
