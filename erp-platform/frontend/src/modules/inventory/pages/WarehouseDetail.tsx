import { Card, Descriptions, Tag, Table, Row, Col, Statistic, Typography, Tabs, Tree, Button, Space } from 'antd';
import { EditOutlined, FolderOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import type { DataNode } from 'antd/es/tree';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

const warehouseData = {
  id: '1', name: 'Main Warehouse', code: 'WH-MAIN', type: 'central',
  address: '100 Industrial Blvd, Detroit, MI 48201', phone: '+1-555-0301',
  manager: 'Mike Brown', isActive: true, totalLocations: 12, totalBins: 48, stockValue: 1250000,
};

const locationTree: DataNode[] = [
  {
    title: 'Zone A - Electronics', key: 'A', icon: <FolderOutlined />,
    children: [
      { title: 'A-01', key: 'A-01', icon: <EnvironmentOutlined />, children: [
        { title: 'A-01-01 (Laptops)', key: 'A-01-01', icon: <EnvironmentOutlined /> },
        { title: 'A-01-02 (Laptops)', key: 'A-01-02', icon: <EnvironmentOutlined /> },
      ]},
      { title: 'A-02', key: 'A-02', icon: <EnvironmentOutlined />, children: [
        { title: 'A-02-01 (Monitors)', key: 'A-02-01', icon: <EnvironmentOutlined /> },
        { title: 'A-02-02 (Monitors)', key: 'A-02-02', icon: <EnvironmentOutlined /> },
      ]},
      { title: 'A-03 (Accessories)', key: 'A-03', icon: <EnvironmentOutlined />, children: [
        { title: 'A-03-01 (Keyboards)', key: 'A-03-01', icon: <EnvironmentOutlined /> },
      ]},
    ],
  },
  {
    title: 'Zone B - Furniture', key: 'B', icon: <FolderOutlined />,
    children: [
      { title: 'B-01 (Desks)', key: 'B-01', icon: <EnvironmentOutlined />, children: [
        { title: 'B-01-01', key: 'B-01-01', icon: <EnvironmentOutlined /> },
      ]},
      { title: 'B-02 (Chairs)', key: 'B-02', icon: <EnvironmentOutlined />, children: [
        { title: 'B-02-01', key: 'B-02-01', icon: <EnvironmentOutlined /> },
      ]},
    ],
  },
];

const binData = [
  { bin: 'A-01-01', product: 'Business Laptop Pro 15"', sku: 'LAP-001', quantity: 20, capacity: 50, utilization: '40%' },
  { bin: 'A-01-02', product: 'Gaming Laptop 17"', sku: 'LAP-002', quantity: 15, capacity: 50, utilization: '30%' },
  { bin: 'A-02-01', product: '27" 4K Monitor', sku: 'MON-002', quantity: 80, capacity: 100, utilization: '80%' },
  { bin: 'A-03-01', product: 'Mechanical Keyboard', sku: 'KEY-003', quantity: 150, capacity: 200, utilization: '75%' },
  { bin: 'B-01-01', product: 'Standing Desk Frame', sku: 'DES-005', quantity: 5, capacity: 20, utilization: '25%' },
  { bin: 'B-02-01', product: 'Ergonomic Office Chair', sku: 'CHA-006', quantity: 2, capacity: 30, utilization: '7%' },
];

const WarehouseDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <PageHeader
        title={warehouseData.name}
        subtitle={`Code: ${warehouseData.code} · Type: ${warehouseData.type}`}
        onBack={() => navigate('/inventory/warehouses')}
      >
        <Button type="primary" icon={<EditOutlined />}>Edit Warehouse</Button>
      </PageHeader>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}><Card><Statistic title="Locations" value={warehouseData.totalLocations} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Total Bins" value={warehouseData.totalBins} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Stock Value" value={warehouseData.stockValue} prefix="$" precision={0} /></Card></Col>
      </Row>

      <Card>
        <Tabs defaultActiveKey="locations"
          items={[
            {
              key: 'locations', label: 'Locations & Bins',
              children: (
                <Row gutter={24}>
                  <Col span={8}>
                    <Card title="Location Tree" size="small">
                      <Tree treeData={locationTree} defaultExpandedKeys={['A', 'B']} showIcon />
                    </Card>
                  </Col>
                  <Col span={16}>
                    <Table dataSource={binData} rowKey="bin" pagination={false} size="small"
                      columns={[
                        { title: 'Bin', dataIndex: 'bin' },
                        { title: 'Product', dataIndex: 'product' },
                        { title: 'SKU', dataIndex: 'sku' },
                        { title: 'Qty', dataIndex: 'quantity' },
                        { title: 'Capacity', dataIndex: 'capacity' },
                        { title: 'Utilization', dataIndex: 'utilization', render: (u: string) => (
                          <Tag color={parseInt(u) > 80 ? 'red' : parseInt(u) > 50 ? 'orange' : 'green'}>{u}</Tag>
                        )},
                      ]}
                    />
                  </Col>
                </Row>
              ),
            },
            {
              key: 'info', label: 'Information',
              children: (
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="Name">{warehouseData.name}</Descriptions.Item>
                  <Descriptions.Item label="Code">{warehouseData.code}</Descriptions.Item>
                  <Descriptions.Item label="Type"><Tag color="blue">{warehouseData.type}</Tag></Descriptions.Item>
                  <Descriptions.Item label="Status"><Tag color={warehouseData.isActive ? 'green' : 'default'}>{warehouseData.isActive ? 'Active' : 'Inactive'}</Tag></Descriptions.Item>
                  <Descriptions.Item label="Address" span={2}>{warehouseData.address}</Descriptions.Item>
                  <Descriptions.Item label="Phone">{warehouseData.phone}</Descriptions.Item>
                  <Descriptions.Item label="Manager">{warehouseData.manager}</Descriptions.Item>
                </Descriptions>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default WarehouseDetail;
