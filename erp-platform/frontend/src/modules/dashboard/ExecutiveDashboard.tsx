import { Row, Col, Card, Typography } from 'antd';
import { TeamOutlined, ShoppingCartOutlined, DollarOutlined, RiseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { StatCard } from '@/components/ui/StatCard';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';

const { Title } = Typography;

export default function ExecutiveDashboard() {
  const { t } = useTranslation();

  const monthlyRevenue = [
    { name: 'Jan', value: 45000 },
    { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 61000 },
    { name: 'May', value: 55000 },
    { name: 'Jun', value: 67000 },
    { name: 'Jul', value: 72000 },
    { name: 'Aug', value: 68000 },
    { name: 'Sep', value: 75000 },
    { name: 'Oct', value: 82000 },
    { name: 'Nov', value: 78000 },
    { name: 'Dec', value: 91000 },
  ];

  const salesByCategory = [
    { name: 'Electronics', value: 35 },
    { name: 'Office Supplies', value: 25 },
    { name: 'Furniture', value: 20 },
    { name: 'Software', value: 15 },
    { name: 'Services', value: 5 },
  ];

  return (
    <div>
      <Title level={4}>{t('dashboard.executive.title')}</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard icon={<DollarOutlined />} title={t('dashboard.executive.totalRevenue')} value="$ 524,800" trend={12.5} trendLabel={t('dashboard.executive.vsLastYear')} color="#1677ff" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard icon={<ShoppingCartOutlined />} title={t('dashboard.executive.totalOrders')} value="1,284" trend={8.3} trendLabel={t('dashboard.executive.vsLastYear')} color="#52c41a" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard icon={<TeamOutlined />} title={t('dashboard.executive.activeCustomers')} value="892" trend={15.2} trendLabel={t('dashboard.executive.vsLastYear')} color="#722ed1" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard icon={<RiseOutlined />} title={t('dashboard.executive.growthRate')} value="23.5%" trend={2.1} trendLabel={t('dashboard.executive.vsLastQuarter')} color="#13c2c2" />
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} lg={16}>
          <Card title={t('dashboard.monthlyRevenue')}>
            <BarChart data={monthlyRevenue} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t('dashboard.salesByCategory')}>
            <PieChart data={salesByCategory} height={300} donut />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card title={t('dashboard.executive.revenueTrend')}>
            <LineChart data={monthlyRevenue} height={300} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
