import { useState } from 'react';
import { Card, Form, Input, Select, DatePicker, Button, Row, Col, InputNumber, message, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import PageHeader from '@/components/ui/PageHeader';
const { TextArea } = Input;

const ProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const isEditing = !!id;

  const onFinish = async () => {
    setSaving(true);
    try { await new Promise((r) => setTimeout(r, 1000)); message.success('Project ' + (isEditing ? 'updated' : 'created')); navigate('/projects'); }
    catch { message.error('Failed'); } finally { setSaving(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title={isEditing ? 'Edit Project' : 'New Project'} subtitle="Create or modify project" onBack={() => navigate('/projects')}>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>{isEditing ? 'Update' : 'Create'}</Button>
      </PageHeader>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'planning', priority: 'Medium' }}>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="Project Name" name="name" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="Code" name="code" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="Priority" name="priority"><Select><Select.Option value="Low">Low</Select.Option><Select.Option value="Medium">Medium</Select.Option><Select.Option value="High">High</Select.Option><Select.Option value="Critical">Critical</Select.Option></Select></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="Status" name="status"><Select><Select.Option value="planning">Planning</Select.Option><Select.Option value="in_progress">In Progress</Select.Option><Select.Option value="completed">Completed</Select.Option><Select.Option value="on_hold">On Hold</Select.Option></Select></Form.Item></Col>
            <Col span={8}><Form.Item label="Project Manager" name="manager"><Select><Select.Option value="Alice Johnson">Alice Johnson</Select.Option><Select.Option value="Bob Williams">Bob Williams</Select.Option></Select></Form.Item></Col>
            <Col span={8}><Form.Item label="Budget" name="budget"><InputNumber min={0} prefix="$" className="w-full" /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="Start Date" name="startDate" rules={[{ required: true }]}><DatePicker className="w-full" /></Form.Item></Col>
            <Col span={12}><Form.Item label="End Date" name="endDate"><DatePicker className="w-full" /></Form.Item></Col>
          </Row>
          <Form.Item label="Description" name="description"><TextArea rows={4} /></Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default ProjectForm;
