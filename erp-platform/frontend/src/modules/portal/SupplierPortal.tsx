import { Card, List, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const rfqs = [
  { key: '1', number: 'RFQ-2026-001', title: 'Office Equipment', closingDate: '2026-07-25', status: 'open' },
  { key: '2', number: 'RFQ-2026-002', title: 'IT Hardware', closingDate: '2026-07-30', status: 'open' },
];

const pos = [
  { key: '1', number: 'PO-2026-001', total: ',500.00', date: '2026-07-15', status: 'approved' },
  { key: '2', number: 'PO-2026-002', total: ',400.50', date: '2026-07-16', status: 'pending' },
];

export default function SupplierPortal() {
  return (
    <div>
      <PageHeader title="Supplier Portal" subtitle="Manage your RFQs and purchase orders" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="New RFQs">
          <List
            dataSource={rfqs}
            renderItem={(item) => (
              <List.Item extra={<Tag color="blue">{item.status}</Tag>}>
                <List.Item.Meta title={item.title} description={item.number + ' - Closing: ' + item.closingDate} />
              </List.Item>
            )}
          />
        </Card>
        <Card title="Purchase Orders">
          <List
            dataSource={pos}
            renderItem={(item) => (
              <List.Item extra={<Tag color={item.status === 'approved' ? 'green' : 'orange'}>{item.status}</Tag>}>
                <List.Item.Meta title={item.number} description={item.total + ' - ' + item.date} />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
}
