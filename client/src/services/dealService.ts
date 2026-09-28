import apiClient from './apiClient';
import type { Deal, CreateDealInput } from '@/types';

interface DealFilters {
  search?: string;
  stage?: string;
  assignedTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function fetchDealsRequest(filters: DealFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.stage) params.append('stage', filters.stage);
  if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const { data } = await apiClient.get<{ success: boolean; data: { deals: Deal[]; total: number } }>(`/deals?${params}`);
  return data.data;
}

export async function createDealRequest(input: CreateDealInput) {
  const { data } = await apiClient.post<{ success: boolean; data: Deal }>('/deals', input);
  return data.data;
}

export async function updateDealRequest(id: string, input: Partial<CreateDealInput>) {
  const { data } = await apiClient.put<{ success: boolean; data: Deal }>(`/deals/${id}`, input);
  return data.data;
}

export async function deleteDealRequest(id: string) {
  await apiClient.delete(`/deals/${id}`);
}

export async function fetchDealStatsRequest() {
  const { data } = await apiClient.get<{ success: boolean; data: { total: number; byStage: Record<string, number>; totalValue: number; wonValue: number } }>('/deals/stats');
  return data.data;
}
