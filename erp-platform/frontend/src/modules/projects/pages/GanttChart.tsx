import { Card, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import PageHeader from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';
const { Text } = Typography;

const tasks = [
  { name: 'Database schema design', start: '2024-09-01', end: '2024-10-15', assignee: 'John Smith', progress: 100 },
  { name: 'API development', start: '2024-10-01', end: '2024-12-30', assignee: 'John Smith', progress: 65 },
  { name: 'Frontend dashboard', start: '2024-11-15', end: '2025-01-15', assignee: 'Emily Davis', progress: 40 },
  { name: 'Testing & QA', start: '2025-01-01', end: '2025-03-01', assignee: 'James Wilson', progress: 10 },
  { name: 'Deployment', start: '2025-03-01', end: '2025-06-01', assignee: 'James Wilson', progress: 0 },
];

const categories = tasks.map((t) => t.name);

const option = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'value', min: new Date('2024-09-01').getTime(), max: new Date('2025-06-01').getTime(), axisLabel: { formatter: (v: number) => new Date(v).toLocaleDateString('en-US', { month: 'short' }) } },
  yAxis: { type: 'category', data: categories, axisLabel: { width: 150, overflow: 'truncate' } },
  series: tasks.map((t, i) => ({
    type: 'bar',
    data: [{
      value: [new Date(t.start).getTime(), new Date(t.end).getTime()],
      itemStyle: { color: ['#1677ff', '#52c41a', '#faad14', '#722ed1', '#13c2c2'][i] },
    }],
    barWidth: 20,
  })),
};

const GanttChart: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <PageHeader title={t('projects.ganttChartPage.title')} subtitle={t('projects.ganttChartPage.subtitle')} />
      <Card>
        <ReactECharts option={option} style={{ height: 400 }} />
        <div className="mt-4">
          <Text type="secondary">{t('projects.ganttChartPage.tip')}</Text>
        </div>
      </Card>
    </div>
  );
};
export default GanttChart;
