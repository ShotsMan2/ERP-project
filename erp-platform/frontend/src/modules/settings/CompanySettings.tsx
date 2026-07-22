import { Form, Input, Select, Button, Card, Row, Col } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

export default function CompanySettings() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t('settings.company.title')} subtitle={t('settings.company.subtitle')} />
      <Card>
        <Form layout="vertical" className="max-w-2xl">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t('settings.companyName')} required>
                <Input defaultValue="My Company Inc." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t('settings.legalName')} required>
                <Input defaultValue="My Company Inc." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t('settings.taxId')}>
                <Input defaultValue="123-45-67890" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t('settings.taxOffice')}>
                <Input defaultValue="Local Tax Office" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={t('settings.companyAddress')}>
            <Input.TextArea rows={3} defaultValue="123 Business St, City, State 12345" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={t('settings.companyPhone')}>
                <Input defaultValue="+1 (555) 123-4567" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t('settings.companyEmail')}>
                <Input defaultValue="info@mycompany.com" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t('settings.website')}>
                <Input defaultValue="https://mycompany.com" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary">{t('settings.saveChanges')}</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
