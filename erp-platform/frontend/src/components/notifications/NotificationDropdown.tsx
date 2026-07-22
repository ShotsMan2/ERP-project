import { useEffect } from 'react';
import { Dropdown, List, Badge, Button, Typography, Empty, Spin, Tag } from 'antd';
import {
  BellOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useNotificationStore } from '@/store/notificationStore';
import { useFetchNotifications } from '@/hooks/useFetchNotifications';
import { api } from '@/services/api';
import { endpoints } from '@/services/endpoints';

const { Text } = Typography;

const typeIcon: Record<string, React.ReactNode> = {
  info: <InfoCircleOutlined style={{ color: '#1677ff' }} />,
  success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
  warning: <WarningOutlined style={{ color: '#faad14' }} />,
  error: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
};

export default function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const { loading } = useFetchNotifications();

  const handleMarkAllRead = async () => {
    try {
      await api.put(endpoints.notifications.markAllRead);
      markAllAsRead();
    } catch {
      // silent
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.put(endpoints.notifications.markRead(id));
      markAsRead(id);
    } catch {
      // silent
    }
  };

  const dropdownContent = (
    <div className="w-80 max-h-96 overflow-auto bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-slate-700">
        <Text strong>Notifications</Text>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={handleMarkAllRead} icon={<CheckOutlined />}>
            Mark all read
          </Button>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center py-8"><Spin /></div>
      ) : notifications.length === 0 ? (
        <Empty description="No notifications" className="py-8" />
      ) : (
        <List
          dataSource={notifications.slice(0, 10)}
          renderItem={(item) => (
            <List.Item
              className={`px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 ${!item.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
              onClick={() => !item.read && handleMarkRead(item.id)}
            >
              <List.Item.Meta
                avatar={typeIcon[item.type] || typeIcon.info}
                title={
                  <span className="flex items-center gap-2">
                    {item.title}
                    {!item.read && <Tag color="blue" className="text-xs">new</Tag>}
                  </span>
                }
                description={
                  <Text type="secondary" className="text-xs line-clamp-2">
                    {item.body}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      placement="bottomRight"
      arrow
    >
      <Badge count={unreadCount} size="small">
        <Button type="text" icon={<BellOutlined />} className="text-lg" />
      </Badge>
    </Dropdown>
  );
}
