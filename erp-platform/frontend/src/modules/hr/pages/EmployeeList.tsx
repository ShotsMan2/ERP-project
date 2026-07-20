import { useState } from 'react';
import {
  Table, Card, Button, Space, Input, Select, Tag, Drawer, Typography, message, Popconfirm,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FilterOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/data/DataTable';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

interface Employee {
  id: string;
  code: string;
  name: string;
  department: string;
  jobTitle: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'terminated' | 'on_leave';
  hireDate: string;
}

const mockEmployees: Employee[] = [
  { id: '1', code: 'EMP001', name: 'John Smith', department: 'Engineering', jobTitle: 'Senior Developer', email: 'john@company.com', phone: '+1-555-0101', status: 'active', hireDate: '2022-03-15' },
  { id: '2', code: 'EMP002', name: 'Sarah Johnson', department: 'Marketing', jobTitle: 'Marketing Manager', email: 'sarah@company.com', phone: '+1-555-0102', status: 'active', hireDate: '2021-07-01' },
  { id: '3', code: 'EMP003', name: 'Mike Brown', department: 'Finance', jobTitle: 'Accountant', email: 'mike@company.com', phone: '+1-555-0103', status: 'active', hireDate: '2023-01-10' },
  { id: '4', code: 'EMP004', name: 'Emily Davis', department: 'HR', jobTitle: 'HR Coordinator', email: 'emily@company.com', phone: '+1-555-0104', status: 'on_leave', hireDate: '2022-11-20' },
  { id: '5', code: 'EMP005', name: 'James Wilson', department: 'Engineering', jobTitle: 'DevOps Engineer', email: 'james@company.com', phone: '+1-555-0105', status: 'active', hireDate: '2023-06-05' },
  { id: '6', code: 'EMP006', name: 'Anna Taylor', department: 'Sales', jobTitle: 'Sales Representative', email: 'anna@company.com', phone: '+1-555-0106', status: 'terminated', hireDate: '2020-09-12' },
];

const statusColors: Record<string, string> = {
  active: 'green', inactive: 'default', terminated: 'red', on_leave: 'orange',
};

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const departments = [...new Set(mockEmployees.map((e) => e.department))];
  const statuses = [...new Set(mockEmployees.map((e) => e.status))];

  const filtered = mockEmployees.filter((e) => {
    const matchesSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.code.toLowerCase().includes(search.toLowerCase());
    const matchesDept = !deptFilter || e.department === deptFilter;
    const matchesStatus = !statusFilter || e.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const columns = [
    { title: 'Code', dataIndex: 'code', key: 'code', sorter: (a: Employee, b: Employee) => a.code.localeCompare(b.code) },
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a: Employee, b: Employee) => a.name.localeCompare(b.name) },
    { title: 'Department', dataIndex: 'department', key: 'department', sorter: (a: Employee, b: Employee) => a.department.localeCompare(b.department) },
    { title: 'Job Title', dataIndex: 'jobTitle', key: 'jobTitle' },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (s: string) => <Tag color={statusColors[s]}>{s.replace('_', ' ').toUpperCase()}</Tag>,
    },
    {
      title: 'Actions', key: 'actions',
      render: (_: unknown, record: Employee) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/hr/employees/${record.id}`)} />
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setSelectedEmployee(record); setDrawerOpen(true); }} />
          <Popconfirm title="Delete this employee?" onConfirm={() => message.success('Employee deleted')}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Employees" subtitle="Manage your workforce">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/hr/employees/new')}>
          Add Employee
        </Button>
      </PageHeader>

      <Card>
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Search by name or code..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
            allowClear
          />
          <Select
            placeholder="Filter by department"
            value={deptFilter || undefined}
            onChange={(v) => setDeptFilter(v || '')}
            allowClear
            className="w-48"
            options={departments.map((d) => ({ value: d, label: d }))}
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter || undefined}
            onChange={(v) => setStatusFilter(v || '')}
            allowClear
            className="w-40"
            options={statuses.map((s) => ({ value: s, label: s.replace('_', ' ').toUpperCase() }))}
          />
        </div>

        <DataTable
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t: number) => `${t} employees` }}
        />
      </Card>

      <Drawer
        title={selectedEmployee ? `Edit: ${selectedEmployee.name}` : 'Employee Details'}
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedEmployee(null); }}
        width={480}
      >
        {selectedEmployee && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl text-blue-600 font-bold">{selectedEmployee.name.charAt(0)}</span>
              </div>
              <Text strong className="text-lg">{selectedEmployee.name}</Text>
              <br />
              <Text type="secondary">{selectedEmployee.jobTitle}</Text>
            </div>
            <div className="space-y-3 pt-4">
              <div><Text type="secondary">Code:</Text><br /><Text strong>{selectedEmployee.code}</Text></div>
              <div><Text type="secondary">Department:</Text><br /><Text strong>{selectedEmployee.department}</Text></div>
              <div><Text type="secondary">Email:</Text><br /><Text strong>{selectedEmployee.email}</Text></div>
              <div><Text type="secondary">Phone:</Text><br /><Text strong>{selectedEmployee.phone}</Text></div>
              <div><Text type="secondary">Status:</Text><br /><Tag color={statusColors[selectedEmployee.status]}>{selectedEmployee.status.replace('_', ' ').toUpperCase()}</Tag></div>
              <div><Text type="secondary">Hire Date:</Text><br /><Text strong>{selectedEmployee.hireDate}</Text></div>
            </div>
            <Space className="w-full mt-4">
              <Button type="primary" onClick={() => { message.success('Changes saved'); setDrawerOpen(false); }}>Save</Button>
              <Button onClick={() => { setDrawerOpen(false); }}>Cancel</Button>
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default EmployeeList;
