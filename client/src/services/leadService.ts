import apiClient from './apiClient';
import type { Lead, CreateLeadInput } from '@/types';

interface LeadFilters {
  search?: string;
  stage?: string;
  assignedTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function fetchLeadsRequest(filters: LeadFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.stage) params.append('stage', filters.stage);
  if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const { data } = await apiClient.get<{ success: boolean; data: { leads: Lead[]; total: number } }>(`/leads?${params}`);
  return data.data;
}

export async function createLeadRequest(input: CreateLeadInput) {
  const { data } = await apiClient.post<{ success: boolean; data: Lead }>('/leads', input);
  return data.data;
}

export async function updateLeadRequest(id: string, input: Partial<CreateLeadInput>) {
  const { data } = await apiClient.put<{ success: boolean; data: Lead }>(`/leads/${id}`, input);
  return data.data;
}

export async function deleteLeadRequest(id: string) {
  await apiClient.delete(`/leads/${id}`);
}

export async function fetchLeadStatsRequest() {
  const { data } = await apiClient.get<{ success: boolean; data: { total: number; byStage: Record<string, number>; totalValue: number } }>('/leads/stats');
  return data.data;
}
