import { Spin, Skeleton } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingProps {
  type?: 'page' | 'inline' | 'skeleton';
  rows?: number;
}

export function Loading({ type = 'inline', rows = 3 }: LoadingProps) {
  if (type === 'page') {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    );
  }

  if (type === 'skeleton') {
    return <Skeleton active paragraph={{ rows }} />;
  }

  return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;
}

export function PageLoading() {
  return <Loading type="page" />;
}

export function SkeletonLoading({ rows = 3 }: { rows?: number }) {
  return <Loading type="skeleton" rows={rows} />;
}
