import { Tag, Rate } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/data/DataTable';

const data = [
  { id: '1', name: 'Tech Supplies Inc.', code: 'SUP-001', email: 'info@techsupplies.com', phone: '+1-555-0101', rating: 4.5, status: 'active' },
  { id: '2', name: 'Office Mart Ltd.', code: 'SUP-002', email: 'sales@officemart.com', phone: '+1-555-0102', rating: 3.8, status: 'active' },
  { id: '3', name: 'Global Parts Co.', code: 'SUP-003', email: 'contact@globalparts.com', phone: '+1-555-0103', rating: 4.2, status: 'active' },
];

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Code', dataIndex: 'code', key: 'code' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  { title: 'Rating', dataIndex: 'rating', key: 'rating', render: (r: number) => <Rate disabled value={r} allowHalf /> },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color="green">{s}</Tag> },
];

export default function SupplierList() {
  return (
    <div>
      <PageHeader title="Suppliers" subtitle="Manage suppliers" onAdd={() => {}} addLabel="Add Supplier" />
      <DataTable columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
}
