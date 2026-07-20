import { useParams } from 'react-router-dom';
import { Descriptions, Tag } from 'antd';
import { DetailForm } from '@/components/data/DetailForm';

export default function EmployeeDetail() {
  const { id } = useParams();

  const tabs = [
    {
      key: 'personal',
      label: 'Personal Information',
      content: (
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="First Name">John</Descriptions.Item>
          <Descriptions.Item label="Last Name">Doe</Descriptions.Item>
          <Descriptions.Item label="Email">john.doe@company.com</Descriptions.Item>
          <Descriptions.Item label="Phone">+1 (555) 123-4567</Descriptions.Item>
          <Descriptions.Item label="Department">Engineering</Descriptions.Item>
          <Descriptions.Item label="Position">Senior Developer</Descriptions.Item>
          <Descriptions.Item label="Hire Date">2022-03-15</Descriptions.Item>
          <Descriptions.Item label="Status"><Tag color="green">Active</Tag></Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'employment',
      label: 'Employment Details',
      content: (
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="Employee Code">EMP001</Descriptions.Item>
          <Descriptions.Item label="Type">Full-time</Descriptions.Item>
          <Descriptions.Item label="Reports To">Sarah Johnson</Descriptions.Item>
          <Descriptions.Item label="Grade">L4</Descriptions.Item>
          <Descriptions.Item label="Cost Center">ENG-001</Descriptions.Item>
        </Descriptions>
      ),
    },
  ];

  return <DetailForm title={`Employee: ${id}`} tabs={tabs} />;
}
