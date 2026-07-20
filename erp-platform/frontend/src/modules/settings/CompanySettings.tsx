import { Form, Input, Select, Button, Card, Row, Col } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

export default function CompanySettings() {
  return (
    <div>
      <PageHeader title="Company Settings" subtitle="Manage company information" />
      <Card>
        <Form layout="vertical" className="max-w-2xl">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Company Name" required>
                <Input defaultValue="My Company Inc." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Legal Name" required>
                <Input defaultValue="My Company Inc." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tax ID">
                <Input defaultValue="123-45-67890" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tax Office">
                <Input defaultValue="Local Tax Office" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Address">
            <Input.TextArea rows={3} defaultValue="123 Business St, City, State 12345" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Phone">
                <Input defaultValue="+1 (555) 123-4567" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Email">
                <Input defaultValue="info@mycompany.com" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Website">
                <Input defaultValue="https://mycompany.com" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary">Save Changes</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
