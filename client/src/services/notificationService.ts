import apiClient from './apiClient';
import type { Notification } from '@/types';

interface NotificationFilters {
  type?: string;
  read?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function fetchNotificationsRequest(filters: NotificationFilters = {}) {
  const params = new URLSearchParams();
  if (filters.type) params.append('type', filters.type);
  if (filters.read !== undefined) params.append('read', String(filters.read));
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const { data } = await apiClient.get<{ success: boolean; data: { notifications: Notification[]; total: number } }>(`/notifications?${params}`);
  return data.data;
}

export async function markNotificationAsReadRequest(id: string) {
  const { data } = await apiClient.put<{ success: boolean; data: Notification }>(`/notifications/${id}/read`);
  return data.data;
}

export async function markAllNotificationsAsReadRequest() {
  await apiClient.put('/notifications/mark-all-read');
}

export async function deleteNotificationRequest(id: string) {
  await apiClient.delete(`/notifications/${id}`);
}

export async function fetchUnreadCountRequest() {
  const { data } = await apiClient.get<{ success: boolean; data: { count: number } }>('/notifications/unread-count');
  return data.data.count;
}
