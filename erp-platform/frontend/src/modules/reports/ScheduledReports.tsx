import { Card, Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', name: 'Weekly Sales Report', frequency: 'Weekly', lastRun: '2026-07-18', nextRun: '2026-07-25', status: 'active' },
  { key: '2', name: 'Monthly Financial Summary', frequency: 'Monthly', lastRun: '2026-07-01', nextRun: '2026-08-01', status: 'active' },
  { key: '3', name: 'Inventory Status Report', frequency: 'Daily', lastRun: '2026-07-20', nextRun: '2026-07-21', status: 'active' },
];

export default function ScheduledReports() {
  const { t } = useTranslation();

  const columns = [
    { title: t('reports.scheduledReportsPage.reportName'), dataIndex: 'name', key: 'name' },
    { title: t('reports.scheduledReportsPage.frequency'), dataIndex: 'frequency', key: 'frequency' },
    { title: t('reports.scheduledReportsPage.lastRun'), dataIndex: 'lastRun', key: 'lastRun' },
    { title: t('reports.scheduledReportsPage.nextRun'), dataIndex: 'nextRun', key: 'nextRun' },
    { title: t('reports.scheduledReportsPage.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color="green">{s}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('reports.scheduledReportsPage.title')} subtitle={t('reports.scheduledReportsPage.subtitle')} onAdd={() => {}} addLabel={t('reports.scheduledReportsPage.scheduleReport')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
