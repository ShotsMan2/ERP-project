import { useState } from 'react';
import {
  Card, Form, Input, Select, InputNumber, Button, Row, Col, TreeSelect, Switch, Upload, message, Divider,
} from 'antd';
import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm<ProductFormData>();
  const [saving, setSaving] = useState(false);
  const isEditing = !!id;

  const onFinish = async (values: ProductFormData) => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      message.success(`Product ${isEditing ? 'updated' : 'created'} successfully`);
      navigate('/inventory/products');
    } catch {
      message.error(`Failed to ${isEditing ? 'update' : 'create'} product`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title={isEditing ? 'Edit Product' : 'New Product'}
        subtitle={isEditing ? 'Update product information' : 'Add a new product to inventory'}
        onBack={() => navigate('/inventory/products')}
      >
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
          {isEditing ? 'Update' : 'Create'} Product
        </Button>
      </PageHeader>

      <Card>
        <Form<ProductFormData>
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ isActive: true, unit: 'pcs', taxRate: 'standard' }}
        >
          <Divider orientation="left">Basic Information</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item label="Product Name" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={4}>
              <Form.Item label="SKU" name="sku" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={4}>
              <Form.Item label="Barcode" name="barcode">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={4}>
              <Form.Item label="Unit" name="unit" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="pcs">Pieces</Select.Option>
                  <Select.Option value="kg">Kilograms</Select.Option>
                  <Select.Option value="lt">Liters</Select.Option>
                  <Select.Option value="m">Meters</Select.Option>
                  <Select.Option value="box">Box</Select.Option>
                  <Select.Option value="set">Set</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={4}>
              <Form.Item label="Active" name="isActive" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                <TreeSelect
                  treeData={categoryTreeData}
                  placeholder="Select category"
                  treeDefaultExpandAll
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item label="Tax Rate" name="taxRate" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="exempt">Tax Exempt (0%)</Select.Option>
                  <Select.Option value="reduced">Reduced Rate (8%)</Select.Option>
                  <Select.Option value="standard">Standard (20%)</Select.Option>
                  <Select.Option value="luxury">Luxury (25%)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Description" name="description">
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Pricing & Stock</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item label="Sale Price" name="salePrice" rules={[{ required: true }]}>
                <InputNumber min={0} prefix="$" className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label="Cost Price" name="costPrice">
                <InputNumber min={0} prefix="$" className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item label="Minimum Stock Level" name="minStock">
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label="Maximum Stock Level" name="maxStock">
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Images</Divider>
          <Upload action="/api/v1/upload" listType="picture-card">
            <div><UploadOutlined /><br /><span>Upload</span></div>
          </Upload>
        </Form>
      </Card>
    </div>
  );
};

export default ProductForm;
