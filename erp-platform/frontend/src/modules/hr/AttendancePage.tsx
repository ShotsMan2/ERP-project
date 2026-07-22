import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

const data = [
  { key: '1', employee: 'John Doe', date: '2026-07-20', clockIn: '08:15', clockOut: '17:30', hours: '8.25', status: 'present' },
  { key: '2', employee: 'Jane Smith', date: '2026-07-20', clockIn: '08:30', clockOut: '17:00', hours: '7.5', status: 'present' },
  { key: '3', employee: 'Bob Wilson', date: '2026-07-20', clockIn: '-', clockOut: '-', hours: '0', status: 'absent' },
];

export default function AttendancePage() {
  const { t } = useTranslation();

  const columns = [
    { title: t('hr.employee'), dataIndex: 'employee', key: 'employee' },
    { title: t('hr.date'), dataIndex: 'date', key: 'date' },
    { title: t('hr.clockIn'), dataIndex: 'clockIn', key: 'clockIn' },
    { title: t('hr.clockOut'), dataIndex: 'clockOut', key: 'clockOut' },
    { title: t('hr.hours'), dataIndex: 'hours', key: 'hours' },
    { title: t('hr.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'present' ? 'green' : 'red'}>{s === 'present' ? t('hr.present') : t('hr.absent')}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('hr.attendanceTitle')} subtitle={t('hr.trackAttendance')} />
      <Card><Table columns={columns} dataSource={data} pagination={false} /></Card>
    </div>
  );
}
