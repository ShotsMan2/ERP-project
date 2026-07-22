import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Tag, Button, Space, Typography, message, Progress } from 'antd';
import { PlusOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

interface PayrollRun {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'processing' | 'completed' | 'cancelled' | 'paid';
  employeeCount: number;
  totalGross: number;
  totalNet: number;
  totalTax: number;
  processedBy: string;
  processedAt: string;
}

const mockPayrolls: PayrollRun[] = [
  { id: 'PR001', period: 'December 2024', startDate: '2024-12-01', endDate: '2024-12-31', status: 'draft', employeeCount: 0, totalGross: 0, totalNet: 0, totalTax: 0, processedBy: '-', processedAt: '-' },
  { id: 'PR002', period: 'November 2024', startDate: '2024-11-01', endDate: '2024-11-30', status: 'processing', employeeCount: 125, totalGross: 675000, totalNet: 485000, totalTax: 190000, processedBy: 'Carol Martinez', processedAt: '2024-12-05' },
  { id: 'PR003', period: 'October 2024', startDate: '2024-10-01', endDate: '2024-10-31', status: 'completed', employeeCount: 122, totalGross: 652000, totalNet: 468000, totalTax: 184000, processedBy: 'Carol Martinez', processedAt: '2024-11-05' },
  { id: 'PR004', period: 'September 2024', startDate: '2024-09-01', endDate: '2024-09-30', status: 'paid', employeeCount: 120, totalGross: 640000, totalNet: 460000, totalTax: 180000, processedBy: 'Carol Martinez', processedAt: '2024-10-05' },
  { id: 'PR005', period: 'August 2024', startDate: '2024-08-01', endDate: '2024-08-31', status: 'paid', employeeCount: 118, totalGross: 628000, totalNet: 451000, totalTax: 177000, processedBy: 'Carol Martinez', processedAt: '2024-09-05' },
];

const statusColors: Record<string, string> = {
  draft: 'default', processing: 'processing', completed: 'green', cancelled: 'red', paid: 'blue',
};

const PayrollList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = [
    { title: t('hr.periodLabel'), dataIndex: 'period', key: 'period', sorter: (a: PayrollRun, b: PayrollRun) => b.period.localeCompare(a.period) },
    { title: t('hr.employeesLabel'), dataIndex: 'employeeCount', key: 'employeeCount' },
    { title: t('hr.grossPayLabel'), dataIndex: 'totalGross', key: 'totalGross', render: (v: number) => v ? `$${v.toLocaleString()}` : '-' },
    { title: t('hr.netPayLabel'), dataIndex: 'totalNet', key: 'totalNet', render: (v: number) => v ? `$${v.toLocaleString()}` : '-' },
    { title: t('hr.totalTaxLabel'), dataIndex: 'totalTax', key: 'totalTax', render: (v: number) => v ? `$${v.toLocaleString()}` : '-' },
    {
      title: t('common.status'), dataIndex: 'status', key: 'status',
      render: (s: string) => (
        <Space>
          <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag>
          {s === 'processing' && <Progress type="circle" percent={60} size={20} />}
        </Space>
      ),
    },
    {
      title: t('common.actions'), key: 'actions',
      render: (_: unknown, record: PayrollRun) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/hr/payroll/${record.id}`)}>
            {t('hr.viewBtn')}
          </Button>
          {record.status === 'draft' && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} style={{ color: '#52c41a' }} onClick={() => message.success(t('hr.payrollProcessingStarted'))}>
              {t('hr.processBtn')}
            </Button>
          )}
          {record.status === 'completed' && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} style={{ color: '#1677ff' }} onClick={() => message.success(t('hr.payrollMarkedPaid'))}>
              {t('hr.markPaidBtn')}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader title={t('hr.payrollRunsTitle')} subtitle={t('hr.managePayrollCycles')}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info(t('hr.newPayrollRunBtn'))}>
          {t('hr.newPayrollRunBtn')}
        </Button>
      </PageHeader>

      <Card>
        <DataTable
          dataSource={mockPayrolls}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (count: number) => t('hr.payrollRunsCount', { count }) }}
        />
      </Card>
    </div>
  );
};

export default PayrollList;
