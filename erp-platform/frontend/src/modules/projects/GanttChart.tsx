import { Card } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { BarChart } from '@/components/charts/BarChart';

export default function GanttChart() {
  return (
    <div>
      <PageHeader title="Gantt Chart" subtitle="Project timeline view" />
      <Card>
        <BarChart
          title="Project Timeline Overview"
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
