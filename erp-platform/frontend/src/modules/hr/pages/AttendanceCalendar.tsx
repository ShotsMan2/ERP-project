import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Calendar, Badge, Select, Row, Col, Statistic, Typography, Tag, List, Space } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

const attendanceData: Record<string, { status: string; clockIn: string; clockOut: string }> = {
  '2024-12-01': { status: 'present', clockIn: '08:55', clockOut: '18:05' },
  '2024-12-02': { status: 'present', clockIn: '09:00', clockOut: '17:30' },
  '2024-12-03': { status: 'late', clockIn: '09:20', clockOut: '18:10' },
  '2024-12-04': { status: 'present', clockIn: '08:50', clockOut: '18:00' },
  '2024-12-05': { status: 'absent', clockIn: '-', clockOut: '-' },
  '2024-12-08': { status: 'present', clockIn: '08:45', clockOut: '17:45' },
  '2024-12-09': { status: 'present', clockIn: '09:05', clockOut: '18:00' },
  '2024-12-10': { status: 'leave', clockIn: '-', clockOut: '-' },
  '2024-12-11': { status: 'leave', clockIn: '-', clockOut: '-' },
  '2024-12-12': { status: 'present', clockIn: '08:55', clockOut: '18:05' },
  '2024-12-15': { status: 'early', clockIn: '08:50', clockOut: '16:30' },
  '2024-12-16': { status: 'present', clockIn: '08:58', clockOut: '18:02' },
};

const statusColors: Record<string, string> = {
  present: '#52c41a', late: '#faad14', absent: '#ff4d4f', leave: '#1677ff', early: '#722ed1',
};

const getStatusLabels = (t: (key: string) => string): Record<string, string> => ({
  present: t('hr.presentLabel'), late: t('hr.lateLabel'), absent: t('hr.absentLabel'), leave: t('hr.onLeaveLabel'), early: t('hr.earlyLeaveLabel'),
});

const getListData = (date: Dayjs, statusLabels: Record<string, string>) => {
  const key = date.format('YYYY-MM-DD');
  const entry = attendanceData[key];
  if (!entry) return [];
  return [{ type: entry.status, content: `${statusLabels[entry.status]}: ${entry.clockIn} - ${entry.clockOut}` }];
};

const AttendanceCalendar: React.FC = () => {
  const { t } = useTranslation();
  const [month, setMonth] = useState(dayjs());
  const statusLabels = getStatusLabels(t);

  const summaryStats = {
    present: Object.values(attendanceData).filter((d) => d.status === 'present').length,
    late: Object.values(attendanceData).filter((d) => d.status === 'late').length,
    absent: Object.values(attendanceData).filter((d) => d.status === 'absent').length,
    leave: Object.values(attendanceData).filter((d) => d.status === 'leave').length,
    early: Object.values(attendanceData).filter((d) => d.status === 'early').length,
  };

  const cellRender = (date: Dayjs) => {
    const listData = getListData(date, statusLabels);
    return (
      <ul className="list-none p-0 m-0">
        {listData.map((item, idx) => (
          <li key={idx} className="mb-1">
            <Badge color={statusColors[item.type]} text={item.content.split(':')[0]} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="p-6">
      <PageHeader title={t('hr.attendanceCalendarTitle')} subtitle={t('hr.monthlyAttendanceOverview')}>
        <Space>
          <Select defaultValue={month.format('YYYY-MM')} style={{ width: 160 }} onChange={(v) => setMonth(dayjs(v))}>
            {Array.from({ length: 12 }, (_, i) => dayjs().month(i)).map((m) => (
              <Select.Option key={m.format('YYYY-MM')} value={m.format('YYYY-MM')}>
                {m.format('MMMM YYYY')}
              </Select.Option>
            ))}
          </Select>
        </Space>
      </PageHeader>

      <Row gutter={[16, 16]} className="mb-6">
        {Object.entries(summaryStats).map(([key, count]) => (
          <Col xs={12} sm={8} lg={4} key={key}>
            <Card size="small">
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: statusColors[key] }}>{count}</div>
                <Text type="secondary" className="text-xs">{statusLabels[key]}</Text>
              </div>
            </Card>
          </Col>
        ))}
        <Col xs={12} sm={8} lg={4}>
          <Card size="small">
            <div className="text-center">
              <div className="text-lg font-bold">{Object.keys(attendanceData).length}</div>
              <Text type="secondary" className="text-xs">{t('hr.totalDaysLabel')}</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <Calendar cellRender={cellRender} />
      </Card>
    </div>
  );
};

export default AttendanceCalendar;
