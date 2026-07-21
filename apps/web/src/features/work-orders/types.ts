import type { WorkOrder, PaginatedResponse } from '@/lib/api/types';
import type { SearchParams } from '@/lib/validation/schemas';

export type { WorkOrder, PaginatedResponse };

export interface WorkOrderFilters {
  status?: string;
  technicianId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface UseWorkOrdersReturn {
  workOrders: WorkOrder[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: Error | null;
  filters: WorkOrderFilters;
  setFilters: (filters: WorkOrderFilters) => void;
  setPage: (page: number) => void;
  sortKey: string | null;
  sortDirection: 'asc' | 'desc' | null;
  setSort: (key: string) => void;
  mutate: () => void;
}

export interface UseWorkOrderDetailReturn {
  workOrder: WorkOrder | undefined;
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}
