import { Row, Col, Card, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { LineChart } from '@/components/charts/LineChart';
import { AreaChart } from '@/components/charts/AreaChart';
import { GaugeChart } from '@/components/charts/GaugeChart';

const { Title } = Typography;

export default function AnalyticsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <Title level={4}>{t('dashboard.analytics.title')}</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title={t('dashboard.analytics.userGrowth')}>
            <AreaChart
              data={[
                { name: 'Jan', value: 120 },
                { name: 'Feb', value: 180 },
                { name: 'Mar', value: 250 },
                { name: 'Apr', value: 320 },
                { name: 'May', value: 410 },
                { name: 'Jun', value: 500 },
              ]}
              height={300}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t('dashboard.analytics.systemPerformance')}>
            <GaugeChart value={87} title={t('dashboard.analytics.uptime')} height={300} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
