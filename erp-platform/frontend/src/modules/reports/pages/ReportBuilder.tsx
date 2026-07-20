import { useState } from 'react';
import { Card, Form, Select, Input, InputNumber, Button, Row, Col, Typography, Switch, Tree, message, DatePicker, Tag, Space } from 'antd';
import { SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import PageHeader from '@/components/ui/PageHeader';
const { TextArea } = Input;
const { Text } = Typography;

const fieldCategories = [
  { title: 'Sales', key: 'Sales', children: [
    { title: 'Order Number', key: 'orderNumber' }, { title: 'Customer Name', key: 'customerName' },
    { title: 'Order Date', key: 'orderDate' }, { title: 'Total Amount', key: 'totalAmount' },
    { title: 'Status', key: 'status' },
  ]},
  { title: 'Financial', key: 'Financial', children: [
    { title: 'Account Code', key: 'accountCode' }, { title: 'Account Name', key: 'accountName' },
    { title: 'Debit Amount', key: 'debit' }, { title: 'Credit Amount', key: 'credit' },
    { title: 'Balance', key: 'balance' },
  ]},
  { title: 'HR', key: 'HR', children: [
    { title: 'Employee Name', key: 'employeeName' }, { title: 'Department', key: 'department' },
    { title: 'Job Title', key: 'jobTitle' }, { title: 'Salary', key: 'salary' },
  ]},
];

const ReportBuilder: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedFields, setSelectedFields] = useState<string[]>(['orderNumber', 'customerName', 'totalAmount', 'status']);
  const [saving, setSaving] = useState(false);

  const addField = (key: string) => { if (!selectedFields.includes(key)) setSelectedFields([...selectedFields, key]); };
  const removeField = (key: string) => setSelectedFields(selectedFields.filter((f) => f !== key));

  const onFinish = async () => {
    setSaving(true);
    try { await new Promise((r) => setTimeout(r, 1000)); message.success('Report saved'); }
    catch { message.error('Failed'); } finally { setSaving(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title="Report Builder" subtitle="Create custom reports with drag-and-drop">
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={onFinish}>Save Report</Button>
      </PageHeader>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={6}>
          <Card title="Available Fields" size="small">
            <Tree treeData={fieldCategories} defaultExpandedKeys={['Sales', 'Financial', 'HR']}
              onSelect={(keys) => { if (keys[0]) addField(keys[0] as string); }}
              selectedKeys={[]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Report Fields" size="small">
            <div className="min-h-[200px] border-2 border-dashed border-gray-200 rounded-lg p-4">
              {selectedFields.length === 0 && <Text type="secondary" className="text-center block py-8">Drag fields here or click from the left panel</Text>}
              <Space wrap>
                {selectedFields.map((f) => (
                  <Tag key={f} closable onClose={() => removeField(f)} className="text-sm py-1 px-3">{f.replace(/([A-Z])/g, ' $1').trim()}</Tag>
                ))}
              </Space>
            </div>
          </Card>
          <Card title="Report Configuration" className="mt-4">
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ chartType: 'table' }}>
              <Row gutter={16}>
                <Col span={12}><Form.Item label="Report Name" name="name" rules={[{ required: true }]}><Input placeholder="Monthly Sales Report" /></Form.Item></Col>
                <Col span={12}><Form.Item label="Chart Type" name="chartType"><Select><Select.Option value="table">Table</Select.Option><Select.Option value="bar">Bar Chart</Select.Option><Select.Option value="line">Line Chart</Select.Option><Select.Option value="pie">Pie Chart</Select.Option></Select></Form.Item></Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}><Form.Item label="Date Range" name="dateRange"><DatePicker.RangePicker className="w-full" /></Form.Item></Col>
                <Col span={8}><Form.Item label="Group By" name="groupBy"><Select allowClear><Select.Option value="month">Month</Select.Option><Select.Option value="quarter">Quarter</Select.Option><Select.Option value="department">Department</Select.Option></Select></Form.Item></Col>
                <Col span={8}><Form.Item label="Schedule" name="schedule"><Select allowClear><Select.Option value="daily">Daily</Select.Option><Select.Option value="weekly">Weekly</Select.Option><Select.Option value="monthly">Monthly</Select.Option></Select></Form.Item></Col>
              </Row>
              <Form.Item label="Description" name="description"><TextArea rows={2} /></Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card title="Filters" size="small">
            <Form layout="vertical">
              <Form.Item label="Department"><Select mode="multiple" placeholder="All departments" /></Form.Item>
              <Form.Item label="Status"><Select mode="multiple" placeholder="All statuses" /></Form.Item>
              <Form.Item label="Min Amount"><InputNumber min={0} prefix="$" className="w-full" /></Form.Item>
              <Form.Item label="Max Amount"><InputNumber min={0} prefix="$" className="w-full" /></Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default ReportBuilder;
