import { useState } from 'react';
import { Card, Form, Input, Select, InputNumber, Button, Row, Col, message, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
const { TextArea } = Input;

const LeadForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const isEditing = !!id;

  const onFinish = async () => {
    setSaving(true);
    try { await new Promise((r) => setTimeout(r, 1000)); message.success('Lead ' + (isEditing ? 'updated' : 'created')); navigate('/sales/leads'); }
    catch { message.error('Operation failed'); } finally { setSaving(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title={isEditing ? 'Edit Lead' : 'New Lead'} subtitle="Capture a new sales lead" onBack={() => navigate('/sales/leads')}>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>{isEditing ? 'Update' : 'Create'}</Button>
      </PageHeader>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'new', source: 'website' }}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}><Form.Item label="Contact Name" name="name" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={12} lg={6}><Form.Item label="Company Name" name="company"><Input /></Form.Item></Col>
            <Col xs={24} sm={12} lg={4}><Form.Item label="Email" name="email" rules={[{ type: 'email' }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={12} lg={4}><Form.Item label="Phone" name="phone"><Input /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={8}><Form.Item label="Source" name="source"><Select><Select.Option value="website">Website</Select.Option><Select.Option value="referral">Referral</Select.Option><Select.Option value="linkedin">LinkedIn</Select.Option><Select.Option value="trade_show">Trade Show</Select.Option><Select.Option value="email">Email Campaign</Select.Option><Select.Option value="other">Other</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label="Status" name="status"><Select><Select.Option value="new">New</Select.Option><Select.Option value="contacted">Contacted</Select.Option><Select.Option value="qualified">Qualified</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label="Lead Score" name="score"><InputNumber min={0} max={100} className="w-full" /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={8}><Form.Item label="Budget" name="budget"><InputNumber min={0} prefix="$" className="w-full" /></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label="Timeline" name="timeline"><Select><Select.Option value="immediate">Immediate</Select.Option><Select.Option value="1-3 months">1-3 Months</Select.Option><Select.Option value="3-6 months">3-6 Months</Select.Option><Select.Option value="6+ months">6+ Months</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label="Assigned To" name="assignedTo"><Select><Select.Option value="sarah">Sarah Johnson</Select.Option><Select.Option value="mike">Mike Brown</Select.Option></Select></Form.Item></Col>
          </Row>
          <Form.Item label="Notes" name="notes"><TextArea rows={3} /></Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default LeadForm;
