import { Card, Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', name: 'Sales Report Q2 2026', format: 'PDF', generatedAt: '2026-07-20', size: '2.5 MB', status: 'ready' },
  { key: '2', name: 'Inventory Snapshot', format: 'Excel', generatedAt: '2026-07-19', size: '1.2 MB', status: 'ready' },
  { key: '3', name: 'Employee List Export', format: 'CSV', generatedAt: '2026-07-18', size: '0.5 MB', status: 'ready' },
  { key: '4', name: 'Annual Financial Report', format: 'PDF', generatedAt: '2026-07-17', size: '5.8 MB', status: 'generating' },
];

export default function ExportCenter() {
  const { t } = useTranslation();

  const columns = [
    { title: t('reports.exportCenterPage.report'), dataIndex: 'name', key: 'name' },
    { title: t('reports.exportCenterPage.format'), dataIndex: 'format', key: 'format' },
    { title: t('reports.exportCenterPage.generated'), dataIndex: 'generatedAt', key: 'generatedAt' },
    { title: t('reports.exportCenterPage.size'), dataIndex: 'size', key: 'size' },
    { title: t('reports.exportCenterPage.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'ready' ? 'green' : 'orange'}>{s}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('reports.exportCenterPage.title')} subtitle={t('reports.exportCenterPage.subtitle')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
