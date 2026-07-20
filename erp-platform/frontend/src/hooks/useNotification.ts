import { useCallback } from 'react';
import { notification } from 'antd';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

export function useNotification() {
  const [api, contextHolder] = notification.useNotification();

  const notify = useCallback(
    (type: NotificationType, message: string, description?: string) => {
      api[type]({ message, description, placement: 'topRight' });
    },
    [api]
  );

  return { notify, contextHolder };
}
