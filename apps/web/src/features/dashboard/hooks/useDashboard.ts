'use client';

import useSWR from 'swr';
import { apiGet } from '@/lib/api/client';
import { getWorkOrders } from '@/lib/api/work-orders';
import type { DashboardStats, PaginatedResponse, WorkOrder } from '@/lib/api/types';

const RECENT_WORK_ORDERS_PARAMS = { limit: 10, sortBy: 'createdAt', sortOrder: 'desc' as const };

export interface DashboardData {
  stats: DashboardStats | null;
  recentWorkOrders: WorkOrder[];
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

export function useDashboard(): DashboardData {
  const { data: stats, error: statsError, isLoading: statsLoading, mutate: mutateStats } = useSWR<DashboardStats>(
    '/api/dashboard/stats',
    () => apiGet<DashboardStats>('/dashboard/stats'),
    { refreshInterval: 30000 },
  );

  const { data: workOrdersPage, error: woError, isLoading: woLoading, mutate: mutateWo } = useSWR<PaginatedResponse<WorkOrder>>(
    ['/api/dashboard/recent-work-orders', RECENT_WORK_ORDERS_PARAMS],
    () => getWorkOrders(RECENT_WORK_ORDERS_PARAMS),
    { refreshInterval: 30000 },
  );

  return {
    stats: stats ?? null,
    recentWorkOrders: workOrdersPage?.data ?? [],
    isLoading: statsLoading || woLoading,
    error: statsError ?? woError ?? null,
    mutate: () => {
      mutateStats();
      mutateWo();
    },
  };
}
