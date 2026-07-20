import { ReactNode, useState } from 'react';
import { Card, Tabs, Button, Space, Spin } from 'antd';
import { SaveOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';

interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
}

interface DetailFormProps {
  title: string;
  tabs: TabItem[];
  loading?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  onEdit?: () => void;
  editMode?: boolean;
  extra?: ReactNode;
}

export function DetailForm({
  title,
  tabs,
  loading = false,
  onSave,
  onCancel,
  onEdit,
  editMode = false,
  extra,
}: DetailFormProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key);

  return (
    <Spin spinning={loading}>
      <Card
        title={title}
        extra={
          <Space>
            {extra}
            {editMode ? (
              <>
                <Button icon={<CloseOutlined />} onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="primary" icon={<SaveOutlined />} onClick={onSave}>
                  Save
                </Button>
              </>
            ) : (
              <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
                Edit
              </Button>
            )}
          </Space>
        }
        className="shadow-sm"
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs} />
      </Card>
    </Spin>
  );
}
