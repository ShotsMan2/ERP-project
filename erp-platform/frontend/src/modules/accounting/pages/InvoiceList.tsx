import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Typography, message } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';

interface Invoice { id: string; invoiceNumber: string; type: string; direction: string; customerSupplier: string; issueDate: string; dueDate: string; total: number; status: string; }
const mockInvoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2024-0892', type: 'sales', direction: 'AR', customerSupplier: 'Acme Corp', issueDate: '2024-12-16', dueDate: '2025-01-15', total: 28999.90, status: 'unpaid' },
  { id: '2', invoiceNumber: 'INV-2024-0891', type: 'sales', direction: 'AR', customerSupplier: 'GlobalTech Inc.', issueDate: '2024-12-15', dueDate: '2025-01-14', total: 12500.00, status: 'unpaid' },
  { id: '3', invoiceNumber: 'INV-2024-0890', type: 'purchase', direction: 'AP', customerSupplier: 'TechSupply Inc.', issueDate: '2024-12-14', dueDate: '2025-01-13', total: 45000.00, status: 'unpaid' },
  { id: '4', invoiceNumber: 'INV-2024-0889', type: 'sales', direction: 'AR', customerSupplier: 'Beta Solutions', issueDate: '2024-12-13', dueDate: '2024-12-28', total: 8999.85, status: 'overdue' },
  { id: '5', invoiceNumber: 'INV-2024-0888', type: 'sales', direction: 'AR', customerSupplier: 'Acme Corp', issueDate: '2024-12-11', dueDate: '2025-01-10', total: 45000.00, status: 'paid' },
  { id: '6', invoiceNumber: 'INV-2024-0887', type: 'purchase', direction: 'AP', customerSupplier: 'OfficeWorld Ltd.', issueDate: '2024-12-10', dueDate: '2024-12-25', total: 12500.00, status: 'paid' },
];

const statusColors: Record<string, string> = { unpaid: 'orange', paid: 'green', overdue: 'red', cancelled: 'default', draft: 'default' };
const typeColors: Record<string, string> = { sales: 'blue', purchase: 'purple' };

const InvoiceList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<string>('');
  const filtered = typeFilter ? mockInvoices.filter((inv) => inv.type === typeFilter) : mockInvoices;

  const columns = [
    { title: t('accounting.invoiceList.invoiceNumber'), dataIndex: 'invoiceNumber', key: 'invoiceNumber', render: (v: string) => <a onClick={() => navigate('/accounting/invoices/' + v)}>{v}</a> },
    { title: t('accounting.invoiceList.type'), dataIndex: 'type', key: 'type', render: (tVal: string) => <Tag color={typeColors[tVal]}>{tVal.toUpperCase()}</Tag> },
    { title: t('accounting.invoiceList.customerSupplier'), dataIndex: 'customerSupplier', key: 'customerSupplier' },
    { title: t('accounting.invoiceList.issueDate'), dataIndex: 'issueDate', key: 'issueDate' },
    { title: t('accounting.invoiceList.dueDate'), dataIndex: 'dueDate', key: 'dueDate', render: (v: string, r: Invoice) => <span className={r.status === 'overdue' ? 'text-red-500 font-semibold' : ''}>{v}</span> },
    { title: t('accounting.invoiceList.total'), dataIndex: 'total', key: 'total', render: (v: number) => '$' + v.toLocaleString(), sorter: (a: Invoice, b: Invoice) => a.total - b.total },
    { title: t('accounting.invoiceList.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag> },
    { title: t('accounting.invoiceList.actions'), key: 'actions', render: (_: unknown, r: Invoice) => (
      <Space><Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate('/accounting/invoices/' + r.invoiceNumber)} />{r.status === 'unpaid' && <Button type="link" size="small" style={{ color: '#52c41a' }} onClick={() => message.info('Opening payment form')}>{t('accounting.invoiceList.pay')}</Button>}</Space>
    )},
  ];

  return (
    <div className="p-6">
      <PageHeader title={t('accounting.invoiceList.title')} subtitle={t('accounting.invoiceList.subtitle')}>
        <Space>
          <Select placeholder={t('accounting.invoiceList.filterByType')} value={typeFilter || undefined} onChange={(v) => setTypeFilter(v || '')} allowClear className="w-40"
            options={[{ value: 'sales', label: t('accounting.invoiceForm.salesAR') }, { value: 'purchase', label: t('accounting.invoiceForm.purchaseAP') }]} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/accounting/invoices/new')}>{t('accounting.invoiceList.newInvoice')}</Button>
        </Space>
      </PageHeader>
      <Card><DataTable dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (tCount: number) => tCount + ' ' + t('accounting.invoiceList.invoices') }} /></Card>
    </div>
  );
};
export default InvoiceList;
