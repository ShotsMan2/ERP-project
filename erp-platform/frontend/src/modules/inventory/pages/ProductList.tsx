import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Select, Image, Typography, InputNumber, message } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  reserved: number;
  available: number;
  status: 'active' | 'inactive' | 'discontinued';
  image?: string;
}

const mockProducts: Product[] = [
  { id: '1', sku: 'LAP-001', name: 'Business Laptop Pro 15"', category: 'Electronics', price: 2499.99, cost: 1800, stock: 45, reserved: 5, available: 40, status: 'active' },
  { id: '2', sku: 'MON-002', name: '27" 4K Monitor', category: 'Electronics', price: 599.99, cost: 380, stock: 120, reserved: 15, available: 105, status: 'active' },
  { id: '3', sku: 'KEY-003', name: 'Mechanical Keyboard', category: 'Accessories', price: 149.99, cost: 85, stock: 200, reserved: 25, available: 175, status: 'active' },
  { id: '4', sku: 'MOU-004', name: 'Wireless Mouse', category: 'Accessories', price: 79.99, cost: 42, stock: 350, reserved: 30, available: 320, status: 'active' },
  { id: '5', sku: 'DES-005', name: 'Standing Desk Frame', category: 'Furniture', price: 899.99, cost: 520, stock: 8, reserved: 3, available: 5, status: 'active' },
  { id: '6', sku: 'CHA-006', name: 'Ergonomic Office Chair', category: 'Furniture', price: 1299.99, cost: 780, stock: 3, reserved: 1, available: 2, status: 'active' },
  { id: '7', sku: 'CAB-007', name: 'USB-C Cable 2m', category: 'Accessories', price: 19.99, cost: 8, stock: 0, reserved: 0, available: 0, status: 'discontinued' },
  { id: '8', sku: 'DOCK-008', name: 'USB-C Docking Station', category: 'Electronics', price: 249.99, cost: 145, stock: 25, reserved: 0, available: 25, status: 'inactive' },
];

const categoryOptions = [...new Set(mockProducts.map((p) => p.category))];

const ProductList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');

  const filtered = mockProducts.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      title: t('inventory.productListPage.image'), key: 'image', width: 60,
      render: () => (
        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
          <Text type="secondary" className="text-xs">IMG</Text>
        </div>
      ),
    },
    { title: t('inventory.productListPage.sku'), dataIndex: 'sku', key: 'sku' },
    { title: t('inventory.productListPage.name'), dataIndex: 'name', key: 'name', sorter: (a: Product, b: Product) => a.name.localeCompare(b.name) },
    { title: t('inventory.productListPage.category'), dataIndex: 'category', key: 'category', render: (c: string) => <Tag>{c}</Tag> },
    { title: t('inventory.productListPage.price'), dataIndex: 'price', key: 'price', render: (p: number) => `$${p.toFixed(2)}`, sorter: (a: Product, b: Product) => a.price - b.price },
    {
      title: t('inventory.productListPage.stock'), key: 'stock',
      render: (_: unknown, record: Product) => (
        <span className={record.available <= 5 ? 'text-red-500 font-semibold' : record.available <= 20 ? 'text-orange-500' : ''}>
          {record.stock}
          {record.available <= 5 && ' ⚠'}
        </span>
      ),
      sorter: (a: Product, b: Product) => a.available - b.available,
    },
    {
      title: t('inventory.productListPage.status'), dataIndex: 'status', key: 'status',
      render: (s: string) => <Tag color={s === 'active' ? 'green' : s === 'inactive' ? 'default' : 'red'}>{s}</Tag>,
    },
    {
      title: t('inventory.productListPage.actions'), key: 'actions',
      render: (_: unknown, record: Product) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/inventory/products/${record.id}`)} />
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate(`/inventory/products/${record.id}/edit`)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader title={t('inventory.productListPage.title')} subtitle={t('inventory.productListPage.subtitle')}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/inventory/products/new')}>
          {t('inventory.productListPage.addLabel')}
        </Button>
      </PageHeader>

      <Card>
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder={t('inventory.productListPage.searchPlaceholder')}
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
            allowClear
          />
          <Select
            placeholder={t('inventory.productListPage.filterCategory')}
            value={category || undefined}
            onChange={(v) => setCategory(v || '')}
            allowClear
            className="w-48"
            options={categoryOptions.map((c) => ({ value: c, label: c }))}
          />
        </div>
        <DataTable
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (total: number) => t('inventory.productListPage.showingProducts', { count: total }) }}
        />
      </Card>
    </div>
  );
};

export default ProductList;
