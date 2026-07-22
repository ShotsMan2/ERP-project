import { useState } from 'react';
import { Card, Form, Select, InputNumber, Input, Button, Row, Col, Table, Typography, Space, message, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';

const { TextArea } = Input;
const { Text } = Typography;

interface TransferLine {
  key: string;
  product: string;
  sku: string;
  quantity: number;
  unit: string;
}

const StockTransfer: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [lines, setLines] = useState<TransferLine[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addLine = () => {
    const newLine: TransferLine = {
      key: Date.now().toString(),
      product: '',
      sku: '',
      quantity: 1,
      unit: 'pcs',
    };
    setLines([...lines, newLine]);
  };

  const removeLine = (key: string) => {
    setLines(lines.filter((l) => l.key !== key));
  };

  const updateLine = (key: string, field: keyof TransferLine, value: any) => {
    setLines(lines.map((l) => (l.key === key ? { ...l, [field]: value } : l)));
  };

  const onFinish = async () => {
    if (lines.length === 0) {
      message.error(t('inventory.stockTransferPage.addAtLeastOne'));
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      message.success(t('inventory.stockTransferPage.transferSubmitted'));
      navigate('/inventory/stock-levels');
    } catch {
      message.error(t('inventory.stockTransferPage.transferFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: t('inventory.stockTransferPage.product'), dataIndex: 'product', key: 'product', width: 200,
      render: (v: string, record: TransferLine) => (
        <Select
          value={v || undefined}
          onChange={(val) => {
            const selected = productOptions.find((p) => p.value === val);
            updateLine(record.key, 'product', selected?.label || val);
            updateLine(record.key, 'sku', selected?.sku || '');
          }}
          showSearch
          placeholder={t('inventory.stockTransferPage.selectProduct')}
          style={{ width: '100%' }}
          options={productOptions}
        />
      ),
    },
    { title: t('inventory.stockTransferPage.sku'), dataIndex: 'sku', key: 'sku' },
    {
      title: t('inventory.stockTransferPage.quantity'), dataIndex: 'quantity', key: 'quantity', width: 120,
      render: (v: number, record: TransferLine) => (
        <InputNumber min={1} value={v} onChange={(val) => updateLine(record.key, 'quantity', val)} className="w-full" />
      ),
    },
    { title: t('inventory.stockTransferPage.unit'), dataIndex: 'unit', key: 'unit' },
    {
      title: t('inventory.stockTransferPage.action'), key: 'action', width: 60,
      render: (_: unknown, record: TransferLine) => (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeLine(record.key)} />
      ),
    },
  ];

  const productOptions = [
    { value: 'LAP-001', label: 'Business Laptop Pro 15"', sku: 'LAP-001' },
    { value: 'MON-002', label: '27" 4K Monitor', sku: 'MON-002' },
    { value: 'KEY-003', label: 'Mechanical Keyboard', sku: 'KEY-003' },
    { value: 'MOU-004', label: 'Wireless Mouse', sku: 'MOU-004' },
  ];

  return (
    <div className="p-6">
      <PageHeader title={t('inventory.stockTransferPage.title')} subtitle={t('inventory.stockTransferPage.subtitle')} onBack={() => navigate('/inventory/stock-levels')}>
        <Button type="primary" icon={<SaveOutlined />} loading={submitting} onClick={onFinish}>
          {t('inventory.stockTransferPage.submitButton')}
        </Button>
      </PageHeader>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label={t('inventory.stockTransferPage.sourceWarehouse')} name="sourceWarehouse" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="main">{t('inventory.stockTransferPage.mainWarehouse')}</Select.Option>
                      <Select.Option value="east">{t('inventory.stockTransferPage.eastWarehouse')}</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label={t('inventory.stockTransferPage.destinationWarehouse')} name="destWarehouse" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="main">{t('inventory.stockTransferPage.mainWarehouse')}</Select.Option>
                      <Select.Option value="east">{t('inventory.stockTransferPage.eastWarehouse')}</Select.Option>
                      <Select.Option value="west">{t('inventory.stockTransferPage.westWarehouse')}</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        <Col span={24}>
          <Card
            title={t('inventory.stockTransferPage.transferItems')}
            extra={<Button type="dashed" icon={<PlusOutlined />} onClick={addLine}>{t('inventory.stockTransferPage.addItem')}</Button>}
          >
            <Table
              dataSource={lines}
              columns={columns}
              pagination={false}
              rowKey="key"
              locale={{ emptyText: t('inventory.stockTransferPage.noItems') }}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title={t('inventory.stockTransferPage.notesApproval')}>
            <Form.Item label={t('inventory.stockTransferPage.transferNotes')}>
              <TextArea rows={3} placeholder={t('inventory.stockTransferPage.transferNotesPlaceholder')} />
            </Form.Item>
            <Form.Item label={t('inventory.stockTransferPage.approvalRequired')}>
              <Tag color="orange">{t('inventory.stockTransferPage.pendingApproval')}</Tag>
              <Text type="secondary" className="ml-2">{t('inventory.stockTransferPage.managerApproval')}</Text>
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StockTransfer;
