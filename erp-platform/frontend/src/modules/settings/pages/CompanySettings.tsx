import { Card, Form, Input, Button, Row, Col, Select, Upload, message, Divider, Typography } from 'antd';
import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
const { TextArea } = Input;
const { Text } = Typography;

const CompanySettings: React.FC = () => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const onFinish = async () => {
    setSaving(true);
    try { await new Promise((r) => setTimeout(r, 1000)); message.success('Company settings saved'); }
    catch { message.error('Failed'); } finally { setSaving(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title="Company Settings" subtitle="Manage company profile and configuration">
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>Save Settings</Button>
      </PageHeader>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ language: 'en', timezone: 'UTC', fiscalYearStart: 'Jan' }}>
          <Divider orientation="left">Company Information</Divider>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="Company Name" name="name" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="Tax ID" name="taxId" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={6}><Form.Item label="Registration No" name="regNo"><Input /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="Email" name="email"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="Phone" name="phone"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="Website" name="website"><Input /></Form.Item></Col>
          </Row>
          <Form.Item label="Address" name="address"><TextArea rows={2} /></Form.Item>
          <Divider orientation="left">Localization</Divider>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="Default Language" name="language"><Select><Select.Option value="en">English</Select.Option><Select.Option value="tr">Türkçe</Select.Option><Select.Option value="de">Deutsch</Select.Option><Select.Option value="fr">Français</Select.Option></Select></Form.Item></Col>
            <Col span={8}><Form.Item label="Timezone" name="timezone"><Select><Select.Option value="UTC">UTC</Select.Option><Select.Option value="US/Eastern">US/Eastern</Select.Option><Select.Option value="Europe/Istanbul">Europe/Istanbul</Select.Option></Select></Form.Item></Col>
            <Col span={8}><Form.Item label="Fiscal Year Start" name="fiscalYearStart"><Select><Select.Option value="Jan">January</Select.Option><Select.Option value="Apr">April</Select.Option><Select.Option value="Jul">July</Select.Option><Select.Option value="Oct">October</Select.Option></Select></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}><Form.Item label="Currency" name="currency"><Select><Select.Option value="USD">USD - US Dollar</Select.Option><Select.Option value="EUR">EUR - Euro</Select.Option><Select.Option value="TRY">TRY - Turkish Lira</Select.Option></Select></Form.Item></Col>
            <Col span={8}><Form.Item label="Date Format" name="dateFormat"><Select><Select.Option value="MM/DD/YYYY">MM/DD/YYYY</Select.Option><Select.Option value="DD/MM/YYYY">DD/MM/YYYY</Select.Option><Select.Option value="YYYY-MM-DD">YYYY-MM-DD</Select.Option></Select></Form.Item></Col>
            <Col span={8}><Form.Item label="Logo"><Upload><Button icon={<UploadOutlined />}>Upload Logo</Button></Upload></Form.Item></Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};
export default CompanySettings;
