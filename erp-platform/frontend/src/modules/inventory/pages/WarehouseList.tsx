import { Card, Row, Col, Typography, Tag, Button, Space, Statistic } from 'antd';
import { PlusOutlined, EyeOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

interface Warehouse {
  id: string;
  name: string;
  code: string;
  type: string;
  address: string;
  locationCount: number;
  binCount: number;
  stockValue: number;
  isActive: boolean;
}

const mockWarehouses: Warehouse[] = [
  { id: '1', name: 'Main Warehouse', code: 'WH-MAIN', type: 'central', address: '100 Industrial Blvd, Detroit, MI', locationCount: 12, binCount: 48, stockValue: 1250000, isActive: true },
  { id: '2', name: 'East Distribution Center', code: 'WH-EAST', type: 'distribution', address: '500 Commerce Dr, Newark, NJ', locationCount: 8, binCount: 32, stockValue: 890000, isActive: true },
  { id: '3', name: 'West Warehouse', code: 'WH-WEST', type: 'regional', address: '250 Logistics Ave, Los Angeles, CA', locationCount: 6, binCount: 24, stockValue: 670000, isActive: true },
  { id: '4', name: 'Returns Processing', code: 'WH-RET', type: 'returns', address: '75 Recovery Ln, Chicago, IL', locationCount: 3, binCount: 12, stockValue: 45000, isActive: false },
];

const typeColors: Record<string, string> = {
  central: 'blue', distribution: 'green', regional: 'orange', returns: 'purple',
};

const WarehouseList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <PageHeader title={t('inventory.warehousesPage.title')} subtitle={t('inventory.warehousesPage.subtitle')}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/inventory/warehouses/new')}>
          {t('inventory.warehousesPage.addLabel')}
        </Button>
      </PageHeader>

      <Row gutter={[16, 16]}>
        {mockWarehouses.map((wh) => (
          <Col xs={24} sm={12} lg={8} key={wh.id}>
            <Card
              hoverable
              className="h-full cursor-pointer"
              onClick={() => navigate(`/inventory/warehouses/${wh.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <ShopOutlined className="text-xl text-blue-600" />
                  </div>
                  <div>
                    <Text strong className="text-base">{wh.name}</Text>
                    <br />
                    <Text type="secondary" className="text-sm">{wh.code}</Text>
                  </div>
                </div>
                <Tag color={wh.isActive ? 'green' : 'default'}>{wh.isActive ? t('inventory.warehouseDetailPage.active') : t('inventory.warehouseDetailPage.inactive')}</Tag>
              </div>

              <div className="mb-3">
                <Tag color={typeColors[wh.type]}>{wh.type}</Tag>
              </div>

              <Text type="secondary" className="text-sm block mb-4">{wh.address}</Text>

              <Row gutter={[8, 8]}>
                <Col span={8}>
                  <Statistic title={t('inventory.warehousesPage.locations')} value={wh.locationCount} valueStyle={{ fontSize: 18 }} />
                </Col>
                <Col span={8}>
                  <Statistic title={t('inventory.warehousesPage.bins')} value={wh.binCount} valueStyle={{ fontSize: 18 }} />
                </Col>
                <Col span={8}>
                  <Statistic title={t('inventory.warehousesPage.stockValue')} value={wh.stockValue} prefix="$" valueStyle={{ fontSize: 18 }} precision={0} />
                </Col>
              </Row>

              <Button type="link" className="mt-3 p-0" icon={<EyeOutlined />}>
                {t('inventory.warehousesPage.viewDetails')}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default WarehouseList;
