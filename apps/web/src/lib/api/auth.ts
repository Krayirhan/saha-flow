import { apiClient, apiGet, apiPost } from './client';
import type { AuthUser } from './types';

export async function login(email: string, password: string): Promise<AuthUser> {
  return apiPost<AuthUser>('/auth/login', { email, password });
}

export async function logout(): Promise<void> {
  await apiPost<void>('/auth/logout');
}

export async function getCurrentUser(): Promise<AuthUser> {
  return apiGet<AuthUser>('/auth/me');
}

export async function refreshToken(): Promise<AuthUser> {
  return apiClient<AuthUser>('/auth/refresh', { method: 'POST', skipAuthRedirect: true });
}
