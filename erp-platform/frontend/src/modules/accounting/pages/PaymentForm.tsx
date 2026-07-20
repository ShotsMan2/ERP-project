import { useState } from 'react';
import { Card, Form, Select, Input, InputNumber, Button, Row, Col, Typography, DatePicker, message, Descriptions, Tag } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

const PaymentForm: React.FC = () => {
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
    try { await new Promise((r) => setTimeout(r, 1000)); message.success('Payment recorded'); navigate('/accounting/invoices'); }
    catch { message.error('Failed'); } finally { setSubmitting(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title="Record Payment" subtitle="Record payment against an invoice" onBack={() => navigate('/accounting/invoices')}>
        <Button type="primary" icon={<SaveOutlined />} loading={submitting} onClick={onFinish}>Record Payment</Button>
      </PageHeader>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ paymentDate: dayjs(), method: 'bank_transfer' }}>
              <Row gutter={16}>
                <Col span={12}><Form.Item label="Invoice" name="invoice" rules={[{ required: true }]}><Select showSearch placeholder="Select invoice" onChange={handleInvoiceSelect}><Select.Option value="INV-2024-0892">INV-2024-0892 - Acme Corp ($28,999.90)</Select.Option><Select.Option value="INV-2024-0891">INV-2024-0891 - GlobalTech Inc. ($12,500.00)</Select.Option></Select></Form.Item></Col>
                <Col span={12}><Form.Item label="Payment Date" name="paymentDate" rules={[{ required: true }]}><DatePicker className="w-full" /></Form.Item></Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}><Form.Item label="Payment Method" name="method"><Select><Select.Option value="bank_transfer">Bank Transfer</Select.Option><Select.Option value="check">Check</Select.Option><Select.Option value="credit_card">Credit Card</Select.Option><Select.Option value="cash">Cash</Select.Option></Select></Form.Item></Col>
                <Col span={8}><Form.Item label="Amount" name="amount" rules={[{ required: true }]}><InputNumber min={0.01} prefix="$" className="w-full" /></Form.Item></Col>
                <Col span={8}><Form.Item label="Reference" name="reference"><Input placeholder="Transaction reference" /></Form.Item></Col>
              </Row>
              <Form.Item label="Notes" name="notes"><Input.TextArea rows={2} /></Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Invoice Summary">
            {selectedInv ? (
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Invoice">{selectedInv.invoiceNumber}</Descriptions.Item>
                <Descriptions.Item label="Total">${selectedInv.total.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="Due Date">{selectedInv.dueDate}</Descriptions.Item>
                <Descriptions.Item label="Balance Due"><Text strong className="text-green-600">${selectedInv.balance.toLocaleString()}</Text></Descriptions.Item>
                <Descriptions.Item label="Status"><Tag color="orange">Unpaid</Tag></Descriptions.Item>
              </Descriptions>
            ) : <Text type="secondary">Select an invoice to see summary</Text>}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default PaymentForm;
