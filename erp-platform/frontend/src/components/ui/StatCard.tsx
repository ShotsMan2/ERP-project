import { ReactNode } from 'react';
import { Card, Statistic, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  subtitle?: string;
  color?: string;
  loading?: boolean;
}

export function StatCard({ icon, title, value, trend, trendLabel, subtitle, color = '#1677ff', loading }: StatCardProps) {
  return (
    <Card loading={loading} className="shadow-sm">
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <Text type="secondary" className="text-sm">{title}</Text>
        <div className="text-2xl font-bold mt-1">{value}</div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {trend >= 0 ? (
              <ArrowUpOutlined className="text-success text-sm" />
            ) : (
              <ArrowDownOutlined className="text-error text-sm" />
            )}
            <Text className={trend >= 0 ? 'text-success' : 'text-error'}>
              {Math.abs(trend)}%
            </Text>
            {trendLabel && <Text type="secondary" className="text-xs">{trendLabel}</Text>}
          </div>
        )}
        {subtitle && <Text type="secondary" className="text-xs block mt-1">{subtitle}</Text>}
      </div>
    </Card>
  );
}

export default StatCard;
