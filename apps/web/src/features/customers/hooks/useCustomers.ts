'use client';

import useSWR from 'swr';
import { getCustomers, getCustomerById } from '@/lib/api/customers';
import type { Customer, PaginatedResponse } from '@/lib/api/types';
import type { SearchParams } from '@/lib/validation/schemas';
import { useState } from 'react';
import type { CustomerFilters, UseCustomersReturn } from '../types';

export function useCustomers(initialFilters?: CustomerFilters): UseCustomersReturn {
  const [filters, setFilters] = useState<CustomerFilters>(initialFilters ?? {});
  const [page, setPage] = useState(1);

  const params: Partial<SearchParams> = {
    page,
    limit: 20,
    search: filters.search,
  };

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Customer>>(
    ['/api/customers', params],
    () => getCustomers(params),
    { keepPreviousData: true },
  );

  return {
    customers: data?.data ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? page,
    totalPages: data?.totalPages ?? 1,
    isLoading,
    error: error ?? null,
    filters,
    setFilters,
    setPage,
    mutate: () => mutate(),
  };
}

export function useCustomerDetail(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Customer>(
    id ? `/api/customers/${id}` : null,
    () => getCustomerById(id),
  );

  return {
    customer: data,
    isLoading,
    error: error ?? null,
    mutate: () => mutate(),
  };
}
