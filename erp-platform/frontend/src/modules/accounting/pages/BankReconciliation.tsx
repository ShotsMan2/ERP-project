import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Typography, message, DatePicker, Row, Col, Statistic } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

interface BankTxn { id: string; date: string; description: string; debit: number; credit: number; balance: number; status: string; matchRef?: string; }
const bankTxns: BankTxn[] = [
  { id: 'bt1', date: '2024-12-15', description: 'Wire transfer - Acme Corp', debit: 28999.90, credit: 0, balance: 528999.90, status: 'unmatched' },
  { id: 'bt2', date: '2024-12-14', description: 'Office rent payment', debit: 0, credit: 15000, balance: 500000, status: 'unmatched' },
  { id: 'bt3', date: '2024-12-13', description: 'Supplier payment - TechSupply', debit: 0, credit: 45000, balance: 515000, status: 'unmatched' },
  { id: 'bt4', date: '2024-12-12', description: 'Payroll transfer', debit: 0, credit: 485000, balance: 560000, status: 'matched' },
  { id: 'bt5', date: '2024-12-11', description: 'Customer payment - GlobalTech', debit: 12500, credit: 0, balance: 1045000, status: 'matched' },
];

const systemTxns = [
  { id: 'st1', date: '2024-12-15', description: 'INV-2024-0892 - Acme Corp', type: 'invoice', amount: 28999.90, status: 'unpaid' },
  { id: 'st2', date: '2024-12-14', description: 'Rent expense December', type: 'expense', amount: 15000, status: 'unpaid' },
  { id: 'st3', date: '2024-12-13', description: 'PO-2024-0156 - TechSupply Inc.', type: 'po', amount: 45000, status: 'unpaid' },
];

const BankReconciliation: React.FC = () => {
  const { t } = useTranslation();
  const [selectedR, setSelectedR] = useState<string>('');

  const handleMatch = (bankId: string, sysId: string) => {
    message.success(t('accounting.bankReconciliation.transactionMatchedSuccessfully'));
  };

  const bankColumns = [
    { title: t('accounting.bankReconciliation.date'), dataIndex: 'date' }, { title: t('accounting.bankReconciliation.description'), dataIndex: 'description' },
    { title: t('accounting.bankReconciliation.debit'), dataIndex: 'debit', render: (v: number) => v ? '$' + v.toLocaleString() : '-' },
    { title: t('accounting.bankReconciliation.credit'), dataIndex: 'credit', render: (v: number) => v ? '$' + v.toLocaleString() : '-' },
    { title: t('accounting.bankReconciliation.status'), dataIndex: 'status', render: (s: string) => <Tag color={s === 'matched' ? 'green' : 'orange'}>{t('accounting.bankReconciliation.' + s)}</Tag> },
    { title: t('accounting.bankReconciliation.action'), render: (_: unknown, r: BankTxn) => r.status === 'unmatched' && <Button type="link" size="small" icon={<CheckOutlined />} style={{ color: '#52c41a' }}>{t('accounting.bankReconciliation.match')}</Button> },
  ];

  return (
    <div className="p-6">
      <PageHeader title={t('accounting.bankReconciliation.title')} subtitle={t('accounting.bankReconciliation.subtitle')}>
        <Space>
          <Select defaultValue="checking" style={{ width: 180 }} options={[{ value: 'checking', label: 'Checking Account (****4521)' }, { value: 'savings', label: 'Savings Account (****7890)' }]} />
          <Button type="primary" onClick={() => message.success(t('accounting.bankReconciliation.completeReconciliation'))}>{t('accounting.bankReconciliation.completeReconciliation')}</Button>
        </Space>
      </PageHeader>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}><Card><Statistic title={t('accounting.bankReconciliation.bankBalance')} value={528999.90} prefix="$" precision={2} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title={t('accounting.bankReconciliation.systemBalance')} value={515000.00} prefix="$" precision={2} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title={t('accounting.bankReconciliation.difference')} value={13999.90} prefix="$" precision={2} valueStyle={{ color: '#faad14' }} /></Card></Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}><Card title={t('accounting.bankReconciliation.bankStatementTransactions')}><Table dataSource={bankTxns} columns={bankColumns} rowKey="id" pagination={false} size="small" /></Card></Col>
        <Col span={12}><Card title={t('accounting.bankReconciliation.systemTransactions')}><Table dataSource={systemTxns} rowKey="id" pagination={false} size="small"
          columns={[{ title: t('accounting.bankReconciliation.date'), dataIndex: 'date' }, { title: t('accounting.bankReconciliation.description'), dataIndex: 'description' }, { title: t('accounting.bankReconciliation.type'), dataIndex: 'type', render: (t: string) => <Tag>{t}</Tag> }, { title: t('accounting.bankReconciliation.amount'), dataIndex: 'amount', render: (v: number) => '$' + v.toLocaleString() }, { title: t('accounting.bankReconciliation.status'), dataIndex: 'status', render: (s: string) => <Tag color="orange">{s}</Tag> }]} /></Card></Col>
      </Row>
    </div>
  );
};
export default BankReconciliation;
