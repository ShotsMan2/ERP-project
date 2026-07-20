import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Typography, message } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';

interface Journal { id: string; reference: string; journalType: string; description: string; totalDebit: number; totalCredit: number; status: string; createdBy: string; createdAt: string; postedAt?: string; }
const mockJournals: Journal[] = [
  { id: '1', reference: 'JR-2024-0089', journalType: 'general', description: 'Monthly accrual entries', totalDebit: 125000, totalCredit: 125000, status: 'posted', createdBy: 'Carol Martinez', createdAt: '2024-12-15', postedAt: '2024-12-15' },
  { id: '2', reference: 'JR-2024-0088', journalType: 'sales', description: 'Sales invoices December', totalDebit: 289000, totalCredit: 289000, status: 'draft', createdBy: 'Carol Martinez', createdAt: '2024-12-14' },
  { id: '3', reference: 'JR-2024-0087', journalType: 'purchase', description: 'Purchase invoices December', totalDebit: 156000, totalCredit: 156000, status: 'posted', createdBy: 'Carol Martinez', createdAt: '2024-12-13', postedAt: '2024-12-13' },
  { id: '4', reference: 'JR-2024-0086', journalType: 'payroll', description: 'December payroll run', totalDebit: 485000, totalCredit: 485000, status: 'posted', createdBy: 'Carol Martinez', createdAt: '2024-12-10', postedAt: '2024-12-10' },
  { id: '5', reference: 'JR-2024-0085', journalType: 'general', description: 'Depreciation for Q4', totalDebit: 45000, totalCredit: 45000, status: 'draft', createdBy: 'Carol Martinez', createdAt: '2024-12-08' },
];

const statusColors: Record<string, string> = { draft: 'default', posted: 'green', cancelled: 'red' };
const typeColors: Record<string, string> = { general: 'blue', sales: 'green', purchase: 'orange', payroll: 'purple' };

const JournalList: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const filtered = statusFilter ? mockJournals.filter((j) => j.status === statusFilter) : mockJournals;

  const columns = [
    { title: 'Reference', dataIndex: 'reference', key: 'reference' },
    { title: 'Type', dataIndex: 'journalType', key: 'journalType', render: (t: string) => <Tag color={typeColors[t]}>{t.toUpperCase()}</Tag> },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Total Debit', dataIndex: 'totalDebit', key: 'totalDebit', render: (v: number) => '$' + v.toLocaleString() },
    { title: 'Total Credit', dataIndex: 'totalCredit', key: 'totalCredit', render: (v: number) => '$' + v.toLocaleString() },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag> },
    { title: 'Created', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Actions', key: 'actions', render: (_: unknown, r: Journal) => (
      <Space>
        <Button type="link" size="small" icon={<EyeOutlined />} />
        {r.status === 'draft' && <Button type="link" size="small" style={{ color: '#52c41a' }} onClick={() => message.success('Journal posted')}>Post</Button>}
      </Space>
    )},
  ];

  return (
    <div className="p-6">
      <PageHeader title="Journal Batches" subtitle="General ledger journal entries">
        <Space>
          <Select placeholder="Filter by status" value={statusFilter || undefined} onChange={(v) => setStatusFilter(v || '')} allowClear className="w-40"
            options={[{ value: 'draft', label: 'Draft' }, { value: 'posted', label: 'Posted' }, { value: 'cancelled', label: 'Cancelled' }]} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/accounting/journals/new')}>New Journal</Button>
        </Space>
      </PageHeader>
      <Card><DataTable dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (t: number) => t + ' journals' }} /></Card>
    </div>
  );
};
export default JournalList;
