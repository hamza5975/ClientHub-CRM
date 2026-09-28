import apiClient from './apiClient';
import type { Task, CreateTaskInput } from '@/types';

interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function fetchTasksRequest(filters: TaskFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const { data } = await apiClient.get<{ success: boolean; data: { tasks: Task[]; total: number } }>(`/tasks?${params}`);
  return data.data;
}

export async function createTaskRequest(input: CreateTaskInput) {
  const { data } = await apiClient.post<{ success: boolean; data: Task }>('/tasks', input);
  return data.data;
}

export async function updateTaskRequest(id: string, input: Partial<CreateTaskInput>) {
  const { data } = await apiClient.put<{ success: boolean; data: Task }>(`/tasks/${id}`, input);
  return data.data;
}

export async function deleteTaskRequest(id: string) {
  await apiClient.delete(`/tasks/${id}`);
}
