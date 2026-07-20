import { useState } from 'react';
import { Card, Table, Tag, Input, Select, Typography, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

interface StockItem {
  id: string;
  product: string;
  sku: string;
  warehouse: string;
  bin: string;
  quantity: number;
  reserved: number;
  available: number;
  unit: string;
  lastCounted: string;
}

const mockStock: StockItem[] = [
  { id: '1', product: 'Business Laptop Pro 15"', sku: 'LAP-001', warehouse: 'Main Warehouse', bin: 'A-01-01', quantity: 20, reserved: 3, available: 17, unit: 'pcs', lastCounted: '2024-12-15' },
  { id: '2', product: 'Business Laptop Pro 15"', sku: 'LAP-001', warehouse: 'East Warehouse', bin: 'B-01-01', quantity: 10, reserved: 2, available: 8, unit: 'pcs', lastCounted: '2024-12-14' },
  { id: '3', product: '27" 4K Monitor', sku: 'MON-002', warehouse: 'Main Warehouse', bin: 'A-02-01', quantity: 80, reserved: 10, available: 70, unit: 'pcs', lastCounted: '2024-12-10' },
  { id: '4', product: 'Mechanical Keyboard', sku: 'KEY-003', warehouse: 'Main Warehouse', bin: 'A-03-01', quantity: 150, reserved: 20, available: 130, unit: 'pcs', lastCounted: '2024-12-08' },
  { id: '5', product: 'Standing Desk Frame', sku: 'DES-005', warehouse: 'Main Warehouse', bin: 'C-01-01', quantity: 5, reserved: 3, available: 2, unit: 'pcs', lastCounted: '2024-12-12' },
  { id: '6', product: 'Ergonomic Office Chair', sku: 'CHA-006', warehouse: 'Main Warehouse', bin: 'C-02-01', quantity: 2, reserved: 1, available: 1, unit: 'pcs', lastCounted: '2024-12-11' },
  { id: '7', product: 'Wireless Mouse', sku: 'MOU-004', warehouse: 'East Warehouse', bin: 'B-02-01', quantity: 200, reserved: 10, available: 190, unit: 'pcs', lastCounted: '2024-12-13' },
];

const getStockStatus = (available: number): { color: string; label: string } => {
  if (available <= 0) return { color: 'red', label: 'Out of Stock' };
  if (available <= 5) return { color: 'orange', label: 'Critical' };
  if (available <= 20) return { color: 'gold', label: 'Low Stock' };
  if (available <= 50) return { color: 'blue', label: 'Moderate' };
  return { color: 'green', label: 'In Stock' };
};

const StockLevels: React.FC = () => {
  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('');

  const warehouses = [...new Set(mockStock.map((s) => s.warehouse))];
  const filtered = mockStock.filter((s) => {
    const matchesSearch = !search || s.product.toLowerCase().includes(search.toLowerCase()) || s.sku.toLowerCase().includes(search.toLowerCase());
    const matchesWH = !warehouseFilter || s.warehouse === warehouseFilter;
    return matchesSearch && matchesWH;
  });

  const columns = [
    { title: 'Product', dataIndex: 'product', key: 'product', sorter: (a: StockItem, b: StockItem) => a.product.localeCompare(b.product) },
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    { title: 'Warehouse', dataIndex: 'warehouse', key: 'warehouse' },
    { title: 'Bin Location', dataIndex: 'bin', key: 'bin' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', sorter: (a: StockItem, b: StockItem) => a.quantity - b.quantity },
    { title: 'Reserved', dataIndex: 'reserved', key: 'reserved' },
    {
      title: 'Available', dataIndex: 'available', key: 'available',
      render: (v: number, record: StockItem) => {
        const status = getStockStatus(v);
        return (
          <Space>
            <span className={status.color === 'red' || status.color === 'orange' ? 'font-bold' : ''}>{v}</span>
            <Tag color={status.color} style={{ fontSize: 10 }}>{status.label}</Tag>
          </Space>
        );
      },
      sorter: (a: StockItem, b: StockItem) => a.available - b.available,
    },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Stock Levels" subtitle="Real-time inventory across all warehouses" />

      <Card>
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Search product or SKU..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
            allowClear
          />
          <Select
            placeholder="Filter by warehouse"
            value={warehouseFilter || undefined}
            onChange={(v) => setWarehouseFilter(v || '')}
            allowClear
            className="w-48"
            options={warehouses.map((w) => ({ value: w, label: w }))}
          />
        </div>
        <DataTable
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (t: number) => `${t} stock items` }}
        />
      </Card>
    </div>
  );
};

export default StockLevels;
