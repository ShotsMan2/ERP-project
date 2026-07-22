import { useState } from 'react';
import { Card, Form, Select, Input, InputNumber, Button, Row, Col, Typography, DatePicker, message, Descriptions, Tag } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

const PaymentForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [selectedInv, setSelectedInv] = useState<any>(null);

  const handleInvoiceSelect = (value: string) => {
    setSelectedInv({ invoiceNumber: value, total: 28999.90, dueDate: '2025-01-15', balance: 28999.90 });
    form.setFieldValue('amount', 28999.90);
  };

  const onFinish = async () => {
    setSubmitting(true);
    try { await new Promise((r) => setTimeout(r, 1000)); message.success(t('accounting.paymentForm.paymentRecorded')); navigate('/accounting/invoices'); }
    catch { message.error(t('accounting.paymentForm.failed')); } finally { setSubmitting(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title={t('accounting.paymentForm.recordPayment')} subtitle={t('accounting.paymentForm.subtitle')} onBack={() => navigate('/accounting/invoices')}>
        <Button type="primary" icon={<SaveOutlined />} loading={submitting} onClick={onFinish}>{t('accounting.paymentForm.recordPayment')}</Button>
      </PageHeader>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ paymentDate: dayjs(), method: 'bank_transfer' }}>
              <Row gutter={16}>
                <Col span={12}><Form.Item label={t('accounting.paymentForm.invoice')} name="invoice" rules={[{ required: true }]}><Select showSearch placeholder={t('accounting.paymentForm.selectInvoice')} onChange={handleInvoiceSelect}><Select.Option value="INV-2024-0892">INV-2024-0892 - Acme Corp ($28,999.90)</Select.Option><Select.Option value="INV-2024-0891">INV-2024-0891 - GlobalTech Inc. ($12,500.00)</Select.Option></Select></Form.Item></Col>
                <Col span={12}><Form.Item label={t('accounting.paymentForm.paymentDate')} name="paymentDate" rules={[{ required: true }]}><DatePicker className="w-full" /></Form.Item></Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}><Form.Item label={t('accounting.paymentForm.paymentMethod')} name="method"><Select><Select.Option value="bank_transfer">{t('accounting.paymentForm.bankTransfer')}</Select.Option><Select.Option value="check">{t('accounting.paymentForm.check')}</Select.Option><Select.Option value="credit_card">{t('accounting.paymentForm.creditCard')}</Select.Option><Select.Option value="cash">{t('accounting.paymentForm.cash')}</Select.Option></Select></Form.Item></Col>
                <Col span={8}><Form.Item label={t('accounting.paymentForm.amount')} name="amount" rules={[{ required: true }]}><InputNumber min={0.01} prefix="$" className="w-full" /></Form.Item></Col>
                <Col span={8}><Form.Item label={t('accounting.paymentForm.reference')} name="reference"><Input placeholder={t('accounting.paymentForm.transactionReference')} /></Form.Item></Col>
              </Row>
              <Form.Item label={t('accounting.paymentForm.notes')} name="notes"><Input.TextArea rows={2} /></Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t('accounting.paymentForm.invoiceSummary')}>
            {selectedInv ? (
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label={t('accounting.paymentForm.invoice')}>{selectedInv.invoiceNumber}</Descriptions.Item>
                <Descriptions.Item label={t('accounting.paymentForm.total')}>${selectedInv.total.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label={t('accounting.paymentForm.dueDate')}>{selectedInv.dueDate}</Descriptions.Item>
                <Descriptions.Item label={t('accounting.paymentForm.balanceDue')}><Text strong className="text-green-600">${selectedInv.balance.toLocaleString()}</Text></Descriptions.Item>
                <Descriptions.Item label={t('accounting.paymentForm.status')}><Tag color="orange">{t('accounting.paymentForm.unpaid')}</Tag></Descriptions.Item>
              </Descriptions>
            ) : <Text type="secondary">{t('accounting.paymentForm.selectAnInvoiceToSeeSummary')}</Text>}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default PaymentForm;
