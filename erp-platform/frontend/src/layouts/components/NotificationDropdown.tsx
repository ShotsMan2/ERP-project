import { Badge, Button, Dropdown, Typography, Empty, Space, Tag } from 'antd';
import {
  BellOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  CheckOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNotificationStore } from '@/store/notificationStore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslation } from 'react-i18next';

dayjs.extend(relativeTime);

const { Text } = Typography;

const typeIconMap = {
  info: <InfoCircleOutlined className="text-blue-500" />,
  success: <CheckCircleOutlined className="text-green-500" />,
  warning: <WarningOutlined className="text-yellow-500" />,
  error: <CloseCircleOutlined className="text-red-500" />,
};

const typeColorMap = {
  info: 'blue',
  success: 'green',
  warning: 'gold',
  error: 'red',
} as const;

export default function NotificationDropdown() {
  const { t } = useTranslation();
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } =
    useNotificationStore();

  const content = (
    <div className="w-80 max-h-96 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-slate-600">
        <Text strong>{t('common.notifications', 'Notifications')}</Text>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={markAllAsRead}>
            {t('notifications.markAllRead', 'Mark all read')}
          </Button>
        )}
      </div>
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <Empty
            description={t('notifications.empty', 'No notifications')}
            className="py-8"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 border-b border-gray-100 dark:border-slate-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-sm">{typeIconMap[notification.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <Text strong className="text-sm truncate">
                      {notification.title}
                    </Text>
                    {!notification.read && (
                      <Tag color={typeColorMap[notification.type]} className="!text-xs !px-1 !py-0 !mr-0">
                        {t('common.new', 'New')}
                      </Tag>
                    )}
                  </div>
                  <Text className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {notification.body}
                  </Text>
                  <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
                    {dayjs(notification.createdAt).fromNow()}
                  </Text>
                </div>
                <Space size={0}>
                  {!notification.read && (
                    <Button
                      type="text"
                      size="small"
                      icon={<CheckOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    />
                  )}
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  />
                </Space>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <Dropdown
      trigger={['click']}
      dropdownRender={() => content}
      placement="bottomRight"
      overlayClassName="notification-dropdown"
    >
      <Badge count={unreadCount} size="small">
        <Button type="text" icon={<BellOutlined />} className="!flex items-center" />
      </Badge>
    </Dropdown>
  );
}
