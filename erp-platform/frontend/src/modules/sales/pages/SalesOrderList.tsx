import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Typography, message } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';

interface SalesOrder { id: string; orderNumber: string; customer: string; orderDate: string; deliveryDate: string; total: number; status: string; items: number; }
const mockSOs: SalesOrder[] = [
  { id: '1', orderNumber: 'SO-2024-0234', customer: 'Acme Corp', orderDate: '2024-12-15', deliveryDate: '2024-12-20', total: 28999.90, status: 'pending', items: 3 },
  { id: '2', orderNumber: 'SO-2024-0233', customer: 'GlobalTech Inc.', orderDate: '2024-12-14', deliveryDate: '2024-12-19', total: 12500.00, status: 'approved', items: 2 },
  { id: '3', orderNumber: 'SO-2024-0232', customer: 'Beta Solutions', orderDate: '2024-12-12', deliveryDate: '2024-12-18', total: 8999.85, status: 'shipped', items: 1 },
  { id: '4', orderNumber: 'SO-2024-0231', customer: 'Acme Corp', orderDate: '2024-12-10', deliveryDate: '2024-12-15', total: 45000.00, status: 'delivered', items: 5 },
  { id: '5', orderNumber: 'SO-2024-0230', customer: 'Delta Industries', orderDate: '2024-12-08', deliveryDate: '2024-12-14', total: 5600.00, status: 'invoiced', items: 1 },
  { id: '6', orderNumber: 'SO-2024-0229', customer: 'Acme Corp', orderDate: '2024-12-05', deliveryDate: '2024-12-12', total: 7500.00, status: 'draft', items: 2 },
];

const statusColors: Record<string, string> = { draft: 'default', pending: 'orange', approved: 'blue', shipped: 'cyan', delivered: 'green', invoiced: 'purple', cancelled: 'red' };

const SalesOrderList: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const filtered = statusFilter ? mockSOs.filter((so) => so.status === statusFilter) : mockSOs;

  const columns = [
    { title: 'Order #', dataIndex: 'orderNumber', key: 'orderNumber', render: (v: string) => <a onClick={() => navigate('/sales/orders/' + v)}>{v}</a> },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', sorter: (a: SalesOrder, b: SalesOrder) => a.customer.localeCompare(b.customer) },
    { title: 'Order Date', dataIndex: 'orderDate', key: 'orderDate' },
    { title: 'Delivery Date', dataIndex: 'deliveryDate', key: 'deliveryDate' },
    { title: 'Items', dataIndex: 'items', key: 'items' },
    { title: 'Total', dataIndex: 'total', key: 'total', render: (v: number) => '$' + v.toLocaleString(), sorter: (a: SalesOrder, b: SalesOrder) => a.total - b.total },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag> },
    { title: 'Actions', key: 'actions', render: (_: unknown, r: SalesOrder) => (
      <Space><Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate('/sales/orders/' + r.orderNumber)} /><Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate('/sales/orders/' + r.orderNumber + '/edit')} /></Space>
    )},
  ];

  return (
    <div className="p-6">
      <PageHeader title="Sales Orders" subtitle="Manage customer orders">
        <Space>
          <Select placeholder="Filter by status" value={statusFilter || undefined} onChange={(v) => setStatusFilter(v || '')} allowClear className="w-40"
            options={[{ value: 'draft', label: 'Draft' }, { value: 'pending', label: 'Pending' }, { value: 'approved', label: 'Approved' }, { value: 'shipped', label: 'Shipped' }, { value: 'delivered', label: 'Delivered' }, { value: 'invoiced', label: 'Invoiced' }]} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/sales/orders/new')}>Create Order</Button>
        </Space>
      </PageHeader>
      <Card>
        <DataTable dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (t: number) => t + ' orders' }} />
      </Card>
    </div>
  );
};

export default SalesOrderList;
