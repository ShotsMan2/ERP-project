import { useState } from 'react';
import { Card, Form, Input, Select, InputNumber, Button, Row, Col, Rate, message, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';

const { TextArea } = Input;

const SupplierForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const isEditing = !!id;

  const onFinish = async () => {
    setSaving(true);
    try { await new Promise((r) => setTimeout(r, 1000)); message.success(t(isEditing ? 'procurement.supplierForm.supplierUpdated' : 'procurement.supplierForm.supplierCreated')); navigate('/procurement/suppliers'); }
    catch { message.error(t('procurement.supplierForm.operationFailed')); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title={t(isEditing ? 'procurement.supplierForm.editSupplier' : 'procurement.supplierForm.newSupplier')} subtitle={t('procurement.supplierForm.manageSupplierInfo')} onBack={() => navigate('/procurement/suppliers')}>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>{t(isEditing ? 'procurement.supplierForm.update' : 'procurement.supplierForm.create')}</Button>
      </PageHeader>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'active', currency: 'USD', paymentTerms: 'net30' }}>
          <Divider orientation="left">{t('procurement.supplierForm.companyInformation')}</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}><Form.Item label={t('procurement.supplierForm.companyName')} name="name" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={12} lg={4}><Form.Item label={t('procurement.supplierForm.code')} name="code" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={12} lg={4}><Form.Item label={t('procurement.supplierForm.taxId')} name="taxId"><Input /></Form.Item></Col>
            <Col xs={24} sm={12} lg={4}><Form.Item label={t('procurement.supplierForm.category')} name="category"><Select><Select.Option value="Electronics">Electronics</Select.Option><Select.Option value="Office Supplies">Office Supplies</Select.Option><Select.Option value="Industrial">Industrial</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={12} lg={3}><Form.Item label={t('procurement.supplierForm.status')} name="status"><Select><Select.Option value="active">{t('procurement.supplierForm.active')}</Select.Option><Select.Option value="inactive">{t('procurement.supplierForm.inactive')}</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={12} lg={3}><Form.Item label={t('procurement.supplierForm.rating')} name="rating"><Rate /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={8}><Form.Item label={t('procurement.supplierForm.email')} name="email" rules={[{ type: 'email' }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label={t('procurement.supplierForm.phone')} name="phone"><Input /></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label={t('procurement.supplierForm.website')} name="website"><Input /></Form.Item></Col>
          </Row>
          <Form.Item label={t('procurement.supplierForm.address')} name="address"><TextArea rows={2} /></Form.Item>
          <Divider orientation="left">{t('procurement.supplierForm.commercialTerms')}</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={8}><Form.Item label={t('procurement.supplierForm.paymentTerms')} name="paymentTerms"><Select><Select.Option value="net15">Net 15</Select.Option><Select.Option value="net30">Net 30</Select.Option><Select.Option value="net60">Net 60</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label={t('procurement.supplierForm.currency')} name="currency"><Select><Select.Option value="USD">USD</Select.Option><Select.Option value="EUR">EUR</Select.Option><Select.Option value="TRY">TRY</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label={t('procurement.supplierForm.creditLimit')} name="creditLimit"><InputNumber min={0} prefix="$" className="w-full" /></Form.Item></Col>
          </Row>
          <Form.Item label={t('procurement.supplierForm.notes')} name="notes"><TextArea rows={3} /></Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SupplierForm;
