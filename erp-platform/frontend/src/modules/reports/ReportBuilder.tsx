import { Card } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

export default function ReportBuilder() {
  return (
    <div>
      <PageHeader title="Report Builder" subtitle="Create custom reports" onAdd={() => {}} addLabel="New Report" />
      <Card><p className="text-gray-400 text-center py-8">Report builder interface will be implemented here.</p></Card>
    </div>
  );
}
