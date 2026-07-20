import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Typography, message } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  orderDate: string;
  expectedDate: string;
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'received' | 'closed' | 'cancelled';
  items: number;
}

const mockPOs: PurchaseOrder[] = [
  { id: '1', orderNumber: 'PO-2024-0156', supplier: 'TechSupply Inc.', orderDate: '2024-12-15', expectedDate: '2024-12-22', totalAmount: 45000, status: 'pending', items: 5 },
  { id: '2', orderNumber: 'PO-2024-0155', supplier: 'OfficeWorld Ltd.', orderDate: '2024-12-14', expectedDate: '2024-12-20', totalAmount: 12500, status: 'approved', items: 3 },
  { id: '3', orderNumber: 'PO-2024-0154', supplier: 'TechSupply Inc.', orderDate: '2024-12-12', expectedDate: '2024-12-19', totalAmount: 28000, status: 'received', items: 8 },
  { id: '4', orderNumber: 'PO-2024-0153', supplier: 'Global Parts Co.', orderDate: '2024-12-10', expectedDate: '2024-12-17', totalAmount: 8900, status: 'closed', items: 2 },
  { id: '5', orderNumber: 'PO-2024-0152', supplier: 'LogiSupply GmbH', orderDate: '2024-12-08', expectedDate: '2024-12-25', totalAmount: 32000, status: 'draft', items: 6 },
  { id: '6', orderNumber: 'PO-2024-0151', supplier: 'OfficeWorld Ltd.', orderDate: '2024-12-05', expectedDate: '2024-12-15', totalAmount: 5600, status: 'cancelled', items: 1 },
];

const statusColors: Record<string, string> = { draft: 'default', pending: 'orange', approved: 'blue', received: 'green', closed: 'purple', cancelled: 'red' };

const PurchaseOrderList: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filtered = statusFilter ? mockPOs.filter((po) => po.status === statusFilter) : mockPOs;

  const columns = [
    { title: 'PO Number', dataIndex: 'orderNumber', key: 'orderNumber', render: (v: string) => <a onClick={() => navigate('/procurement/purchase-orders/' + v)}>{v}</a> },
    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier', sorter: (a: PurchaseOrder, b: PurchaseOrder) => a.supplier.localeCompare(b.supplier) },
    { title: 'Order Date', dataIndex: 'orderDate', key: 'orderDate' },
    { title: 'Expected', dataIndex: 'expectedDate', key: 'expectedDate' },
    { title: 'Items', dataIndex: 'items', key: 'items' },
    { title: 'Total', dataIndex: 'totalAmount', key: 'totalAmount', render: (v: number) => '$' + v.toLocaleString(), sorter: (a: PurchaseOrder, b: PurchaseOrder) => a.totalAmount - b.totalAmount },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag> },
    { title: 'Actions', key: 'actions', render: (_: unknown, record: PurchaseOrder) => (
      <Space>
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate('/procurement/purchase-orders/' + record.orderNumber)} />
        {record.status === 'draft' && <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate('/procurement/purchase-orders/' + record.orderNumber + '/edit')} />}
      </Space>
    )},
  ];

  return (
    <div className="p-6">
      <PageHeader title="Purchase Orders" subtitle="Manage procurement orders">
        <Space>
          <Select placeholder="Filter by status" value={statusFilter || undefined} onChange={(v) => setStatusFilter(v || '')} allowClear className="w-40"
            options={[{ value: 'draft', label: 'Draft' }, { value: 'pending', label: 'Pending' }, { value: 'approved', label: 'Approved' }, { value: 'received', label: 'Received' }, { value: 'closed', label: 'Closed' }, { value: 'cancelled', label: 'Cancelled' }]} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/procurement/purchase-orders/new')}>Create PO</Button>
        </Space>
      </PageHeader>
      <Card>
        <DataTable dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (t: number) => t + ' purchase orders' }} />
      </Card>
    </div>
  );
};

export default PurchaseOrderList;
