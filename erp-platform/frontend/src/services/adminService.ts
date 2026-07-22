import { api } from './api';
import { endpoints } from './endpoints';

export interface SystemOverview {
  total_users: number;
  total_companies: number;
  active_sessions: number;
  pending_tasks: number;
  failed_tasks: number;
  storage_used_gb: number;
  api_requests_24h: number;
  error_rate_24h: number;
  avg_response_time_ms: number;
  uptime_percentage: number;
}

export interface Backup {
  id: string;
  filename: string;
  type: string;
  size_bytes: number | null;
  status: string;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  restored_at: string | null;
  restored_by: string | null;
  created_by: string | null;
  created_at: string;
}

export interface HealthCheck {
  id: string;
  service_name: string;
  status: string;
  latency_ms: number | null;
  error_message: string | null;
  checked_at: string;
}

export interface QueueSummary {
  queue_name: string;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  total: number;
}

export interface QueueTask {
  id: string;
  task_id: string;
  queue_name: string;
  task_name: string;
  status: string;
  retry_count: number;
  max_retries: number;
  priority: number;
  error_message: string | null;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_email: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  module: string;
  details: string | null;
  ip_address: string | null;
  duration_ms: number | null;
  status: string;
  created_at: string;
}

function apiPrefix(path: string): string {
  return `/api/v1${path}`;
}

export const adminService = {
  getOverview: () => api.get<SystemOverview>(apiPrefix(endpoints.admin.overview)).then(r => r.data),

  getHealth: () => api.get(apiPrefix(endpoints.admin.health)).then(r => r.data),
  runHealthCheck: () => api.post<HealthCheck[]>(apiPrefix(endpoints.admin.healthCheck)).then(r => r.data),
  getHealthHistory: (serviceName?: string) =>
    api.get<HealthCheck[]>(apiPrefix(endpoints.admin.healthHistory), { params: { service_name: serviceName } }).then(r => r.data),

  listBackups: (params?: { company_id?: string; status?: string; page?: number; size?: number }) =>
    api.get<Backup[]>(apiPrefix(endpoints.admin.backups), { params }).then(r => r.data),
  getBackup: (id: string) => api.get<Backup>(apiPrefix(endpoints.admin.backupDetail(id))).then(r => r.data),
  createBackup: (type: string = 'full') => api.post<Backup>(apiPrefix(endpoints.admin.backupCreate), { type }).then(r => r.data),
  deleteBackup: (id: string) => api.delete(apiPrefix(endpoints.admin.backupDelete(id))),
  restoreBackup: (id: string) => api.post<Backup>(apiPrefix(endpoints.admin.backupRestore(id))).then(r => r.data),

  getQueueSummary: () => api.get<QueueSummary[]>(apiPrefix(endpoints.admin.queueSummary)).then(r => r.data),
  listQueueTasks: (params?: { queue_name?: string; status?: string; page?: number; size?: number }) =>
    api.get<QueueTask[]>(apiPrefix(endpoints.admin.queueTasks), { params }).then(r => r.data),
  retryTask: (taskId: string) => api.post<QueueTask>(apiPrefix(endpoints.admin.queueTaskRetry(taskId))).then(r => r.data),
  cancelTask: (taskId: string) => api.post<QueueTask>(apiPrefix(endpoints.admin.queueTaskCancel(taskId))).then(r => r.data),
  purgeQueue: (queueName: string) => api.post(apiPrefix(endpoints.admin.queuePurge(queueName))).then(r => r.data),

  listActivities: (params?: { user_id?: string; module?: string; action?: string; status?: string; page?: number; size?: number }) =>
    api.get<ActivityLog[]>(apiPrefix(endpoints.admin.activities), { params }).then(r => r.data),
};
