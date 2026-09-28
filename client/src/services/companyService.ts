import apiClient from './apiClient';
import type { Company, CreateCompanyInput } from '@/types';

interface CompanyFilters {
  search?: string;
  industry?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function fetchCompaniesRequest(filters: CompanyFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.industry) params.append('industry', filters.industry);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const { data } = await apiClient.get<{ success: boolean; data: { companies: Company[]; total: number } }>(`/companies?${params}`);
  return data.data;
}

export async function createCompanyRequest(input: CreateCompanyInput) {
  const { data } = await apiClient.post<{ success: boolean; data: Company }>('/companies', input);
  return data.data;
}

export async function updateCompanyRequest(id: string, input: Partial<CreateCompanyInput>) {
  const { data } = await apiClient.put<{ success: boolean; data: Company }>(`/companies/${id}`, input);
  return data.data;
}

export async function deleteCompanyRequest(id: string) {
  await apiClient.delete(`/companies/${id}`);
}
