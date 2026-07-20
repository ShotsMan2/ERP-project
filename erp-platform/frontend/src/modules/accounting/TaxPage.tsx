import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const data = [
  { key: '1', code: 'VAT-01', name: 'Standard VAT', rate: 20.0, type: 'Output', effectiveFrom: '2026-01-01', effectiveTo: null },
  { key: '2', code: 'VAT-02', name: 'Reduced VAT', rate: 8.0, type: 'Output', effectiveFrom: '2026-01-01', effectiveTo: null },
  { key: '3', code: 'VAT-03', name: 'Zero VAT', rate: 0.0, type: 'Output', effectiveFrom: '2026-01-01', effectiveTo: null },
  { key: '4', code: 'WHT-01', name: 'Withholding Tax', rate: 10.0, type: 'Withholding', effectiveFrom: '2026-01-01', effectiveTo: null },
];

const columns = [
  { title: 'Code', dataIndex: 'code', key: 'code' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Rate', dataIndex: 'rate', key: 'rate', render: (v: number) => v + '%' },
  { title: 'Type', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color="blue">{t}</Tag> },
  { title: 'Effective From', dataIndex: 'effectiveFrom', key: 'effectiveFrom' },
  { title: 'Effective To', dataIndex: 'effectiveTo', key: 'effectiveTo', render: (v: any) => v || 'Ongoing' },
];

export default function TaxPage() {
  return (
    <div>
      <PageHeader title="Tax Management" subtitle="Configure tax rates and reports" onAdd={() => {}} addLabel="Add Tax Rate" />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
