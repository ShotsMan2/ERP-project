import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

const data = [
  { key: '1', employee: 'John Doe', type: 'Annual Leave', startDate: '2026-08-01', endDate: '2026-08-10', days: 10, status: 'approved' },
  { key: '2', employee: 'Jane Smith', type: 'Sick Leave', startDate: '2026-07-22', endDate: '2026-07-23', days: 2, status: 'pending' },
  { key: '3', employee: 'Bob Wilson', type: 'Personal Leave', startDate: '2026-08-05', endDate: '2026-08-05', days: 1, status: 'pending' },
];

export default function LeavePage() {
  const { t } = useTranslation();

  const columns = [
    { title: t('hr.employee'), dataIndex: 'employee', key: 'employee' },
    { title: t('hr.type'), dataIndex: 'type', key: 'type' },
    { title: t('hr.startDate'), dataIndex: 'startDate', key: 'startDate' },
    { title: t('hr.endDate'), dataIndex: 'endDate', key: 'endDate' },
    { title: t('hr.days'), dataIndex: 'days', key: 'days' },
    { title: t('hr.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'approved' ? 'green' : s === 'pending' ? 'orange' : 'red'}>{s === 'approved' ? t('hr.approved') : t('hr.pending')}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('hr.leaveManagementTitle')} subtitle={t('hr.manageLeaves')} onAdd={() => {}} addLabel={t('hr.newLeaveRequest')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
