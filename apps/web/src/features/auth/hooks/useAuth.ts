'use client';

import useSWR from 'swr';
import { getCurrentUser, login as loginApi, logout as logoutApi } from '@/lib/api/auth';
import { demoUser, enableDemoMode, disableDemoMode } from '@/lib/api/demo';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { AuthUser } from '@/lib/api/types';
import type { UseAuthReturn } from '../types';

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    data: user,
    mutate,
    isLoading,
    error: swrError,
  } = useSWR<AuthUser>('/api/auth/me', getCurrentUser, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    errorRetryCount: 1,
  });

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const userData = await loginApi(email, password);
      await mutate(userData, false);
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Giriş yapılırken bir hata oluştu';
      setError(message);
      throw err;
    }
  };

  const loginDemo = async () => {
    setError(null);
    enableDemoMode();
    await mutate(demoUser, false);
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      disableDemoMode();
      await mutate(undefined, false);
      router.push('/login');
    }
  };

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user && !swrError,
    error: error ?? (swrError ? 'Oturum bilgisi alınamadı' : null),
    login,
    loginDemo,
    logout,
    mutate: () => mutate(),
  };
}
