import { useState } from 'react';
import { Card, Form, Input, Select, InputNumber, Button, Row, Col, message, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';
const { TextArea } = Input;

const LeadForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const isEditing = !!id;

  const onFinish = async () => {
    setSaving(true);
    try { await new Promise((r) => setTimeout(r, 1000)); message.success(isEditing ? t('sales.leadForm.leadUpdated') : t('sales.leadForm.leadCreated')); navigate('/sales/leads'); }
    catch { message.error(t('sales.leadForm.operationFailed')); } finally { setSaving(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title={isEditing ? t('sales.leadForm.editLead') : t('sales.leadForm.newLead')} subtitle={t('sales.leadForm.subtitle')} onBack={() => navigate('/sales/leads')}>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>{isEditing ? t('sales.leadForm.update') : t('sales.leadForm.create')}</Button>
      </PageHeader>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'new', source: 'website' }}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}><Form.Item label={t('sales.leadForm.contactName')} name="name" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={12} lg={6}><Form.Item label={t('sales.leadForm.companyName')} name="company"><Input /></Form.Item></Col>
            <Col xs={24} sm={12} lg={4}><Form.Item label={t('sales.leadForm.email')} name="email" rules={[{ type: 'email' }]}><Input /></Form.Item></Col>
            <Col xs={24} sm={12} lg={4}><Form.Item label={t('sales.leadForm.phone')} name="phone"><Input /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={8}><Form.Item label={t('sales.leadForm.source')} name="source"><Select><Select.Option value="website">{t('sales.leadForm.website')}</Select.Option><Select.Option value="referral">{t('sales.leadForm.referral')}</Select.Option><Select.Option value="linkedin">{t('sales.leadForm.linkedin')}</Select.Option><Select.Option value="trade_show">{t('sales.leadForm.tradeShow')}</Select.Option><Select.Option value="email">{t('sales.leadForm.emailCampaign')}</Select.Option><Select.Option value="other">{t('sales.leadForm.other')}</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label={t('sales.leadForm.status')} name="status"><Select><Select.Option value="new">{t('sales.leadForm.new')}</Select.Option><Select.Option value="contacted">{t('sales.leadForm.contacted')}</Select.Option><Select.Option value="qualified">{t('sales.leadForm.qualified')}</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label={t('sales.leadForm.leadScore')} name="score"><InputNumber min={0} max={100} className="w-full" /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={8}><Form.Item label={t('sales.leadForm.budget')} name="budget"><InputNumber min={0} prefix="$" className="w-full" /></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label={t('sales.leadForm.timeline')} name="timeline"><Select><Select.Option value="immediate">{t('sales.leadForm.immediate')}</Select.Option><Select.Option value="1-3 months">{t('sales.leadForm.months1to3')}</Select.Option><Select.Option value="3-6 months">{t('sales.leadForm.months3to6')}</Select.Option><Select.Option value="6+ months">{t('sales.leadForm.months6plus')}</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={8}><Form.Item label={t('sales.leadForm.assignedTo')} name="assignedTo"><Select><Select.Option value="sarah">Sarah Johnson</Select.Option><Select.Option value="mike">Mike Brown</Select.Option></Select></Form.Item></Col>
          </Row>
          <Form.Item label={t('sales.leadForm.notes')} name="notes"><TextArea rows={3} /></Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default LeadForm;
