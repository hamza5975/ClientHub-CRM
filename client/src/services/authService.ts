import apiClient from './apiClient';
import type { AuthResponse, User } from '@/types';

export async function loginRequest(email: string, password: string) {
  const { data } = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/login', { email, password });
  return data.data;
}

export async function registerRequest(name: string, email: string, password: string, role?: string) {
  const { data } = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/register', { name, email, password, role });
  return data.data;
}

export async function getMeRequest() {
  const { data } = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
  return data.data;
}

export async function updateProfileRequest(profile: Partial<User>) {
  const { data } = await apiClient.put<{ success: boolean; data: User }>('/auth/profile', profile);
  return data.data;
}

export async function changePasswordRequest(currentPassword: string, newPassword: string) {
  const { data } = await apiClient.put<{ success: boolean; message: string }>('/auth/change-password', { currentPassword, newPassword });
  return data;
}

export async function getAllUsersRequest() {
  const { data } = await apiClient.get<{ success: boolean; data: User[] }>('/auth/users');
  return data.data;
}
