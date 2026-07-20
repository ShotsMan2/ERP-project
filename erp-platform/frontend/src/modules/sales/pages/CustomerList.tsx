import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';
interface Customer { id: string; code: string; name: string; email: string; segment: string; creditLimit: number; balance: number; status: string; }
const mockCustomers: Customer[] = [
  { id: '1', code: 'CUST001', name: 'Acme Corp', email: 'billing@acme.com', segment: 'Enterprise', creditLimit: 100000, balance: 45000, status: 'active' },
  { id: '2', code: 'CUST002', name: 'GlobalTech Inc.', email: 'ap@globaltech.com', segment: 'Mid-Market', creditLimit: 50000, balance: 12500, status: 'active' },
  { id: '3', code: 'CUST003', name: 'Beta Solutions', email: 'finance@beta.com', segment: 'SMB', creditLimit: 25000, balance: 8900, status: 'active' },
  { id: '4', code: 'CUST004', name: 'Delta Industries', email: 'info@deltaind.com', segment: 'Enterprise', creditLimit: 200000, balance: 0, status: 'active' },
  { id: '5', code: 'CUST005', name: 'Gamma LLC', email: 'payments@gamma.com', segment: 'SMB', creditLimit: 10000, balance: 15000, status: 'on_hold' },
];

const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const filtered = mockCustomers.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a: Customer, b: Customer) => a.name.localeCompare(b.name) },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Segment', dataIndex: 'segment', key: 'segment', render: (s: string) => <Tag color={s === 'Enterprise' ? 'blue' : s === 'Mid-Market' ? 'orange' : 'green'}>{s}</Tag> },
    { title: 'Credit Limit', dataIndex: 'creditLimit', key: 'creditLimit', render: (v: number) => '$' + v.toLocaleString() },
    { title: 'Balance', dataIndex: 'balance', key: 'balance', render: (v: number) => <span className={v > 0 ? 'text-orange-500' : ''}>$' + v.toLocaleString()</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'red'}>{s.replace('_', ' ')}</Tag> },
    { title: 'Actions', key: 'actions', render: (_: unknown, r: Customer) => (
      <Space><Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate('/sales/customers/' + r.id)} /><Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate('/sales/customers/' + r.id + '/edit')} /></Space>
    )},
  ];

  return (
    <div className="p-6">
      <PageHeader title="Customers" subtitle="Manage customer relationships">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/sales/customers/new')}>Add Customer</Button>
      </PageHeader>
      <Card>
        <Input placeholder="Search customers..." prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs mb-4" allowClear />
        <DataTable dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (t: number) => t + ' customers' }} />
      </Card>
    </div>
  );
};
export default CustomerList;
