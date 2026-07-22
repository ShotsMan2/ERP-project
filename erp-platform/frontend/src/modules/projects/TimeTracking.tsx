import { Card, Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', employee: 'John Doe', task: 'Design database schema', date: '2026-07-20', hours: 4.5, billable: true, description: 'Designed initial schema' },
  { key: '2', employee: 'Jane Smith', task: 'Setup CI/CD', date: '2026-07-20', hours: 3.0, billable: false, description: 'Configured GitHub Actions' },
  { key: '3', employee: 'Bob Wilson', task: 'API development', date: '2026-07-19', hours: 7.0, billable: true, description: 'Created user endpoints' },
];

export default function TimeTracking() {
  const { t } = useTranslation();

  const columns = [
    { title: t('projects.timeTrackingPage.employee'), dataIndex: 'employee', key: 'employee' },
    { title: t('projects.timeTrackingPage.task'), dataIndex: 'task', key: 'task' },
    { title: t('projects.timeTrackingPage.date'), dataIndex: 'date', key: 'date' },
    { title: t('projects.timeTrackingPage.hours'), dataIndex: 'hours', key: 'hours' },
    { title: t('projects.timeTrackingPage.billable'), dataIndex: 'billable', key: 'billable', render: (b: boolean) => <Tag color={b ? 'green' : 'default'}>{b ? 'Yes' : 'No'}</Tag> },
    { title: t('projects.timeTrackingPage.description'), dataIndex: 'description', key: 'description' },
  ];

  return (
    <div>
      <PageHeader title={t('projects.timeTrackingPage.title')} subtitle={t('projects.timeTrackingPage.subtitle')} onAdd={() => {}} addLabel={t('projects.timeTrackingPage.logTime')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
