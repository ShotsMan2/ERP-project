import { Tag, Space } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/data/DataTable';

const data = [
  { id: '1', name: 'ABC Corporation', code: 'CUST-001', email: 'info@abccorp.com', phone: '+1-555-1001', segment: 'Enterprise', status: 'active' },
  { id: '2', name: 'XYZ Industries', code: 'CUST-002', email: 'contact@xyzind.com', phone: '+1-555-1002', segment: 'SMB', status: 'active' },
  { id: '3', name: 'GlobalTech Ltd', code: 'CUST-003', email: 'sales@globaltech.com', phone: '+1-555-1003', segment: 'Enterprise', status: 'inactive' },
  { id: '4', name: 'LocalShop Inc', code: 'CUST-004', email: 'info@localshop.com', phone: '+1-555-1004', segment: 'Retail', status: 'active' },
];

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a: any, b: any) => a.name.localeCompare(b.name) },
  { title: 'Code', dataIndex: 'code', key: 'code' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  { title: 'Segment', dataIndex: 'segment', key: 'segment', render: (s: string) => <Tag color="blue">{s}</Tag> },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag> },
];

export default function CustomerList() {
  return (
    <div>
      <PageHeader title="Customers" subtitle="Manage customer relationships" onAdd={() => {}} addLabel="Add Customer" />
      <DataTable columns={columns} dataSource={data} rowKey="id" searchable selectable />
    </div>
  );
}
