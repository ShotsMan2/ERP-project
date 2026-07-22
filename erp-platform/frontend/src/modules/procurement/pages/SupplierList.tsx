import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Rate, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;
interface Supplier { id: string; code: string; name: string; email: string; phone: string; category: string; rating: number; status: string; paymentTerms: string; }
const mockSuppliers: Supplier[] = [
  { id: '1', code: 'SUP001', name: 'TechSupply Inc.', email: 'orders@techsupply.com', phone: '+1-555-0401', category: 'Electronics', rating: 4.5, status: 'active', paymentTerms: 'Net 30' },
  { id: '2', code: 'SUP002', name: 'OfficeWorld Ltd.', email: 'sales@officeworld.com', phone: '+1-555-0402', category: 'Office Supplies', rating: 4.0, status: 'active', paymentTerms: 'Net 15' },
  { id: '3', code: 'SUP003', name: 'Global Parts Co.', email: 'info@globalparts.com', phone: '+1-555-0403', category: 'Industrial', rating: 3.5, status: 'active', paymentTerms: 'Net 30' },
  { id: '4', code: 'SUP004', name: 'LogiSupply GmbH', email: 'kontakt@logisupply.de', phone: '+49-555-0404', category: 'Logistics', rating: 5.0, status: 'active', paymentTerms: 'Net 60' },
  { id: '5', code: 'SUP005', name: 'Quality Materials Inc.', email: 'info@qmaterials.com', phone: '+1-555-0405', category: 'Raw Materials', rating: 3.0, status: 'inactive', paymentTerms: 'Net 30' },
];

const SupplierList: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filtered = mockSuppliers.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { title: t('procurement.supplierList.code'), dataIndex: 'code', key: 'code' },
    { title: t('procurement.supplierList.name'), dataIndex: 'name', key: 'name', sorter: (a: Supplier, b: Supplier) => a.name.localeCompare(b.name) },
    { title: t('procurement.supplierList.email'), dataIndex: 'email', key: 'email' },
    { title: t('procurement.supplierList.category'), dataIndex: 'category', key: 'category', render: (c: string) => <Tag>{c}</Tag> },
    { title: t('procurement.supplierList.rating'), dataIndex: 'rating', key: 'rating', render: (r: number) => <Rate disabled allowHalf value={r} /> },
    { title: t('procurement.supplierList.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag> },
    { title: t('procurement.supplierList.paymentTerms'), dataIndex: 'paymentTerms', key: 'paymentTerms' },
    { title: t('procurement.supplierList.actions'), key: 'actions', render: (_: unknown, r: Supplier) => (
      <Space><Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate('/procurement/suppliers/' + r.id)} /><Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate('/procurement/suppliers/' + r.id + '/edit')} /></Space>
    )},
  ];

  return (
    <div className="p-6">
      <PageHeader title={t('procurement.supplierList.title')} subtitle={t('procurement.supplierList.subtitle')}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/procurement/suppliers/new')}>{t('procurement.supplierList.addSupplier')}</Button>
      </PageHeader>
      <Card>
        <Input placeholder={t('procurement.supplierList.searchSuppliers')} prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs mb-4" allowClear />
        <DataTable dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (cnt: number) => t('procurement.supplierList.suppliersCount', { count: cnt }) }} />
      </Card>
    </div>
  );
};

export default SupplierList;
