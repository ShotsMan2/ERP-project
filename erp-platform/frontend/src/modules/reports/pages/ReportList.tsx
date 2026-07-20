import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, message } from 'antd';
import { PlayCircleOutlined, DownloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';

interface SavedReport { id: string; name: string; category: string; chartType: string; lastRun: string; schedule: string; status: string; }
const mockReports: SavedReport[] = [
  { id: '1', name: 'Monthly Sales Summary', category: 'Sales', chartType: 'bar', lastRun: '2024-12-15', schedule: 'Monthly', status: 'active' },
  { id: '2', name: 'Expense Breakdown', category: 'Finance', chartType: 'pie', lastRun: '2024-12-10', schedule: 'None', status: 'active' },
  { id: '3', name: 'Employee Headcount', category: 'HR', chartType: 'line', lastRun: '2024-12-01', schedule: 'Weekly', status: 'active' },
  { id: '4', name: 'Inventory Valuation', category: 'Inventory', chartType: 'table', lastRun: '2024-11-28', schedule: 'Monthly', status: 'active' },
  { id: '5', name: 'AR Aging Report', category: 'Finance', chartType: 'table', lastRun: '2024-11-15', schedule: 'None', status: 'draft' },
];

const ReportList: React.FC = () => {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (c: string) => <Tag>{c}</Tag> },
    { title: 'Type', dataIndex: 'chartType', key: 'chartType', render: (t: string) => <Tag>{t}</Tag> },
    { title: 'Last Run', dataIndex: 'lastRun', key: 'lastRun' },
    { title: 'Schedule', dataIndex: 'schedule', key: 'schedule', render: (s: string) => s !== 'None' ? <Tag color="blue">{s}</Tag> : '-' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag> },
    { title: 'Actions', key: 'actions', render: () => (
      <Space>
        <Button type="link" size="small" icon={<PlayCircleOutlined />} style={{ color: '#52c41a' }} onClick={() => message.success('Report generated')}>Run</Button>
        <Button type="link" size="small" icon={<DownloadOutlined />} onClick={() => message.success('Report exported')}>Export</Button>
        <Button type="link" size="small" icon={<EditOutlined />} />
        <Button type="link" size="small" danger icon={<DeleteOutlined />} />
      </Space>
    )},
  ];

  return (
    <div className="p-6">
      <PageHeader title="Saved Reports" subtitle="Manage and run your reports" />
      <Card><DataTable dataSource={mockReports} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (t: number) => t + ' reports' }} /></Card>
    </div>
  );
};
export default ReportList;
