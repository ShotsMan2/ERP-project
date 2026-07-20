import { useState } from 'react';
import { Card, Form, Input, Select, InputNumber, Button, Row, Col, Switch, message, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
const { TextArea } = Input;

const AccountForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const isEditing = !!id;

  const onFinish = async () => {
    setSaving(true);
    try { await new Promise((r) => setTimeout(r, 1000)); message.success('Account ' + (isEditing ? 'updated' : 'created')); navigate('/accounting/chart-of-accounts'); }
    catch { message.error('Operation failed'); } finally { setSaving(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title={isEditing ? 'Edit Account' : 'New Account'} subtitle="Manage general ledger account" onBack={() => navigate('/accounting/chart-of-accounts')}>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>{isEditing ? 'Update' : 'Create'}</Button>
      </PageHeader>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ type: 'asset', isActive: true }}>
          <Row gutter={16}>
            <Col xs={24} sm={8}><Form.Item label="Account Code" name="code" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={12}><Form.Item label="Account Name" name="name" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={4}><Form.Item label="Active" name="isActive" valuePropName="checked"><Switch /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={8}><Form.Item label="Account Type" name="type" rules={[{ required: true }]}><Select><Select.Option value="asset">Asset</Select.Option><Select.Option value="liability">Liability</Select.Option><Select.Option value="equity">Equity</Select.Option><Select.Option value="revenue">Revenue</Select.Option><Select.Option value="expense">Expense</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label="Parent Account" name="parent"><Select allowClear placeholder="Select parent account"><Select.Option value="1000">1000 - Assets</Select.Option><Select.Option value="2000">2000 - Liabilities</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label="Tax Code" name="taxCode"><Select allowClear><Select.Option value="VAT20">VAT 20%</Select.Option><Select.Option value="VAT8">VAT 8%</Select.Option><Select.Option value="EXEMPT">Tax Exempt</Select.Option></Select></Form.Item></Col>
          </Row>
          <Form.Item label="Description" name="description"><TextArea rows={3} /></Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AccountForm;
