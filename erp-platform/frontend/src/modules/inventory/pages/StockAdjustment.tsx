import { useState } from 'react';
import { Card, Form, Select, InputNumber, Input, Button, Row, Col, Typography, message, Descriptions, Tag } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';

const { TextArea } = Input;
const { Text } = Typography;

interface AdjustmentFormData {
  product: string;
  warehouse: string;
  bin: string;
  adjustmentType: string;
  quantity: number;
  reason: string;
  reference: string;
  notes: string;
}

const StockAdjustment: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm<AdjustmentFormData>();
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [preview, setPreview] = useState<{ currentStock: number; newStock: number } | null>(null);

  const watchType = Form.useWatch('adjustmentType', form);
  const watchQty = Form.useWatch('quantity', form);

  const handleProductChange = (value: string) => {
    setSelectedProduct(value);
    if (value) {
      setPreview({ currentStock: 45, newStock: 45 });
    }
  };

  const handleQtyChange = (value: number | null) => {
    if (selectedProduct && value) {
      const current = 45;
      const delta = watchType === 'addition' ? value : -value;
      setPreview({ currentStock: current, newStock: current + delta });
    }
  };

  const onFinish = async (values: AdjustmentFormData) => {
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      message.success(t('inventory.stockAdjustmentPage.adjustmentCompleted'));
      navigate('/inventory/stock-levels');
    } catch {
      message.error(t('inventory.stockAdjustmentPage.adjustmentFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <PageHeader title={t('inventory.stockAdjustmentPage.title')} subtitle={t('inventory.stockAdjustmentPage.subtitle')} onBack={() => navigate('/inventory/stock-levels')}>
        <Button type="primary" icon={<SaveOutlined />} loading={submitting} onClick={() => form.submit()}>
          {t('inventory.stockAdjustmentPage.saveButton')}
        </Button>
      </PageHeader>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title={t('inventory.stockAdjustmentPage.adjustmentDetails')}>
            <Form<AdjustmentFormData>
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onValuesChange={(changed) => {
                if (changed.quantity || changed.adjustmentType) {
                  handleQtyChange(form.getFieldValue('quantity'));
                }
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={t('inventory.stockAdjustmentPage.product')} name="product" rules={[{ required: true }]}>
                    <Select showSearch placeholder={t('inventory.stockAdjustmentPage.searchProduct')} onChange={handleProductChange}>
                      <Select.Option value="LAP-001">Business Laptop Pro 15" (LAP-001)</Select.Option>
                      <Select.Option value="MON-002">27" 4K Monitor (MON-002)</Select.Option>
                      <Select.Option value="KEY-003">Mechanical Keyboard (KEY-003)</Select.Option>
                      <Select.Option value="MOU-004">Wireless Mouse (MOU-004)</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('inventory.stockAdjustmentPage.warehouse')} name="warehouse" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="main">{t('inventory.stockTransferPage.mainWarehouse')}</Select.Option>
                      <Select.Option value="east">{t('inventory.stockTransferPage.eastWarehouse')}</Select.Option>
                      <Select.Option value="west">{t('inventory.stockTransferPage.westWarehouse')}</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={t('inventory.stockAdjustmentPage.binLocation')} name="bin" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="A-01-01">A-01-01</Select.Option>
                      <Select.Option value="A-01-02">A-01-02</Select.Option>
                      <Select.Option value="B-01-01">B-01-01</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('inventory.stockAdjustmentPage.adjustmentType')} name="adjustmentType" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="addition">{t('inventory.stockAdjustmentPage.addStock')}</Select.Option>
                      <Select.Option value="removal">{t('inventory.stockAdjustmentPage.removeStock')}</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={t('inventory.stockAdjustmentPage.quantity')} name="quantity" rules={[{ required: true, type: 'number', min: 1 }]}>
                    <InputNumber min={1} className="w-full" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('inventory.stockAdjustmentPage.referenceDocument')} name="reference">
                    <Input placeholder={t('inventory.stockAdjustmentPage.optionalReference')} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label={t('inventory.stockAdjustmentPage.reason')} name="reason" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="damaged">{t('inventory.stockAdjustmentPage.damaged')}</Select.Option>
                  <Select.Option value="lost">{t('inventory.stockAdjustmentPage.lost')}</Select.Option>
                  <Select.Option value="found">{t('inventory.stockAdjustmentPage.found')}</Select.Option>
                  <Select.Option value="count">{t('inventory.stockAdjustmentPage.physicalCount')}</Select.Option>
                  <Select.Option value="return">{t('inventory.stockAdjustmentPage.customerReturn')}</Select.Option>
                  <Select.Option value="quality">{t('inventory.stockAdjustmentPage.qualityReject')}</Select.Option>
                  <Select.Option value="other">{t('inventory.stockAdjustmentPage.other')}</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label={t('inventory.stockAdjustmentPage.notes')} name="notes">
                <TextArea rows={3} placeholder={t('inventory.stockAdjustmentPage.additionalNotes')} />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title={t('inventory.stockAdjustmentPage.preview')}>
            {preview ? (
              <div className="space-y-4">
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label={t('inventory.stockAdjustmentPage.currentStock')}>
                    <Text strong>{preview.currentStock}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('inventory.stockAdjustmentPage.adjustmentType')}>
                    <Tag color={watchType === 'addition' ? 'green' : 'red'}>
                      {watchType === 'addition' ? `+${watchQty || 0}` : `-${watchQty || 0}`}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('inventory.stockAdjustmentPage.newStock')}>
                    <Text strong className={preview.newStock < 0 ? 'text-red-500' : ''}>{preview.newStock}</Text>
                  </Descriptions.Item>
                </Descriptions>
                {preview.newStock < 0 && (
                  <div className="text-red-500 text-sm">{t('inventory.stockAdjustmentPage.warningNegative')}</div>
                )}
              </div>
            ) : (
              <Text type="secondary">{t('inventory.stockAdjustmentPage.selectProduct')}</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StockAdjustment;
