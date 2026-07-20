import { useState } from 'react';
import { Card, Table, Tag, Button, Row, Col, Statistic, Form, Select, InputNumber, DatePicker, Input, message, Progress, Typography } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

const weeklyData = [
  { day: 'Mon', date: '2024-12-16', hours: 8, project: 'ERP Implementation', task: 'API development', billable: true },
  { day: 'Tue', date: '2024-12-17', hours: 7.5, project: 'ERP Implementation', task: 'API development', billable: true },
  { day: 'Wed', date: '2024-12-18', hours: 6, project: 'ERP Implementation', task: 'Code review', billable: true },
  { day: 'Thu', date: '2024-12-19', hours: 8, project: 'Cloud Migration', task: 'Infrastructure setup', billable: false },
  { day: 'Fri', date: '2024-12-20', hours: 4, project: 'ERP Implementation', task: 'Documentation', billable: true },
];

const totalHours = weeklyData.reduce((s, d) => s + d.hours, 0);
const billableHours = weeklyData.filter((d) => d.billable).reduce((s, d) => s + d.hours, 0);

const TimeTracking: React.FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async () => {
    setSubmitting(true);
    try { await new Promise((r) => setTimeout(r, 500)); message.success('Time entry saved'); form.resetFields(); }
    catch { message.error('Failed'); } finally { setSubmitting(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title="Time Tracking" subtitle="Log and manage work hours" />

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}><Card><Statistic title="This Week" value={totalHours} suffix="hours" /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Billable" value={billableHours} suffix="hours" valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Utilization" value={Math.round((billableHours / totalHours) * 100)} suffix="%" /></Card></Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={10}>
          <Card title="Log Time">
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ date: dayjs(), billable: true }}>
              <Form.Item label="Date" name="date" rules={[{ required: true }]}><DatePicker className="w-full" /></Form.Item>
              <Form.Item label="Project" name="project" rules={[{ required: true }]}><Select><Select.Option value="PROJ-001">ERP Implementation</Select.Option><Select.Option value="PROJ-002">Mobile App Dev</Select.Option><Select.Option value="PROJ-003">Cloud Migration</Select.Option></Select></Form.Item>
              <Form.Item label="Task" name="task" rules={[{ required: true }]}><Select><Select.Option value="dev">Development</Select.Option><Select.Option value="review">Code Review</Select.Option><Select.Option value="meeting">Meeting</Select.Option><Select.Option value="docs">Documentation</Select.Option></Select></Form.Item>
              <Form.Item label="Hours" name="hours" rules={[{ required: true }]}><InputNumber min={0.5} max={24} step={0.5} className="w-full" /></Form.Item>
              <Form.Item label="Description" name="description"><Input.TextArea rows={2} /></Form.Item>
              <Form.Item label="Billable" name="billable" valuePropName="checked"><Select><Select.Option value={true}>Billable</Select.Option><Select.Option value={false}>Non-Billable</Select.Option></Select></Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting} block>Save Entry</Button>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card title="Weekly Summary">
            <Table dataSource={weeklyData} rowKey="day" pagination={false} size="small"
              columns={[
                { title: 'Day', dataIndex: 'day' }, { title: 'Date', dataIndex: 'date' },
                { title: 'Hours', dataIndex: 'hours', render: (v: number) => <Text strong>{v}h</Text> },
                { title: 'Project', dataIndex: 'project' }, { title: 'Task', dataIndex: 'task' },
                { title: 'Billable', dataIndex: 'billable', render: (b: boolean) => <Tag color={b ? 'green' : 'default'}>{b ? 'Yes' : 'No'}</Tag> },
              ]}
            />
            <div className="mt-4"><Text strong>Total: {totalHours}h</Text> | <Text type="secondary">Billable: {billableHours}h ({Math.round((billableHours / totalHours) * 100)}%)</Text></div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default TimeTracking;
