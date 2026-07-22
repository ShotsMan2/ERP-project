import { Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';

export default function ReportBuilder() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader title={t('reports.reportBuilderPage.title')} subtitle={t('reports.reportBuilderPage.subtitle')} onAdd={() => {}} addLabel={t('reports.reportBuilderPage.newReport')} />
      <Card><p className="text-gray-400 text-center py-8">Report builder interface will be implemented here.</p></Card>
    </div>
  );
}
