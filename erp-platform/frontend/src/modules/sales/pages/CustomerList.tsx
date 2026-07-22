import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const filtered = mockCustomers.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { title: t('sales.customerList.code'), dataIndex: 'code', key: 'code' },
    { title: t('sales.customerList.name'), dataIndex: 'name', key: 'name', sorter: (a: Customer, b: Customer) => a.name.localeCompare(b.name) },
    { title: t('sales.customerList.email'), dataIndex: 'email', key: 'email' },
    { title: t('sales.customerList.segment'), dataIndex: 'segment', key: 'segment', render: (s: string) => <Tag color={s === 'Enterprise' ? 'blue' : s === 'Mid-Market' ? 'orange' : 'green'}>{s}</Tag> },
    { title: t('sales.customerList.creditLimit'), dataIndex: 'creditLimit', key: 'creditLimit', render: (v: number) => '$' + v.toLocaleString() },
    { title: t('sales.customerList.balance'), dataIndex: 'balance', key: 'balance', render: (v: number) => <span className={v > 0 ? 'text-orange-500' : ''}>$' + v.toLocaleString()</span> },
    { title: t('sales.customerList.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'red'}>{s.replace('_', ' ')}</Tag> },
    { title: t('sales.customerList.actions'), key: 'actions', render: (_: unknown, r: Customer) => (
      <Space><Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate('/sales/customers/' + r.id)} /><Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate('/sales/customers/' + r.id + '/edit')} /></Space>
    )},
  ];

  return (
    <div className="p-6">
      <PageHeader title={t('sales.customerList.title')} subtitle={t('sales.customerList.subtitle')}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/sales/customers/new')}>{t('sales.customerList.addCustomer')}</Button>
      </PageHeader>
      <Card>
        <Input placeholder={t('sales.customerList.searchCustomers')} prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs mb-4" allowClear />
        <DataTable dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (total: number) => t('sales.customerList.customersCount', { count: total }) }} />
      </Card>
    </div>
  );
};
export default CustomerList;
