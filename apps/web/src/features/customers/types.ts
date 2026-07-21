import type { Customer, PaginatedResponse } from '@/lib/api/types';

export type { Customer, PaginatedResponse };

export interface CustomerFilters {
  search?: string;
}

export interface UseCustomersReturn {
  customers: Customer[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: Error | null;
  filters: CustomerFilters;
  setFilters: (filters: CustomerFilters) => void;
  setPage: (page: number) => void;
  mutate: () => void;
}

export interface UseCustomerDetailReturn {
  customer: Customer | undefined;
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}
