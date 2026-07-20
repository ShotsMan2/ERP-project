import { useState } from 'react';
import { Card, Table, Tag, Row, Col, Statistic, Select, Typography, Space, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

const taxData = [
  { taxCode: 'VAT20', description: 'Standard Rate 20%', taxableAmount: 1250000, taxAmount: 250000, sales: 180000, purchases: 70000, netDue: 110000 },
  { taxCode: 'VAT8', description: 'Reduced Rate 8%', taxableAmount: 350000, taxAmount: 28000, sales: 20000, purchases: 8000, netDue: 12000 },
  { taxCode: 'EXEMPT', description: 'Zero Rated', taxableAmount: 450000, taxAmount: 0, sales: 0, purchases: 0, netDue: 0 },
  { taxCode: 'WITHHOLDING', description: 'Withholding Tax 10%', taxableAmount: 280000, taxAmount: 28000, sales: 0, purchases: 28000, netDue: -28000 },
];

const TaxReport: React.FC = () => {
  const [period, setPeriod] = useState('2024-Q4');
  const totals = {
    sales: taxData.reduce((s, r) => s + r.sales, 0),
    purchases: taxData.reduce((s, r) => s + r.purchases, 0),
    netDue: taxData.reduce((s, r) => s + r.netDue, 0),
  };

  const pieOption = {
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie', radius: ['40%', '70%'],
      data: taxData.map((t) => ({ value: t.taxAmount, name: t.taxCode })),
    }],
  };

  return (
    <div className="p-6">
      <PageHeader title="Tax Report" subtitle="VAT and tax liability summary">
        <Space>
          <Select value={period} onChange={setPeriod} style={{ width: 140 }} options={[{ value: '2024-Q4', label: 'Q4 2024' }, { value: '2024-Q3', label: 'Q3 2024' }, { value: '2024-Q2', label: 'Q2 2024' }]} />
          <Button icon={<DownloadOutlined />} onClick={() => message.success('Report exported')}>Export</Button>
        </Space>
      </PageHeader>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}><Card><Statistic title="Total Sales Tax" value={totals.sales} prefix="$" precision={0} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Total Purchase Tax" value={totals.purchases} prefix="$" precision={0} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Net Tax Due" value={totals.netDue} prefix="$" precision={0} valueStyle={{ color: totals.netDue > 0 ? '#ff4d4f' : '#52c41a' }} /></Card></Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Tax Breakdown">
            <Table dataSource={taxData} rowKey="taxCode" pagination={false} size="small"
              columns={[
                { title: 'Tax Code', dataIndex: 'taxCode' }, { title: 'Description', dataIndex: 'description' },
                { title: 'Taxable Amount', dataIndex: 'taxableAmount', render: (v: number) => '$' + v.toLocaleString() },
                { title: 'Tax Amount', dataIndex: 'taxAmount', render: (v: number) => '$' + v.toLocaleString() },
                { title: 'Sales Tax', dataIndex: 'sales', render: (v: number) => '$' + v.toLocaleString() },
                { title: 'Purchase Tax', dataIndex: 'purchases', render: (v: number) => '$' + v.toLocaleString() },
                { title: 'Net Due', dataIndex: 'netDue', render: (v: number) => <Tag color={v > 0 ? 'red' : 'green'}>${v.toLocaleString()}</Tag> },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Tax Distribution">
            <ReactECharts option={pieOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default TaxReport;
