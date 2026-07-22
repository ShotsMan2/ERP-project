import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { endpoints } from '@/services/endpoints';
import { useNotificationStore } from '@/store/notificationStore';

interface ApiNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
  data?: Record<string, unknown>;
}

export function useFetchNotifications() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setNotifications = useNotificationStore((s) => s.setNotifications);

  useEffect(() => {
    let cancelled = false;

    async function fetchNotifications() {
      try {
        setLoading(true);
        const response = await api.get<ApiNotification[]>(endpoints.notifications.list);
        if (cancelled) return;

        const mapped = response.data.map((n) => ({
          id: n.id,
          type: (['info', 'success', 'warning', 'error'].includes(n.type) ? n.type : 'info') as 'info' | 'success' | 'warning' | 'error',
          title: n.title,
          body: n.body || '',
          read: n.read_at !== null,
          createdAt: n.created_at,
          data: n.data,
        }));

        setNotifications(mapped);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load notifications');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNotifications();

    return () => { cancelled = true; };
  }, [setNotifications]);

  return { loading, error };
}
