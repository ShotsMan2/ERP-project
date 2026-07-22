import { useState } from 'react';
import { Card, Form, Input, Select, InputNumber, Button, Row, Col, message, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';
const { TextArea } = Input;

const CustomerForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const isEditing = !!id;

  const onFinish = async () => {
    setSaving(true);
    try { await new Promise((r) => setTimeout(r, 1000)); message.success(isEditing ? t('sales.customerForm.customerUpdated') : t('sales.customerForm.customerCreated')); navigate('/sales/customers'); }
    catch { message.error(t('sales.customerForm.operationFailed')); } finally { setSaving(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title={isEditing ? t('sales.customerForm.editCustomer') : t('sales.customerForm.newCustomer')} subtitle={t('sales.customerForm.manageCustomerInfo')} onBack={() => navigate('/sales/customers')}>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>{isEditing ? t('sales.customerForm.update') : t('sales.customerForm.create')}</Button>
      </PageHeader>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'active', currency: 'USD', paymentTerms: 'net30', segment: 'SMB' }}>
          <Divider orientation="left">{t('sales.customerForm.companyInformation')}</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}><Form.Item label={t('sales.customerForm.companyName')} name="name" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={12} lg={4}><Form.Item label={t('sales.customerForm.code')} name="code" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={12} lg={4}><Form.Item label={t('sales.customerForm.taxId')} name="taxId"><Input /></Form.Item></Col>
            <Col xs={24} sm={12} lg={3}><Form.Item label={t('sales.customerForm.segment')} name="segment"><Select><Select.Option value="Enterprise">{t('sales.customerForm.enterprise')}</Select.Option><Select.Option value="Mid-Market">{t('sales.customerForm.midMarket')}</Select.Option><Select.Option value="SMB">{t('sales.customerForm.smb')}</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={12} lg={3}><Form.Item label={t('sales.customerForm.status')} name="status"><Select><Select.Option value="active">{t('sales.customerForm.active')}</Select.Option><Select.Option value="on_hold">{t('sales.customerForm.onHold')}</Select.Option><Select.Option value="inactive">{t('sales.customerForm.inactive')}</Select.Option></Select></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={8}><Form.Item label={t('sales.customerForm.email')} name="email" rules={[{ type: 'email' }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label={t('sales.customerForm.phone')} name="phone"><Input /></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label={t('sales.customerForm.website')} name="website"><Input /></Form.Item></Col>
          </Row>
          <Form.Item label={t('sales.customerForm.address')} name="address"><TextArea rows={2} /></Form.Item>
          <Divider orientation="left">{t('sales.customerForm.commercialTerms')}</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={8}><Form.Item label={t('sales.customerForm.paymentTerms')} name="paymentTerms"><Select><Select.Option value="net15">{t('sales.customerForm.net15')}</Select.Option><Select.Option value="net30">{t('sales.customerForm.net30')}</Select.Option><Select.Option value="net60">{t('sales.customerForm.net60')}</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label={t('sales.customerForm.currency')} name="currency"><Select><Select.Option value="USD">USD</Select.Option><Select.Option value="EUR">EUR</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label={t('sales.customerForm.creditLimit')} name="creditLimit"><InputNumber min={0} prefix="$" className="w-full" /></Form.Item></Col>
          </Row>
          <Form.Item label={t('sales.customerForm.notes')} name="notes"><TextArea rows={3} /></Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default CustomerForm;
