'use client';

import useSWR from 'swr';
import { getWorkOrders, getWorkOrderById, getWorkOrderStatusHistory } from '@/lib/api/work-orders';
import type { WorkOrder, PaginatedResponse, WorkOrderStatusHistory } from '@/lib/api/types';
import type { SearchParams } from '@/lib/validation/schemas';
import { useState, useCallback } from 'react';
import type { WorkOrderFilters, UseWorkOrdersReturn } from '../types';

export function useWorkOrders(initialFilters?: WorkOrderFilters): UseWorkOrdersReturn {
  const [filters, setFilters] = useState<WorkOrderFilters>(initialFilters ?? {});
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const params: Partial<SearchParams> = {
    page,
    limit: 20,
    status: filters.status,
    search: filters.search,
    sortBy: sortKey ?? 'createdAt',
    sortOrder: sortDirection ?? 'desc',
  };

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<WorkOrder>>(
    ['/api/work-orders', params],
    () => getWorkOrders(params),
    { keepPreviousData: true },
  );

  const setSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        if (sortDirection === 'asc') setSortDirection('desc');
        else if (sortDirection === 'desc') {
          setSortKey(null);
          setSortDirection(null);
        } else setSortDirection('asc');
      } else {
        setSortKey(key);
        setSortDirection('asc');
      }
    },
    [sortKey, sortDirection],
  );

  return {
    workOrders: data?.data ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? page,
    totalPages: data?.totalPages ?? 1,
    isLoading,
    error: error ?? null,
    filters,
    setFilters,
    setPage,
    sortKey,
    sortDirection,
    setSort,
    mutate: () => mutate(),
  };
}

export function useWorkOrderDetail(id: string) {
  const { data, error, isLoading, mutate } = useSWR<WorkOrder>(
    id ? `/api/work-orders/${id}` : null,
    () => getWorkOrderById(id),
  );

  const { data: statusHistory } = useSWR<WorkOrderStatusHistory[]>(
    id ? `/api/work-orders/${id}/status-history` : null,
    () => getWorkOrderStatusHistory(id),
  );

  return {
    workOrder: data,
    statusHistory: statusHistory ?? [],
    isLoading,
    error: error ?? null,
    mutate: () => mutate(),
  };
}
