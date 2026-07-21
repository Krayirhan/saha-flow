import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WorkOrderList } from '@/features/work-orders/components/WorkOrderList';
import type { PaginatedResponse, WorkOrder } from '@/lib/api/types';

const mockWorkOrders: PaginatedResponse<WorkOrder> = {
  data: [
    {
      id: 'wo-001',
      title: 'Klima Arızası',
      description: 'Ofis kliması ısıtmıyor',
      status: 'pending',
      priority: 'high',
      customerId: 'c1',
      customerName: 'ABC Ltd.',
      technicianId: 't1',
      technicianName: 'Ahmet Yılmaz',
      scheduledDate: '2026-07-25T10:00:00Z',
      createdAt: '2026-07-20T08:00:00Z',
      updatedAt: '2026-07-20T08:00:00Z',
      tags: ['klima', 'acil'],
    },
    {
      id: 'wo-002',
      title: 'Elektrik Kontrolü',
      description: 'Ana pano periyodik bakım',
      status: 'in_progress',
      priority: 'medium',
      customerId: 'c2',
      customerName: 'XYZ A.Ş.',
      technicianName: 'Mehmet Kaya',
      scheduledDate: '2026-07-26T14:00:00Z',
      createdAt: '2026-07-19T12:00:00Z',
      updatedAt: '2026-07-21T09:00:00Z',
      tags: ['elektrik', 'bakım'],
    },
  ],
  total: 2,
  page: 1,
  limit: 20,
  totalPages: 1,
};

vi.mock('@/features/work-orders/hooks/useWorkOrders', () => ({
  useWorkOrders: () => ({
    workOrders: mockWorkOrders.data,
    total: mockWorkOrders.total,
    page: mockWorkOrders.page,
    totalPages: mockWorkOrders.totalPages,
    isLoading: false,
    error: null,
    filters: {},
    setFilters: vi.fn(),
    setPage: vi.fn(),
    sortKey: null,
    sortDirection: null,
    setSort: vi.fn(),
    mutate: vi.fn(),
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('WorkOrderList', () => {
  it('renders work orders table', () => {
    render(<WorkOrderList />);

    expect(screen.getByText('Klima Arızası')).toBeInTheDocument();
    expect(screen.getByText('Elektrik Kontrolü')).toBeInTheDocument();
  });

  it('shows customer names', () => {
    render(<WorkOrderList />);
    expect(screen.getByText('ABC Ltd.')).toBeInTheDocument();
    expect(screen.getByText('XYZ A.Ş.')).toBeInTheDocument();
  });

  it('shows status badges', () => {
    render(<WorkOrderList />);
    const bekliyorElements = screen.getAllByText('Bekliyor');
    expect(bekliyorElements.length).toBeGreaterThanOrEqual(1);
    const devamElements = screen.getAllByText('Devam Ediyor');
    expect(devamElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders new work order button', () => {
    render(<WorkOrderList />);
    expect(screen.getByText('Yeni İş Emri')).toBeInTheDocument();
  });
});
