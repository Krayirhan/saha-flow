'use client';

import { Table, type Column } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useWorkOrders } from '../hooks/useWorkOrders';
import { formatDate, truncateText } from '@/lib/utils/format';
import { WORK_ORDER_STATUSES } from '@/lib/validation/formats';
import { Plus, Search, Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { WorkOrder } from '@/lib/api/types';

const statusOptions = [
  { value: '', label: 'Tüm Durumlar' },
  ...WORK_ORDER_STATUSES.map((s) => ({ value: s.value, label: s.label })),
];

const priorityLabels: Record<string, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
  critical: 'Kritik',
};

const priorityColors: Record<string, string> = {
  low: 'text-white/50',
  medium: 'text-yellow-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
};

export function WorkOrderList() {
  const router = useRouter();
  const {
    workOrders,
    total,
    page,
    totalPages,
    isLoading,
    error,
    filters,
    setFilters,
    setPage,
    sortKey,
    sortDirection,
    setSort,
    mutate,
  } = useWorkOrders();

  const columns: Column<WorkOrder>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: false,
      render: (wo) => (
        <button
          onClick={() => router.push(`/work-orders/${wo.id}`)}
          className="font-mono text-xs text-primary-400 hover:text-primary-300 hover:underline"
        >
          {wo.id.slice(0, 8)}...
        </button>
      ),
      className: 'w-24',
    },
    {
      key: 'title',
      header: 'İş Emri',
      sortable: true,
      render: (wo) => (
        <button
          onClick={() => router.push(`/work-orders/${wo.id}`)}
          className="text-left hover:text-primary-400"
        >
          <p className="font-medium text-white">{truncateText(wo.title, 40)}</p>
          <p className="text-xs text-white/40">{truncateText(wo.description, 50)}</p>
        </button>
      ),
    },
    {
      key: 'customerName',
      header: 'Müşteri',
      sortable: true,
      render: (wo) => (
        <span className="text-white/70">{wo.customerName ?? '-'}</span>
      ),
      className: 'w-40',
    },
    {
      key: 'status',
      header: 'Durum',
      sortable: true,
      render: (wo) => <StatusBadge status={wo.status} />,
      className: 'w-32',
    },
    {
      key: 'priority',
      header: 'Öncelik',
      sortable: true,
      render: (wo) => (
        <span className={priorityColors[wo.priority] ?? 'text-white/60'}>
          {priorityLabels[wo.priority] ?? wo.priority}
        </span>
      ),
      className: 'w-24',
    },
    {
      key: 'technicianName',
      header: 'Teknisyen',
      sortable: true,
      render: (wo) => (
        <span className="text-white/70">{wo.technicianName ?? 'Atanmadı'}</span>
      ),
      className: 'w-32',
    },
    {
      key: 'scheduledDate',
      header: 'Planlanan',
      sortable: true,
      render: (wo) => (
        <span className="text-sm text-white/60">{formatDate(wo.scheduledDate)}</span>
      ),
      className: 'w-28',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="w-full max-w-xs">
            <Input
              placeholder="Ara..."
              value={filters.search ?? ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
              aria-label="İş emri ara"
            />
          </div>
          <Select
            options={statusOptions}
            value={filters.status ?? ''}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value || undefined })
            }
            className="w-40"
            aria-label="Durum filtrele"
          />
        </div>

        <Button onClick={() => router.push('/work-orders/new')}>
          <Plus className="h-4 w-4" />
          Yeni İş Emri
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner text="İş emirleri yükleniyor..." />
      ) : error ? (
        <ErrorState message="İş emirleri yüklenirken bir hata oluştu." onRetry={() => mutate()} />
      ) : workOrders.length === 0 ? (
        <EmptyState
          icon={<Wrench className="h-16 w-16" />}
          title="Henüz iş emri yok"
          message="Yeni bir iş emri oluşturarak başlayabilirsiniz."
          actionLabel="Yeni İş Emri"
          onAction={() => router.push('/work-orders/new')}
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={workOrders}
            keyExtractor={(wo) => wo.id}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={setSort}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={20}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
