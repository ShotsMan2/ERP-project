import { useState } from 'react';
import { Card, Form, Input, Select, InputNumber, Button, Row, Col, message, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
const { TextArea } = Input;

const CustomerForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const isEditing = !!id;

  const onFinish = async () => {
    setSaving(true);
    try { await new Promise((r) => setTimeout(r, 1000)); message.success('Customer ' + (isEditing ? 'updated' : 'created')); navigate('/sales/customers'); }
    catch { message.error('Operation failed'); } finally { setSaving(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title={isEditing ? 'Edit Customer' : 'New Customer'} subtitle="Manage customer information" onBack={() => navigate('/sales/customers')}>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>{isEditing ? 'Update' : 'Create'}</Button>
      </PageHeader>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'active', currency: 'USD', paymentTerms: 'net30', segment: 'SMB' }}>
          <Divider orientation="left">Company Information</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}><Form.Item label="Company Name" name="name" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={12} lg={4}><Form.Item label="Code" name="code" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={12} lg={4}><Form.Item label="Tax ID" name="taxId"><Input /></Form.Item></Col>
            <Col xs={24} sm={12} lg={3}><Form.Item label="Segment" name="segment"><Select><Select.Option value="Enterprise">Enterprise</Select.Option><Select.Option value="Mid-Market">Mid-Market</Select.Option><Select.Option value="SMB">SMB</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={12} lg={3}><Form.Item label="Status" name="status"><Select><Select.Option value="active">Active</Select.Option><Select.Option value="on_hold">On Hold</Select.Option><Select.Option value="inactive">Inactive</Select.Option></Select></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={8}><Form.Item label="Email" name="email" rules={[{ type: 'email' }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label="Phone" name="phone"><Input /></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label="Website" name="website"><Input /></Form.Item></Col>
          </Row>
          <Form.Item label="Address" name="address"><TextArea rows={2} /></Form.Item>
          <Divider orientation="left">Commercial Terms</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={8}><Form.Item label="Payment Terms" name="paymentTerms"><Select><Select.Option value="net15">Net 15</Select.Option><Select.Option value="net30">Net 30</Select.Option><Select.Option value="net60">Net 60</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label="Currency" name="currency"><Select><Select.Option value="USD">USD</Select.Option><Select.Option value="EUR">EUR</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label="Credit Limit" name="creditLimit"><InputNumber min={0} prefix="$" className="w-full" /></Form.Item></Col>
          </Row>
          <Form.Item label="Notes" name="notes"><TextArea rows={3} /></Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default CustomerForm;
