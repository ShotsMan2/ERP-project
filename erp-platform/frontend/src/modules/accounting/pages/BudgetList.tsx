import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Typography, Progress } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

interface Budget { id: string; account: string; accountName: string; department: string; fiscalYear: string; budgeted: number; actual: number; variance: number; variancePct: number; }
const mockBudgets: Budget[] = [
  { id: '1', account: '5100', accountName: 'Salaries & Wages', department: 'Engineering', fiscalYear: '2024', budgeted: 1200000, actual: 1150000, variance: 50000, variancePct: 4.2 },
  { id: '2', account: '5100', accountName: 'Salaries & Wages', department: 'Marketing', fiscalYear: '2024', budgeted: 600000, actual: 580000, variance: 20000, variancePct: 3.3 },
  { id: '3', account: '5200', accountName: 'Rent & Utilities', department: 'All', fiscalYear: '2024', budgeted: 720000, actual: 710000, variance: 10000, variancePct: 1.4 },
  { id: '4', account: '5300', accountName: 'Office Expenses', department: 'Engineering', fiscalYear: '2024', budgeted: 150000, actual: 175000, variance: -25000, variancePct: -16.7 },
  { id: '5', account: '5300', accountName: 'Office Expenses', department: 'Marketing', fiscalYear: '2024', budgeted: 100000, actual: 95000, variance: 5000, variancePct: 5.0 },
  { id: '6', account: '5400', accountName: 'Depreciation', department: 'All', fiscalYear: '2024', budgeted: 550000, actual: 545000, variance: 5000, variancePct: 0.9 },
];

const BudgetList: React.FC = () => {
  const [yearFilter, setYearFilter] = useState<string>('');
  const filtered = yearFilter ? mockBudgets.filter((b) => b.fiscalYear === yearFilter) : mockBudgets;
  const totalBudgeted = filtered.reduce((s, b) => s + b.budgeted, 0);
  const totalActual = filtered.reduce((s, b) => s + b.actual, 0);

  const columns = [
    { title: 'Account', dataIndex: 'account' },
    { title: 'Account Name', dataIndex: 'accountName' },
    { title: 'Department', dataIndex: 'department' },
    { title: 'Budgeted', dataIndex: 'budgeted', render: (v: number) => '$' + v.toLocaleString(), sorter: (a: Budget, b: Budget) => a.budgeted - b.budgeted },
    { title: 'Actual', dataIndex: 'actual', render: (v: number) => '$' + v.toLocaleString() },
    { title: 'Variance', dataIndex: 'variance', render: (v: number) => <span className={v < 0 ? 'text-red-500' : 'text-green-600'}>${v.toLocaleString()}</span> },
    { title: 'Utilization', dataIndex: 'variancePct', render: (p: number, r: Budget) => {
      const pct = Math.round((r.actual / r.budgeted) * 100);
      return <Progress percent={pct} size="small" status={pct > 100 ? 'exception' : pct > 90 ? 'active' : undefined} />;
    }},
  ];

  return (
    <div className="p-6">
      <PageHeader title="Budgets" subtitle="Budget planning and variance analysis">
        <Space>
          <Select placeholder="Filter by year" value={yearFilter || undefined} onChange={(v) => setYearFilter(v || '')} allowClear className="w-40"
            options={[{ value: '2024', label: '2024' }, { value: '2025', label: '2025' }]} />
          <Button type="primary" icon={<PlusOutlined />}>New Budget</Button>
        </Space>
      </PageHeader>
      <div className="flex gap-4 mb-4">
        <Card size="small"><Text type="secondary">Total Budgeted</Text><div className="text-lg font-bold">${totalBudgeted.toLocaleString()}</div></Card>
        <Card size="small"><Text type="secondary">Total Actual</Text><div className="text-lg font-bold">${totalActual.toLocaleString()}</div></Card>
        <Card size="small"><Text type="secondary">Overall Variance</Text><div className="text-lg font-bold">${(totalBudgeted - totalActual).toLocaleString()}</div></Card>
      </div>
      <Card><Table dataSource={filtered} columns={columns} rowKey="id" pagination={false} size="small" /></Card>
    </div>
  );
};
export default BudgetList;
