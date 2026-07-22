import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/data/DataTable';

const data = [
  { id: '1', name: 'Laptop Pro 15', sku: 'LAP-001', category: 'Electronics', price: 1299.99, stock: 45, status: 'active' },
  { id: '2', name: 'Office Desk', sku: 'FUR-001', category: 'Furniture', price: 449.99, stock: 12, status: 'active' },
  { id: '3', name: 'Wireless Mouse', sku: 'ACC-001', category: 'Accessories', price: 29.99, stock: 150, status: 'active' },
  { id: '4', name: 'Monitor 27"', sku: 'MON-001', category: 'Electronics', price: 399.99, stock: 0, status: 'inactive' },
];

export default function ProductList() {
  const { t } = useTranslation();

  const columns = [
    { title: t('inventory.productListPage.name'), dataIndex: 'name', key: 'name', sorter: (a: any, b: any) => a.name.localeCompare(b.name) },
    { title: t('inventory.productListPage.sku'), dataIndex: 'sku', key: 'sku' },
    { title: t('inventory.productListPage.category'), dataIndex: 'category', key: 'category' },
    { title: t('inventory.productListPage.price'), dataIndex: 'price', key: 'price', render: (v: number) => `$${v.toFixed(2)}`, sorter: (a: any, b: any) => a.price - b.price },
    { title: t('inventory.productListPage.stock'), dataIndex: 'stock', key: 'stock', render: (v: number) => <span className={v < 10 ? 'text-error font-bold' : ''}>{v}</span> },
    { title: t('inventory.productListPage.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('inventory.productListPage.title')} subtitle={t('inventory.productListPage.subtitle')} onAdd={() => {}} addLabel={t('inventory.productListPage.addLabel')} />
      <DataTable columns={columns} dataSource={data} rowKey="id" searchable selectable />
    </div>
  );
}
