import { useState } from 'react';
import {
  Card, Form, Input, Select, InputNumber, Button, Row, Col, TreeSelect, Switch, Upload, message, Divider,
} from 'antd';
import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';

const { TextArea } = Input;

interface ProductFormData {
  name: string;
  sku: string;
  barcode: string;
  category: string;
  unit: string;
  salePrice: number;
  costPrice: number;
  taxRate: string;
  description: string;
  isActive: boolean;
  minStock: number;
  maxStock: number;
}

const categoryTreeData = [
  { title: 'All Products', value: 'all', key: 'all', children: [
    { title: 'Electronics', value: 'electronics', key: 'electronics', children: [
      { title: 'Laptops', value: 'laptops', key: 'laptops' },
      { title: 'Monitors', value: 'monitors', key: 'monitors' },
      { title: 'Accessories', value: 'accessories', key: 'accessories' },
    ]},
    { title: 'Furniture', value: 'furniture', key: 'furniture', children: [
      { title: 'Desks', value: 'desks', key: 'desks' },
      { title: 'Chairs', value: 'chairs', key: 'chairs' },
    ]},
    { title: 'Office Supplies', value: 'supplies', key: 'supplies' },
  ]},
];

const ProductForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm<ProductFormData>();
  const [saving, setSaving] = useState(false);
  const isEditing = !!id;

  const onFinish = async (values: ProductFormData) => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      message.success(isEditing ? t('inventory.productForm.productUpdated') : t('inventory.productForm.productCreated'));
      navigate('/inventory/products');
    } catch {
      message.error(isEditing ? t('inventory.productForm.updateFailed') : t('inventory.productForm.createFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title={isEditing ? t('inventory.productForm.editTitle') : t('inventory.productForm.newTitle')}
        subtitle={isEditing ? t('inventory.productForm.editSubtitle') : t('inventory.productForm.newSubtitle')}
        onBack={() => navigate('/inventory/products')}
      >
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
          {isEditing ? t('inventory.productForm.updateButton') : t('inventory.productForm.createButton')}
        </Button>
      </PageHeader>

      <Card>
        <Form<ProductFormData>
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ isActive: true, unit: 'pcs', taxRate: 'standard' }}
        >
          <Divider orientation="left">{t('inventory.productForm.basicInfo')}</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item label={t('inventory.productForm.productName')} name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={4}>
              <Form.Item label={t('inventory.productForm.sku')} name="sku" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={4}>
              <Form.Item label={t('inventory.productForm.barcode')} name="barcode">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={4}>
              <Form.Item label={t('inventory.productForm.unit')} name="unit" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="pcs">{t('inventory.productForm.pieces')}</Select.Option>
                  <Select.Option value="kg">{t('inventory.productForm.kilograms')}</Select.Option>
                  <Select.Option value="lt">{t('inventory.productForm.liters')}</Select.Option>
                  <Select.Option value="m">{t('inventory.productForm.meters')}</Select.Option>
                  <Select.Option value="box">{t('inventory.productForm.box')}</Select.Option>
                  <Select.Option value="set">{t('inventory.productForm.set')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={4}>
              <Form.Item label={t('inventory.productForm.active')} name="isActive" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item label={t('inventory.productForm.category')} name="category" rules={[{ required: true }]}>
                <TreeSelect
                  treeData={categoryTreeData}
                  placeholder={t('inventory.productForm.selectCategory')}
                  treeDefaultExpandAll
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item label={t('inventory.productForm.taxRate')} name="taxRate" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="exempt">{t('inventory.productForm.taxExempt')}</Select.Option>
                  <Select.Option value="reduced">{t('inventory.productForm.reducedRate')}</Select.Option>
                  <Select.Option value="standard">{t('inventory.productForm.standard')}</Select.Option>
                  <Select.Option value="luxury">{t('inventory.productForm.luxury')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={t('inventory.productForm.description')} name="description">
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">{t('inventory.productForm.pricingStock')}</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item label={t('inventory.productForm.salePrice')} name="salePrice" rules={[{ required: true }]}>
                <InputNumber min={0} prefix="$" className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label={t('inventory.productForm.costPrice')} name="costPrice">
                <InputNumber min={0} prefix="$" className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item label={t('inventory.productForm.minStock')} name="minStock">
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label={t('inventory.productForm.maxStock')} name="maxStock">
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">{t('inventory.productForm.images')}</Divider>
          <Upload action="/api/v1/upload" listType="picture-card">
            <div><UploadOutlined /><br /><span>{t('inventory.productForm.upload')}</span></div>
          </Upload>
        </Form>
      </Card>
    </div>
  );
};

export default ProductForm;
