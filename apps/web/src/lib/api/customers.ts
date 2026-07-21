import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type { PaginatedResponse, Customer } from './types';
import type { CustomerInput, SearchParams } from '@/lib/validation/schemas';

export async function getCustomers(params?: Partial<SearchParams>): Promise<PaginatedResponse<Customer>> {
  return apiGet<PaginatedResponse<Customer>>('/customers', params as Record<string, string | number | boolean | undefined>);
}

export async function getCustomerById(id: string): Promise<Customer> {
  return apiGet<Customer>(`/customers/${id}`);
}

export async function createCustomer(data: CustomerInput): Promise<Customer> {
  return apiPost<Customer>('/customers', data);
}

export async function updateCustomer(id: string, data: Partial<CustomerInput>): Promise<Customer> {
  return apiPut<Customer>(`/customers/${id}`, data);
}

export async function deleteCustomer(id: string): Promise<void> {
  return apiDelete(`/customers/${id}`);
}

export async function searchCustomers(query: string): Promise<Customer[]> {
  return apiGet<Customer[]>('/customers/search', { q: query });
}
