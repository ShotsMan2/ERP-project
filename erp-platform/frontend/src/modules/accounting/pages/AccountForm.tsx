import { useState } from 'react';
import { Card, Form, Input, Select, InputNumber, Button, Row, Col, Switch, message, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';
const { TextArea } = Input;

const AccountForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const isEditing = !!id;

  const onFinish = async () => {
    setSaving(true);
    try { await new Promise((r) => setTimeout(r, 1000)); message.success(t(isEditing ? 'accounting.accountForm.accountUpdated' : 'accounting.accountForm.accountCreated')); navigate('/accounting/chart-of-accounts'); }
    catch { message.error(t('accounting.accountForm.operationFailed')); } finally { setSaving(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title={t(isEditing ? 'accounting.accountForm.titleEdit' : 'accounting.accountForm.titleCreate')} subtitle={t('accounting.accountForm.subtitle')} onBack={() => navigate('/accounting/chart-of-accounts')}>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>{t(isEditing ? 'accounting.accountForm.update' : 'accounting.accountForm.create')}</Button>
      </PageHeader>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ type: 'asset', isActive: true }}>
          <Row gutter={16}>
            <Col xs={24} sm={8}><Form.Item label={t('accounting.accountForm.accountCode')} name="code" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={12}><Form.Item label={t('accounting.accountForm.accountName')} name="name" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={4}><Form.Item label={t('accounting.accountForm.active')} name="isActive" valuePropName="checked"><Switch /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={8}><Form.Item label={t('accounting.accountForm.accountType')} name="type" rules={[{ required: true }]}><Select><Select.Option value="asset">{t('accounting.accountForm.asset')}</Select.Option><Select.Option value="liability">{t('accounting.accountForm.liability')}</Select.Option><Select.Option value="equity">{t('accounting.accountForm.equity')}</Select.Option><Select.Option value="revenue">{t('accounting.accountForm.revenue')}</Select.Option><Select.Option value="expense">{t('accounting.accountForm.expense')}</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label={t('accounting.accountForm.parentAccount')} name="parent"><Select allowClear placeholder={t('accounting.accountForm.selectParentAccount')}><Select.Option value="1000">1000 - Assets</Select.Option><Select.Option value="2000">2000 - Liabilities</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label={t('accounting.accountForm.taxCode')} name="taxCode"><Select allowClear><Select.Option value="VAT20">VAT 20%</Select.Option><Select.Option value="VAT8">VAT 8%</Select.Option><Select.Option value="EXEMPT">Tax Exempt</Select.Option></Select></Form.Item></Col>
          </Row>
          <Form.Item label={t('accounting.accountForm.description')} name="description"><TextArea rows={3} /></Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AccountForm;
