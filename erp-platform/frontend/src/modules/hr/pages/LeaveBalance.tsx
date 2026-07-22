import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Progress, Typography, Tag, Space } from 'antd';
import {
  UserOutlined, CoffeeOutlined, HeartOutlined, HomeOutlined, MedicineBoxOutlined,
  CustomerServiceOutlined, GiftOutlined,
} from '@ant-design/icons';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

interface LeavePolicy {
  id: string;
  name: string;
  type: string;
  total: number;
  used: number;
  pending: number;
  carryOver: number;
  icon: React.ReactNode;
  color: string;
}

const leavePolicies: LeavePolicy[] = [
  { id: '1', name: 'Annual Leave', type: 'annual', total: 20, used: 12, pending: 3, carryOver: 5, icon: <CoffeeOutlined />, color: '#1677ff' },
  { id: '2', name: 'Sick Leave', type: 'sick', total: 15, used: 4, pending: 0, carryOver: 0, icon: <MedicineBoxOutlined />, color: '#52c41a' },
  { id: '3', name: 'Personal Leave', type: 'personal', total: 5, used: 2, pending: 1, carryOver: 0, icon: <UserOutlined />, color: '#faad14' },
  { id: '4', name: 'Maternity Leave', type: 'maternity', total: 90, used: 0, pending: 0, carryOver: 0, icon: <HeartOutlined />, color: '#eb2f96' },
  { id: '5', name: 'Paternity Leave', type: 'paternity', total: 10, used: 0, pending: 0, carryOver: 0, icon: <HomeOutlined />, color: '#722ed1' },
  { id: '6', name: 'Compassionate Leave', type: 'compassionate', total: 5, used: 0, pending: 0, carryOver: 0, icon: <CustomerServiceOutlined />, color: '#13c2c2' },
  { id: '7', name: 'Marriage Leave', type: 'marriage', total: 3, used: 0, pending: 0, carryOver: 0, icon: <GiftOutlined />, color: '#f5222d' },
];

const LeaveBalance: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <PageHeader title={t('hr.leaveBalanceTitle')} subtitle={t('hr.leaveEntitlementSummary')} />

      <Row gutter={[16, 16]}>
        {leavePolicies.map((policy) => {
          const available = policy.total - policy.used - policy.pending + policy.carryOver;
          const percent = Math.round(((policy.used + policy.pending) / policy.total) * 100);

          return (
            <Col xs={24} sm={12} lg={8} xl={6} key={policy.id}>
              <Card hoverable className="h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl" style={{ color: policy.color }}>{policy.icon}</div>
                  <div>
                    <Text strong>{t(`hr.${policy.type}LeaveLabel`)}</Text>
                    <br />
                    <Text type="secondary" className="text-xs">{policy.type.replace('_', ' ')}</Text>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <Text className="text-3xl font-bold" style={{ color: policy.color }}>{available}</Text>
                  <Text type="secondary" className="text-sm ml-1">/ {policy.total} {t('hr.daysLabel')}</Text>
                </div>

                <Progress
                  percent={percent}
                  size="small"
                  strokeColor={policy.color}
                  format={() => `${percent}%`}
                />

                <div className="flex justify-between mt-3 text-sm">
                  <Space>
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    <Text type="secondary">{t('hr.usedLabel')} {policy.used}</Text>
                  </Space>
                  <Space>
                    <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                    <Text type="secondary">{t('hr.pendingColon')} {policy.pending}</Text>
                  </Space>
                  {policy.carryOver > 0 && (
                    <Space>
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                      <Text type="secondary">{t('hr.carryLabel')} {policy.carryOver}</Text>
                    </Space>
                  )}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default LeaveBalance;
