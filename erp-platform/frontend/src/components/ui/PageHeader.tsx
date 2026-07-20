import { ReactNode } from 'react';
import { Space, Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Breadcrumbs from '@/layouts/components/Breadcrumbs';

const { Title } = Typography;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onAdd?: () => void;
  addLabel?: string;
  extra?: ReactNode;
  children?: ReactNode;
  onBack?: () => void;
}

export function PageHeader({ title, subtitle, onAdd, addLabel, extra, children, onBack }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <Breadcrumbs />
      <div className="flex items-center justify-between mt-2">
        <div>
          {onBack && <a onClick={onBack} className="text-sm text-blue-500 cursor-pointer">&larr; Back</a>}
          <Title level={4} className="mb-0">{title}</Title>
          {subtitle && <span className="text-gray-400 text-sm">{subtitle}</span>}
        </div>
        <Space>
          {extra}
          {onAdd && (
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
              {addLabel || 'Add New'}
            </Button>
          )}
        </Space>
      </div>
      {children}
    </div>
  );
}

export default PageHeader;
