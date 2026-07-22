import { Card, Typography } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

const { Text, Paragraph } = Typography;

export default function ApiDocs() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t('admin.apiDocsPage.title')} subtitle={t('admin.apiDocsPage.subtitle')} />
      <Card>
        <div className="text-center py-8">
          <Text type="secondary" className="text-lg">{t('admin.apiDocsPage.title')}</Text>
          <Paragraph className="mt-2 text-gray-400">
            {t('admin.apiDocsPage.description')}
          </Paragraph>
          <a href="/api/docs" target="_blank" className="text-primary-500">
            {t('admin.apiDocsPage.openDocs')}
          </a>
        </div>
      </Card>
    </div>
  );
}
