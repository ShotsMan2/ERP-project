import { Row, Col, Card, Typography } from 'antd';
import { LineChart } from '@/components/charts/LineChart';
import { AreaChart } from '@/components/charts/AreaChart';
import { GaugeChart } from '@/components/charts/GaugeChart';

const { Title } = Typography;

export default function AnalyticsPage() {
  return (
    <div>
      <Title level={4}>Analytics</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="User Growth">
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
          <Card title="System Performance">
            <GaugeChart value={87} title="Uptime" height={300} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
