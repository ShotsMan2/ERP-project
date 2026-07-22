import { useState } from 'react';
import { Card, Form, Input, Select, DatePicker, Button, Row, Col, InputNumber, message, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import PageHeader from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';
const { TextArea } = Input;

const ProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const isEditing = !!id;

  const onFinish = async () => {
    setSaving(true);
    try { await new Promise((r) => setTimeout(r, 1000)); message.success(isEditing ? t('projects.projectFormPage.projectUpdated') : t('projects.projectFormPage.projectCreated')); navigate('/projects'); }
    catch { message.error(t('projects.projectFormPage.failed')); } finally { setSaving(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title={isEditing ? t('projects.projectFormPage.editTitle') : t('projects.projectFormPage.newTitle')} subtitle={t('projects.projectFormPage.subtitle')} onBack={() => navigate('/projects')}>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>{isEditing ? t('projects.projectFormPage.update') : t('projects.projectFormPage.create')}</Button>
      </PageHeader>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'planning', priority: 'Medium' }}>
          <Row gutter={16}>
            <Col span={12}><Form.Item label={t('projects.projectFormPage.projectName')} name="name" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label={t('projects.projectFormPage.code')} name="code" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label={t('projects.projectFormPage.priority')} name="priority"><Select><Select.Option value="Low">{t('projects.projectFormPage.low')}</Select.Option><Select.Option value="Medium">{t('projects.projectFormPage.medium')}</Select.Option><Select.Option value="High">{t('projects.projectFormPage.high')}</Select.Option><Select.Option value="Critical">{t('projects.projectFormPage.critical')}</Select.Option></Select></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}><Form.Item label={t('projects.projectFormPage.status')} name="status"><Select><Select.Option value="planning">{t('projects.projectFormPage.planning')}</Select.Option><Select.Option value="in_progress">{t('projects.projectFormPage.inProgress')}</Select.Option><Select.Option value="completed">{t('projects.projectFormPage.completed')}</Select.Option><Select.Option value="on_hold">{t('projects.projectFormPage.onHold')}</Select.Option></Select></Form.Item></Col>
            <Col span={8}><Form.Item label={t('projects.projectFormPage.projectManager')} name="manager"><Select><Select.Option value="Alice Johnson">Alice Johnson</Select.Option><Select.Option value="Bob Williams">Bob Williams</Select.Option></Select></Form.Item></Col>
            <Col span={8}><Form.Item label={t('projects.projectFormPage.budget')} name="budget"><InputNumber min={0} prefix="$" className="w-full" /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item label={t('projects.projectFormPage.startDate')} name="startDate" rules={[{ required: true }]}><DatePicker className="w-full" /></Form.Item></Col>
            <Col span={12}><Form.Item label={t('projects.projectFormPage.endDate')} name="endDate"><DatePicker className="w-full" /></Form.Item></Col>
          </Row>
          <Form.Item label={t('projects.projectFormPage.description')} name="description"><TextArea rows={4} /></Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default ProjectForm;
