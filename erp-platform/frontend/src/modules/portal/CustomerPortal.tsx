import { Card, Typography, List, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const { Text } = Typography;

const orders = [
  { key: '1', number: 'SO-2026-001', date: '2026-07-18', total: ',900.00', status: 'shipped' },
  { key: '2', number: 'SO-2026-002', date: '2026-07-19', total: ',500.00', status: 'confirmed' },
];

const invoices = [
  { key: '1', number: 'INV-2026-001', date: '2026-07-01', dueDate: '2026-07-31', total: ',900.00', status: 'unpaid' },
  { key: '2', number: 'INV-2026-002', date: '2026-07-05', dueDate: '2026-08-04', total: ',500.00', status: 'paid' },
];

export default function CustomerPortal() {
  return (
    <div>
      <PageHeader title="My Dashboard" subtitle="Welcome to the Customer Portal" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="My Orders">
          <List
            dataSource={orders}
            renderItem={(item) => (
              <List.Item extra={<Tag color={item.status === 'shipped' ? 'blue' : 'green'}>{item.status}</Tag>}>
                <List.Item.Meta title={item.number} description={item.date + ' - ' + item.total} />
              </List.Item>
            )}
          />
        </Card>
        <Card title="My Invoices">
          <List
            dataSource={invoices}
            renderItem={(item) => (
              <List.Item extra={<Tag color={item.status === 'paid' ? 'green' : 'orange'}>{item.status}</Tag>}>
                <List.Item.Meta title={item.number} description={'Due: ' + item.dueDate + ' - ' + item.total} />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
}
