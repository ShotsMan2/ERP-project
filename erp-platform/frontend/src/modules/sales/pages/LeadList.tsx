import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Input, Rate, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';
interface Lead { id: string; name: string; company: string; email: string; phone: string; source: string; status: string; score: number; assignedTo: string; created: string; }
const mockLeads: Lead[] = [
  { id: '1', name: 'John Prospect', company: 'FutureCorp', email: 'john@futurecorp.com', phone: '+1-555-0601', source: 'Website', status: 'new', score: 85, assignedTo: 'Sarah Johnson', created: '2024-12-15' },
  { id: '2', name: 'Jane Interest', company: 'NextGen Inc.', email: 'jane@nextgen.com', phone: '+1-555-0602', source: 'Referral', status: 'contacted', score: 70, assignedTo: 'Sarah Johnson', created: '2024-12-14' },
  { id: '3', name: 'Bob Qualify', company: 'StartupXYZ', email: 'bob@startupxyz.com', phone: '+1-555-0603', source: 'LinkedIn', status: 'qualified', score: 92, assignedTo: 'Mike Brown', created: '2024-12-12' },
  { id: '4', name: 'Alice Cold', company: 'OldCorp', email: 'alice@oldcorp.com', phone: '+1-555-0604', source: 'Trade Show', status: 'cold', score: 25, assignedTo: 'Mike Brown', created: '2024-11-28' },
  { id: '5', name: 'Tom Lost', company: 'Lost Inc.', email: 'tom@lostinc.com', phone: '+1-555-0605', source: 'Email', status: 'lost', score: 15, assignedTo: 'Sarah Johnson', created: '2024-11-20' },
];

const statusColors: Record<string, string> = { new: 'blue', contacted: 'orange', qualified: 'green', proposal: 'purple', negotiation: 'cyan', won: 'gold', lost: 'red', cold: 'default' };
const scoreColor = (s: number) => s >= 80 ? 'green' : s >= 50 ? 'orange' : 'red';

const LeadList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const filtered = mockLeads.filter((l) => {
    const m = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase());
    const ms = !statusFilter || l.status === statusFilter;
    return m && ms;
  });

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: (v: string, r: Lead) => <a onClick={() => navigate('/sales/leads/' + r.id)}>{v}</a> },
    { title: 'Company', dataIndex: 'company', key: 'company' },
    { title: 'Source', dataIndex: 'source', key: 'source', render: (s: string) => <Tag>{s}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag> },
    { title: 'Score', dataIndex: 'score', key: 'score', render: (s: number) => <Tag color={scoreColor(s)}>{s}</Tag>, sorter: (a: Lead, b: Lead) => a.score - b.score },
    { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assignedTo' },
    { title: 'Created', dataIndex: 'created', key: 'created' },
    { title: 'Actions', key: 'actions', render: (_: unknown, r: Lead) => (
      <Space><Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate('/sales/leads/' + r.id)} /><Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate('/sales/leads/' + r.id + '/edit')} /></Space>
    )},
  ];

  return (
    <div className="p-6">
      <PageHeader title="Leads" subtitle="Manage sales leads and prospects">
        <Space>
          <Select placeholder="Filter by status" value={statusFilter || undefined} onChange={(v) => setStatusFilter(v || '')} allowClear className="w-40"
            options={[{ value: 'new', label: 'New' }, { value: 'contacted', label: 'Contacted' }, { value: 'qualified', label: 'Qualified' }, { value: 'cold', label: 'Cold' }, { value: 'lost', label: 'Lost' }]} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/sales/leads/new')}>Add Lead</Button>
        </Space>
      </PageHeader>
      <Card>
        <Input placeholder="Search leads..." prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs mb-4" allowClear />
        <DataTable dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (t: number) => t + ' leads' }} />
      </Card>
    </div>
  );
};
export default LeadList;
