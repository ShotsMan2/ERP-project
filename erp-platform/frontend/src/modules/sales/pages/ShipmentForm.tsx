import { useState } from 'react';
import { Card, Form, Select, Input, InputNumber, Button, Row, Col, Table, Typography, message, Tag } from 'antd';
import { SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;
const { TextArea } = Input;
interface ShipmentLine { key: string; product: string; sku: string; qty: number; }

const ShipmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [lines, setLines] = useState<ShipmentLine[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSOSelect = (value: string) => {
    setLines([
      { key: '1', product: 'Business Laptop Pro 15"', sku: 'LAP-001', qty: 3 },
      { key: '2', product: '27" 4K Monitor', sku: 'MON-002', qty: 5 },
    ]);
  };

  const onFinish = async () => {
    setSubmitting(true);
    try { await new Promise((r) => setTimeout(r, 1000)); message.success(t('sales.shipmentForm.shipmentCreated')); navigate('/sales/orders'); }
    catch { message.error(t('sales.shipmentForm.failedToCreateShipment')); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title={t('sales.shipmentForm.title')} subtitle={t('sales.shipmentForm.subtitle')} onBack={() => navigate('/sales/orders')}>
        <Button type="primary" icon={<SaveOutlined />} loading={submitting} onClick={onFinish}>{t('sales.shipmentForm.createShipment')}</Button>
      </PageHeader>
      <Card>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}><Form.Item label={t('sales.shipmentForm.salesOrder')} name="soNumber" rules={[{ required: true }]}><Select showSearch placeholder={t('sales.shipmentForm.selectSO')} onChange={handleSOSelect}><Select.Option value="SO-2024-0234">SO-2024-0234 - Acme Corp</Select.Option><Select.Option value="SO-2024-0233">SO-2024-0233 - GlobalTech Inc.</Select.Option></Select></Form.Item></Col>
            <Col span={8}><Form.Item label={t('sales.shipmentForm.carrier')} name="carrier"><Select><Select.Option value="fedex">FedEx</Select.Option><Select.Option value="ups">UPS</Select.Option><Select.Option value="dhl">DHL</Select.Option></Select></Form.Item></Col>
            <Col span={8}><Form.Item label={t('sales.shipmentForm.trackingNumber')} name="tracking"><Input /></Form.Item></Col>
          </Row>
        </Form>
        {lines.length > 0 && (
          <>
            <Text strong className="block mb-3">{t('sales.shipmentForm.itemsToShip')}</Text>
            <Table dataSource={lines} rowKey="key" pagination={false} size="small"
              columns={[{ title: t('sales.shipmentForm.product'), dataIndex: 'product' }, { title: t('sales.shipmentForm.sku'), dataIndex: 'sku' }, { title: t('sales.shipmentForm.qtyToShip'), dataIndex: 'qty', render: (v: number) => <InputNumber min={1} max={v} value={v} /> }]} />
          </>
        )}
      </Card>
    </div>
  );
};
export default ShipmentForm;
