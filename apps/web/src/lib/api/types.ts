export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  avatarUrl?: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  customerId: string;
  customerName?: string;
  technicianId?: string;
  technicianName?: string;
  scheduledDate?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  location?: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface WorkOrderStatusHistory {
  id: string;
  workOrderId: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  changedByName: string;
  note?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
  taxOffice?: string;
  notes?: string;
  totalWorkOrders: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalToday: number;
  pending: number;
  completedThisMonth: number;
  totalCollection: number;
  collectionCurrency: string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  correlationId?: string;
}
