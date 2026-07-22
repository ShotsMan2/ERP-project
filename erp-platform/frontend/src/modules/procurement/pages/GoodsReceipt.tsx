import { useState } from 'react';
import { Card, Form, Select, InputNumber, Input, Button, Row, Col, Table, Typography, Space, message, Tag } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';

const { TextArea } = Input;
interface GRNLine { key: string; poLine: string; product: string; expectedQty: number; receivedQty: number; bin: string; }

const GoodsReceipt: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
    try { await new Promise((r) => setTimeout(r, 1500)); message.success(t('procurement.goodsReceipt.successMessage')); navigate('/procurement/purchase-orders'); }
    catch { message.error(t('procurement.goodsReceipt.errorMessage')); }
    finally { setSubmitting(false); }
  };

  const columns = [
    { title: t('procurement.goodsReceipt.poLine'), dataIndex: 'poLine', key: 'poLine' },
    { title: t('procurement.goodsReceipt.product'), dataIndex: 'product', key: 'product' },
    { title: t('procurement.goodsReceipt.expectedQty'), dataIndex: 'expectedQty', key: 'expectedQty' },
    { title: t('procurement.goodsReceipt.receivedQty'), dataIndex: 'receivedQty', key: 'receivedQty', render: (v: number, r: GRNLine) => <InputNumber min={0} max={r.expectedQty} value={v} onChange={(val) => updateLine(r.key, 'receivedQty', val)} /> },
    { title: t('procurement.goodsReceipt.binLocation'), dataIndex: 'bin', key: 'bin', render: (v: string, r: GRNLine) => <Select value={v || undefined} onChange={(val) => updateLine(r.key, 'bin', val)} placeholder={t('procurement.goodsReceipt.selectBin')} style={{ width: 140 }} options={[{ value: 'A-01-01', label: 'A-01-01' }, { value: 'A-01-02', label: 'A-01-02' }, { value: 'B-01-01', label: 'B-01-01' }]} /> },
  ];

  return (
    <div className="p-6">
      <PageHeader title={t('procurement.goodsReceipt.title')} subtitle={t('procurement.goodsReceipt.subtitle')} onBack={() => navigate('/procurement/purchase-orders')}>
        <Button type="primary" icon={<SaveOutlined />} loading={submitting} onClick={onFinish}>{t('procurement.goodsReceipt.saveReceipt')}</Button>
      </PageHeader>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={t('procurement.goodsReceipt.purchaseOrder')} name="poNumber" rules={[{ required: true }]}>
                    <Select showSearch placeholder={t('procurement.goodsReceipt.selectPO')} onChange={handlePOSelect}>
                      <Select.Option value="PO-2024-0156">PO-2024-0156 - TechSupply Inc.</Select.Option>
                      <Select.Option value="PO-2024-0155">PO-2024-0155 - OfficeWorld Ltd.</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label={t('procurement.goodsReceipt.receiptDate')} name="receiptDate" initialValue="Today">{t('procurement.goodsReceipt.today')}</Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label={t('procurement.goodsReceipt.reference')} name="reference"><Input placeholder={t('procurement.goodsReceipt.referencePlaceholder')} /></Form.Item>
                </Col>
              </Row>
              {selectedPO && (
                <div className="mb-4"><Tag color="blue">PO-2024-0156</Tag> <Tag color="green">TechSupply Inc.</Tag> <span className="text-sm text-gray-500 ml-2">{t('procurement.goodsReceipt.expected')}: 2024-12-22</span></div>
              )}
            </Form>
          </Card>
        </Col>
        {selectedPO && (
          <Col span={24}>
            <Card title={t('procurement.goodsReceipt.receiptLines')}>
              <Table dataSource={lines} columns={columns} pagination={false} rowKey="key" />
              <Form.Item label={t('procurement.goodsReceipt.notes')} className="mt-4"><TextArea rows={2} placeholder={t('procurement.goodsReceipt.notesPlaceholder')} /></Form.Item>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default GoodsReceipt;
