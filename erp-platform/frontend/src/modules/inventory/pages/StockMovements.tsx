import { useState } from 'react';
import { Card, Table, Tag, Input, Select, Typography, Space, Button } from 'antd';
import { SearchOutlined, LinkOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

interface StockMovement {
  id: string;
  date: string;
  type: 'in' | 'out' | 'transfer' | 'adjustment' | 'return';
  product: string;
  sku: string;
  quantity: number;
  reference: string;
  referenceType: string;
  from: string;
  to: string;
  reason: string;
  createdBy: string;
}

const mockMovements: StockMovement[] = [
  { id: 'M001', date: '2024-12-15 10:30', type: 'in', product: 'Business Laptop Pro 15"', sku: 'LAP-001', quantity: 50, reference: 'PO-2024-0156', referenceType: 'Purchase Order', from: '-', to: 'Main- A-01-01', reason: 'Purchase Receipt', createdBy: 'John Smith' },
  { id: 'M002', date: '2024-12-15 09:15', type: 'out', product: 'Wireless Mouse', sku: 'MOU-004', quantity: -10, reference: 'SO-2024-0234', referenceType: 'Sales Order', from: 'East- B-02-01', to: '-', reason: 'Customer Shipment', createdBy: 'System' },
  { id: 'M003', date: '2024-12-14 14:00', type: 'transfer', product: '27" 4K Monitor', sku: 'MON-002', quantity: -15, reference: 'XFER-2024-008', referenceType: 'Stock Transfer', from: 'Main- A-02-01', to: 'East- B-03-01', reason: 'Warehouse Rebalancing', createdBy: 'Mike Brown' },
  { id: 'M004', date: '2024-12-14 11:20', type: 'adjustment', product: 'Mechanical Keyboard', sku: 'KEY-003', quantity: -2, reference: 'ADJ-2024-003', referenceType: 'Adjustment', from: 'Main- A-03-01', to: '-', reason: 'Damaged during inspection', createdBy: 'Mike Brown' },
  { id: 'M005', date: '2024-12-13 16:45', type: 'in', product: 'Ergonomic Office Chair', sku: 'CHA-006', quantity: 20, reference: 'PO-2024-0155', referenceType: 'Purchase Order', from: '-', to: 'Main- C-02-01', reason: 'Purchase Receipt', createdBy: 'John Smith' },
  { id: 'M006', date: '2024-12-13 08:30', type: 'return', product: 'USB-C Cable 2m', sku: 'CAB-007', quantity: 5, reference: 'RMA-2024-002', referenceType: 'Customer Return', from: '-', to: 'Main- A-05-01', reason: 'Defective product return', createdBy: 'Sarah Johnson' },
];

const typeColors: Record<string, string> = {
  in: 'green', out: 'red', transfer: 'blue', adjustment: 'orange', return: 'purple',
};

const StockMovements: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const filtered = mockMovements.filter((m) => {
    const matchesSearch = !search || m.product.toLowerCase().includes(search.toLowerCase()) || m.sku.toLowerCase().includes(search.toLowerCase()) || m.reference.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const columns = [
    { title: t('inventory.stockMovementsPage.date'), dataIndex: 'date', key: 'date', sorter: (a: StockMovement, b: StockMovement) => dayjs(a.date).unix() - dayjs(b.date).unix() },
    {
      title: t('inventory.stockMovementsPage.type'), dataIndex: 'type', key: 'type',
      render: (t: string) => <Tag color={typeColors[t]}>{t.toUpperCase()}</Tag>,
    },
    { title: t('inventory.stockMovementsPage.product'), dataIndex: 'product', key: 'product' },
    { title: t('inventory.stockMovementsPage.sku'), dataIndex: 'sku', key: 'sku' },
    {
      title: t('inventory.stockMovementsPage.qty'), dataIndex: 'quantity', key: 'quantity',
      render: (v: number) => <span className={v > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{v > 0 ? `+${v}` : v}</span>,
    },
    { title: t('inventory.stockMovementsPage.reference'), dataIndex: 'reference', key: 'reference', render: (r: string) => <a className="text-blue-600"><Space><LinkOutlined />{r}</Space></a> },
    { title: t('inventory.stockMovementsPage.from'), dataIndex: 'from', key: 'from' },
    { title: t('inventory.stockMovementsPage.to'), dataIndex: 'to', key: 'to' },
    { title: t('inventory.stockMovementsPage.reason'), dataIndex: 'reason', key: 'reason' },
  ];

  return (
    <div className="p-6">
      <PageHeader title={t('inventory.stockMovementsPage.title')} subtitle={t('inventory.stockMovementsPage.subtitle')} />

      <Card>
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder={t('inventory.stockMovementsPage.searchPlaceholder')}
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
            allowClear
          />
          <Select
            placeholder={t('inventory.stockMovementsPage.filterType')}
            value={typeFilter || undefined}
            onChange={(v) => setTypeFilter(v || '')}
            allowClear
            className="w-40"
            options={[
              { value: 'in', label: t('inventory.stockMovementsPage.stockIn') },
              { value: 'out', label: t('inventory.stockMovementsPage.stockOut') },
              { value: 'transfer', label: t('inventory.stockMovementsPage.transfer') },
              { value: 'adjustment', label: t('inventory.stockMovementsPage.adjustment') },
              { value: 'return', label: t('inventory.stockMovementsPage.return') },
            ]}
          />
        </div>
        <DataTable
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (total: number) => t('inventory.stockMovementsPage.showingMovements', { count: total }) }}
        />
      </Card>
    </div>
  );
};

export default StockMovements;
