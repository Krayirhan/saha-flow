'use client';

import { Table, type Column } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
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
import { Plus, Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { WorkOrder } from '@/lib/api/types';

const statusOptions = [
  { value: '', label: 'Tüm Durumlar' },
  ...WORK_ORDER_STATUSES.map((s) => ({ value: s.value, label: s.label })),
];

const priorityMap: Record<string, { color: string; label: string }> = {
  low:      { color: 'var(--sf-text-muted)', label: 'Düşük' },
  medium:   { color: 'var(--sf-in-progress)', label: 'Orta' },
  high:     { color: '#ff9060', label: 'Yüksek' },
  critical: { color: 'var(--sf-sla-risk)', label: 'Kritik' },
};

export function WorkOrderList() {
  const router = useRouter();
  const { workOrders, total, page, totalPages, isLoading, error, filters, setFilters, setPage, sortKey, sortDirection, setSort, mutate } = useWorkOrders();

  const columns: Column<WorkOrder>[] = [
    {
      key: 'title',
      header: 'İş Emri',
      sortable: true,
      render: (wo) => (
        <button onClick={() => router.push(`/work-orders/${wo.id}`)} className="text-left w-full">
          <p className="font-medium truncate max-w-[260px]" style={{ color: 'var(--sf-text)' }}>{wo.title}</p>
        </button>
      ),
      className: 'min-w-[200px]',
    },
    {
      key: 'customerName',
      header: 'Müşteri',
      sortable: true,
      render: (wo) => <span className="truncate block max-w-[140px]" style={{ color: 'var(--sf-text-2)' }}>{wo.customerName ?? '—'}</span>,
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
      render: (wo) => {
        const p = priorityMap[wo.priority];
        return <span className="text-sm font-medium" style={{ color: p?.color ?? 'var(--sf-text-2)' }}>{p?.label ?? wo.priority}</span>;
      },
      className: 'w-24',
    },
    {
      key: 'technicianName',
      header: 'Teknisyen',
      sortable: true,
      render: (wo) => <span className="truncate block max-w-[120px]" style={{ color: 'var(--sf-text-2)' }}>{wo.technicianName ?? 'Atanmadı'}</span>,
      className: 'w-32',
    },
    {
      key: 'scheduledDate',
      header: 'Planlanan',
      sortable: true,
      render: (wo) => <span className="text-sm" style={{ color: 'var(--sf-text-2)' }}>{formatDate(wo.scheduledDate)}</span>,
      className: 'w-28',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-end gap-3">
          <div className="w-full max-w-xs">
            <Input
              placeholder="Ara…"
              value={filters.search ?? ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
              aria-label="İş emri ara"
            />
          </div>
          <Select
            options={statusOptions}
            value={filters.status ?? ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
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
          icon={<Wrench className="h-14 w-14" />}
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
            size="compact"
          />
          <Pagination page={page} totalPages={totalPages} total={total} limit={20} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
