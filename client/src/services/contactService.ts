import apiClient from './apiClient';
import type { Contact, CreateContactInput } from '@/types';

interface ContactFilters {
  search?: string;
  company?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function fetchContactsRequest(filters: ContactFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.company) params.append('company', filters.company);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const { data } = await apiClient.get<{ success: boolean; data: { contacts: Contact[]; total: number } }>(`/contacts?${params}`);
  return data.data;
}

export async function createContactRequest(input: CreateContactInput) {
  const { data } = await apiClient.post<{ success: boolean; data: Contact }>('/contacts', input);
  return data.data;
}

export async function updateContactRequest(id: string, input: Partial<CreateContactInput>) {
  const { data } = await apiClient.put<{ success: boolean; data: Contact }>(`/contacts/${id}`, input);
  return data.data;
}

export async function deleteContactRequest(id: string) {
  await apiClient.delete(`/contacts/${id}`);
}
