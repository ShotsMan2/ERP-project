import { useState } from 'react';
import { Card, Table, Typography, Tag, Space, Button, Input, message } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

interface Account { key: string; code: string; name: string; type: string; balance: number; isActive: boolean; children?: Account[]; }

const accountData: Account[] = [
  { key: '1', code: '1000', name: 'Assets', type: 'asset', balance: 2500000, isActive: true, children: [
    { key: '1-1', code: '1100', name: 'Cash & Bank', type: 'asset', balance: 500000, isActive: true, children: [
      { key: '1-1-1', code: '1101', name: 'Cash on Hand', type: 'asset', balance: 25000, isActive: true },
      { key: '1-1-2', code: '1102', name: 'Checking Account', type: 'asset', balance: 350000, isActive: true },
      { key: '1-1-3', code: '1103', name: 'Savings Account', type: 'asset', balance: 125000, isActive: true },
    ]},
    { key: '1-2', code: '1200', name: 'Accounts Receivable', type: 'asset', balance: 450000, isActive: true },
    { key: '1-3', code: '1300', name: 'Inventory', type: 'asset', balance: 1250000, isActive: true },
    { key: '1-4', code: '1400', name: 'Fixed Assets', type: 'asset', balance: 300000, isActive: true },
  ]},
  { key: '2', code: '2000', name: 'Liabilities', type: 'liability', balance: -980000, isActive: true, children: [
    { key: '2-1', code: '2100', name: 'Accounts Payable', type: 'liability', balance: -320000, isActive: true },
    { key: '2-2', code: '2200', name: 'Short-term Loans', type: 'liability', balance: -450000, isActive: true },
    { key: '2-3', code: '2300', name: 'Tax Payable', type: 'liability', balance: -210000, isActive: true },
  ]},
  { key: '3', code: '3000', name: 'Equity', type: 'equity', balance: -1520000, isActive: true, children: [
    { key: '3-1', code: '3100', name: 'Share Capital', type: 'equity', balance: -1000000, isActive: true },
    { key: '3-2', code: '3200', name: 'Retained Earnings', type: 'equity', balance: -520000, isActive: true },
  ]},
  { key: '4', code: '4000', name: 'Revenue', type: 'revenue', balance: -4500000, isActive: true, children: [
    { key: '4-1', code: '4100', name: 'Sales Revenue', type: 'revenue', balance: -4000000, isActive: true },
    { key: '4-2', code: '4200', name: 'Service Revenue', type: 'revenue', balance: -500000, isActive: true },
  ]},
  { key: '5', code: '5000', name: 'Expenses', type: 'expense', balance: 3200000, isActive: true, children: [
    { key: '5-1', code: '5100', name: 'Salaries & Wages', type: 'expense', balance: 1800000, isActive: true },
    { key: '5-2', code: '5200', name: 'Rent & Utilities', type: 'expense', balance: 600000, isActive: true },
    { key: '5-3', code: '5300', name: 'Office Expenses', type: 'expense', balance: 350000, isActive: true },
    { key: '5-4', code: '5400', name: 'Depreciation', type: 'expense', balance: 450000, isActive: true },
  ]},
];

const typeColors: Record<string, string> = { asset: 'blue', liability: 'orange', equity: 'purple', revenue: 'green', expense: 'red' };

const ChartOfAccounts: React.FC = () => {
  const [search, setSearch] = useState('');

  const columns: ColumnsType<Account> = [
    { title: 'Code', dataIndex: 'code', key: 'code', width: 120 },
    { title: 'Account Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color={typeColors[t]}>{t.toUpperCase()}</Tag> },
    { title: 'Balance', dataIndex: 'balance', key: 'balance', align: 'right' as const, render: (v: number) => <Text className={v < 0 ? 'text-green-600' : ''}>${Math.abs(v).toLocaleString()}</Text> },
    { title: 'Actions', key: 'actions', render: () => <Button type="link" size="small" icon={<EditOutlined />} /> },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Chart of Accounts" subtitle="General ledger account structure">
        <Space>
          <Input placeholder="Search accounts..." prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" allowClear />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('Opening new account form')}>Add Account</Button>
        </Space>
      </PageHeader>
      <Card>
        <Table columns={columns} dataSource={accountData} rowKey="key" pagination={false} size="small" defaultExpandAllRows />
      </Card>
    </div>
  );
};
export default ChartOfAccounts;
