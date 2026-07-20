import { Card, Typography } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const { Text, Paragraph } = Typography;

export default function ApiDocs() {
  return (
    <div>
      <PageHeader title="API Documentation" subtitle="Explore and test API endpoints" />
      <Card>
        <div className="text-center py-8">
          <Text type="secondary" className="text-lg">API Documentation</Text>
          <Paragraph className="mt-2 text-gray-400">
            The full API documentation is available at the backend endpoint.
          </Paragraph>
          <a href="/api/docs" target="_blank" className="text-primary-500">
            Open API Documentation (Swagger UI)
          </a>
        </div>
      </Card>
    </div>
  );
}
