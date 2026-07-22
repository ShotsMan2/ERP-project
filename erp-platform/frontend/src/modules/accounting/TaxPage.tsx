import { Card, Table, Tag } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

const data = [
  { key: '1', code: 'VAT-01', name: 'Standard VAT', rate: 20.0, type: 'Output', effectiveFrom: '2026-01-01', effectiveTo: null },
  { key: '2', code: 'VAT-02', name: 'Reduced VAT', rate: 8.0, type: 'Output', effectiveFrom: '2026-01-01', effectiveTo: null },
  { key: '3', code: 'VAT-03', name: 'Zero VAT', rate: 0.0, type: 'Output', effectiveFrom: '2026-01-01', effectiveTo: null },
  { key: '4', code: 'WHT-01', name: 'Withholding Tax', rate: 10.0, type: 'Withholding', effectiveFrom: '2026-01-01', effectiveTo: null },
];

export default function TaxPage() {
  const { t } = useTranslation();

  const columns = [
    { title: t('accounting.taxManagement.code'), dataIndex: 'code', key: 'code' },
    { title: t('accounting.taxManagement.name'), dataIndex: 'name', key: 'name' },
    { title: t('accounting.taxManagement.rate'), dataIndex: 'rate', key: 'rate', render: (v: number) => v + '%' },
    { title: t('accounting.taxManagement.type'), dataIndex: 'type', key: 'type', render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: t('accounting.taxManagement.effectiveFrom'), dataIndex: 'effectiveFrom', key: 'effectiveFrom' },
    { title: t('accounting.taxManagement.effectiveTo'), dataIndex: 'effectiveTo', key: 'effectiveTo', render: (v: any) => v || t('accounting.taxManagement.ongoing') },
  ];

  return (
    <div>
      <PageHeader title={t('accounting.taxManagement.title')} subtitle={t('accounting.taxManagement.subtitle')} onAdd={() => {}} addLabel={t('accounting.taxManagement.addTaxRate')} />
      <Card><Table columns={columns} dataSource={data} /></Card>
    </div>
  );
}
