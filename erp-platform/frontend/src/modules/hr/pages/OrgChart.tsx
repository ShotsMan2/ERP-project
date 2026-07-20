import { useState } from 'react';
import { Card, Typography, Space, Modal, Descriptions, Tag, Avatar } from 'antd';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

interface OrgNode {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  children?: OrgNode[];
}

const orgData: OrgNode = {
  id: '1', name: 'Alice Johnson', title: 'CEO',
  children: [
    {
      id: '2', name: 'Bob Williams', title: 'CTO',
      children: [
        { id: '5', name: 'John Smith', title: 'Engineering Director', children: [
          { id: '8', name: 'Emily Davis', title: 'Senior Developer' },
          { id: '9', name: 'James Wilson', title: 'DevOps Lead' },
          { id: '10', name: 'Lisa Brown', title: 'Frontend Developer' },
        ]},
        { id: '6', name: 'Mike Brown', title: 'IT Manager' },
      ],
    },
    {
      id: '3', name: 'Carol Martinez', title: 'CFO',
      children: [
        { id: '7', name: 'Sarah Johnson', title: 'Finance Manager' },
        { id: '11', name: 'Tom Green', title: 'Accountant' },
      ],
    },
    {
      id: '4', name: 'David Lee', title: 'COO',
      children: [
        { id: '12', name: 'Anna Taylor', title: 'Operations Manager' },
        { id: '13', name: 'Mark White', title: 'HR Director' },
      ],
    },
  ],
};

const TreeNode: React.FC<{ node: OrgNode; onSelect: (n: OrgNode) => void; level?: number }> = ({ node, onSelect, level = 0 }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer min-w-[160px] text-center"
        onClick={() => onSelect(node)}
        style={{ borderLeft: `4px solid ${level === 0 ? '#1677ff' : level === 1 ? '#52c41a' : '#faad14'}` }}
      >
        <Avatar size={48} icon={<UserOutlined />} className="mb-2" />
        <div className="font-semibold text-sm">{node.name}</div>
        <div className="text-xs text-gray-500">{node.title}</div>
      </div>
      {node.children && node.children.length > 0 && (
        <div className="mt-4">
          <div className="w-px h-4 bg-gray-300 mx-auto" />
          <div className="flex gap-6 justify-center">
            {node.children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-4 bg-gray-300" />
                <TreeNode node={child} onSelect={onSelect} level={level + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const OrgChart: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelect = (node: OrgNode) => {
    setSelectedNode(node);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <PageHeader title="Organization Chart" subtitle="Company hierarchy and reporting structure" />

      <Card>
        <div className="overflow-x-auto py-8">
          <div className="min-w-[800px] flex justify-center">
            <TreeNode node={orgData} onSelect={handleSelect} />
          </div>
        </div>
      </Card>

      <Modal
        title={selectedNode?.name}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        {selectedNode && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="Name">{selectedNode.name}</Descriptions.Item>
            <Descriptions.Item label="Title">{selectedNode.title}</Descriptions.Item>
            <Descriptions.Item label="Department">
              <Tag>Engineering</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color="green">Active</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedNode.name.toLowerCase().replace(' ', '.')}@company.com
            </Descriptions.Item>
            <Descriptions.Item label="Direct Reports">
              {selectedNode.children?.length || 0}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default OrgChart;
