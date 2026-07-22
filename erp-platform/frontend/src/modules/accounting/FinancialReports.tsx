import { Row, Col, Card, Table, Typography } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { BarChart } from '@/components/charts/BarChart';
import { DollarOutlined, RiseOutlined, FallOutlined, BankOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const incomeData = [
  { key: '1', category: 'Revenue', amount: 850000 },
  { key: '2', category: 'COGS', amount: -420000 },
  { key: '3', category: 'Gross Profit', amount: 430000 },
  { key: '4', category: 'Operating Exp', amount: -250000 },
  { key: '5', category: 'Net Income', amount: 180000 },
];

export default function FinancialReports() {
  const { t } = useTranslation();

  const columns = [
    { title: t('accounting.financialReports.category'), dataIndex: 'category', key: 'category' },
    { title: t('accounting.financialReports.amount'), dataIndex: 'amount', key: 'amount', render: (v: number) => '$' + v.toLocaleString() },
  ];

  return (
    <div>
      <Title level={4}>{t('accounting.financialReports.title')}</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard icon={<DollarOutlined />} title={t('accounting.financialReports.totalRevenue')} value=",000" trend={15.3} color="#1677ff" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard icon={<RiseOutlined />} title={t('accounting.financialReports.netIncome')} value=",000" trend={8.7} color="#52c41a" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard icon={<FallOutlined />} title={t('accounting.financialReports.totalExpenses')} value=",000" trend={-3.2} color="#ff4d4f" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard icon={<BankOutlined />} title={t('accounting.financialReports.grossMargin')} value="50.6%" trend={2.1} color="#722ed1" />
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} lg={12}>
          <Card title={t('accounting.financialReports.incomeStatement')}>
            <Table columns={columns} dataSource={incomeData} pagination={false} showHeader={false} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={t('accounting.financialReports.revenueVsExpenses')}>
            <BarChart data={[
              { name: 'Jan', value: 95000 }, { name: 'Feb', value: 88000 },
              { name: 'Mar', value: 102000 }, { name: 'Apr', value: 115000 },
            ]} height={300} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
