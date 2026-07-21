import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type { PaginatedResponse, WorkOrder, WorkOrderStatusHistory } from './types';
import type { WorkOrderCreateInput, SearchParams } from '@/lib/validation/schemas';

export async function getWorkOrders(params?: Partial<SearchParams>): Promise<PaginatedResponse<WorkOrder>> {
  return apiGet<PaginatedResponse<WorkOrder>>('/work-orders', params as Record<string, string | number | boolean | undefined>);
}

export async function getWorkOrderById(id: string): Promise<WorkOrder> {
  return apiGet<WorkOrder>(`/work-orders/${id}`);
}

export async function createWorkOrder(data: WorkOrderCreateInput): Promise<WorkOrder> {
  return apiPost<WorkOrder>('/work-orders', data);
}

export async function updateWorkOrder(id: string, data: Partial<WorkOrderCreateInput>): Promise<WorkOrder> {
  return apiPut<WorkOrder>(`/work-orders/${id}`, data);
}

export async function deleteWorkOrder(id: string): Promise<void> {
  return apiDelete(`/work-orders/${id}`);
}

export async function getWorkOrderStatusHistory(id: string): Promise<WorkOrderStatusHistory[]> {
  return apiGet<WorkOrderStatusHistory[]>(`/work-orders/${id}/status-history`);
}

export async function updateWorkOrderStatus(id: string, status: string, note?: string): Promise<WorkOrder> {
  return apiPost<WorkOrder>(`/work-orders/${id}/status`, { status, note });
}
