import { Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import { BarChart } from '@/components/charts/BarChart';

export default function GanttChart() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader title={t('projects.ganttChartPage.title')} subtitle={t('projects.ganttChartPage.subtitle')} />
      <Card>
        <BarChart
          title={t('projects.ganttChartPage.overview')}
          data={[
            { name: 'Phase 1', value: 100 },
            { name: 'Phase 2', value: 75 },
            { name: 'Phase 3', value: 45 },
            { name: 'Phase 4', value: 20 },
          ]}
          height={400}
        />
      </Card>
    </div>
  );
}
