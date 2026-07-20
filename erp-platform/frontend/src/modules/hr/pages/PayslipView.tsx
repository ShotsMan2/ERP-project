import { Card, Descriptions, Table, Divider, Typography, Row, Col, Button, Space, Tag } from 'antd';
import { PrinterOutlined, DownloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';

const { Text, Title } = Typography;

interface EarningsLine {
  description: string;
  amount: number;
  type: 'earnings' | 'deductions';
}

const earnings: EarningsLine[] = [
  { description: 'Basic Salary', amount: 5500, type: 'earnings' },
  { description: 'Housing Allowance', amount: 1200, type: 'earnings' },
  { description: 'Transport Allowance', amount: 500, type: 'earnings' },
  { description: 'Meal Allowance', amount: 300, type: 'earnings' },
  { description: 'Performance Bonus', amount: 1000, type: 'earnings' },
  { description: 'Overtime Pay', amount: 450, type: 'earnings' },
];

const deductions: EarningsLine[] = [
  { description: 'Income Tax', amount: 1850, type: 'deductions' },
  { description: 'Social Security', amount: 450, type: 'deductions' },
  { description: 'Health Insurance', amount: 300, type: 'deductions' },
  { description: 'Pension Contribution', amount: 550, type: 'deductions' },
  { description: 'Union Dues', amount: 50, type: 'deductions' },
];

const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
const netPay = totalEarnings - totalDeductions;

const PayslipView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const totalColumns = [
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v: number) => `$${v.toLocaleString()}` },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Payslip"
        subtitle={`Payroll Period: December 2024`}
        onBack={() => navigate('/hr/payroll')}
      >
        <Space>
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>Print</Button>
          <Button type="primary" icon={<DownloadOutlined />}>Download PDF</Button>
        </Space>
      </PageHeader>

      <Card id="payslip-content">
        <div className="text-center mb-6">
          <Title level={4}>Company Name Inc.</Title>
          <Text type="secondary">123 Business Ave, Suite 100, New York, NY 10001</Text>
          <br />
          <Text type="secondary">Tax ID: 12-3456789</Text>
          <Divider />
          <Title level={5}>PAYSLIP — December 2024</Title>
        </div>

        <Row gutter={[48, 16]}>
          <Col span={12}>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Employee">John Smith</Descriptions.Item>
              <Descriptions.Item label="Employee Code">EMP001</Descriptions.Item>
              <Descriptions.Item label="Department">Engineering</Descriptions.Item>
              <Descriptions.Item label="Designation">Senior Developer</Descriptions.Item>
              <Descriptions.Item label="Bank Account">****4521 (Chase)</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Pay Period">December 1 - December 31, 2024</Descriptions.Item>
              <Descriptions.Item label="Pay Date">January 5, 2025</Descriptions.Item>
              <Descriptions.Item label="Working Days">22</Descriptions.Item>
              <Descriptions.Item label="Pay Type">Monthly</Descriptions.Item>
              <Descriptions.Item label="Status"><Tag color="green">PAID</Tag></Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[48, 16]}>
          <Col span={12}>
            <Title level={5}>Earnings</Title>
            <Table
              dataSource={earnings}
              columns={totalColumns}
              pagination={false}
              size="small"
              rowKey="description"
              summary={() => (
                  <Table.Summary.Row>
                  <Table.Summary.Cell index={0}><Text strong>Total Earnings</Text></Table.Summary.Cell>
                  <Table.Summary.Cell index={1}><Text strong>${totalEarnings.toLocaleString()}</Text></Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </Col>
          <Col span={12}>
            <Title level={5}>Deductions</Title>
            <Table
              dataSource={deductions}
              columns={totalColumns}
              pagination={false}
              size="small"
              rowKey="description"
              summary={() => (
                  <Table.Summary.Row>
                  <Table.Summary.Cell index={0}><Text strong>Total Deductions</Text></Table.Summary.Cell>
                  <Table.Summary.Cell index={1}><Text strong>${totalDeductions.toLocaleString()}</Text></Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </Col>
        </Row>

        <Divider />

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
          <div>
            <Text type="secondary">Total Gross</Text>
            <div className="text-xl font-bold">${totalEarnings.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <Text type="secondary">Total Deductions</Text>
            <div className="text-xl font-bold">-${totalDeductions.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <Text type="secondary">Net Pay</Text>
            <div className="text-2xl font-bold text-green-600">${netPay.toLocaleString()}</div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Text type="secondary" className="text-xs">
            This is a computer-generated document and does not require a signature.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default PayslipView;
