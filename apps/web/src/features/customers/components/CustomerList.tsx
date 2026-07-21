'use client';

import { Table, type Column } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCustomers } from '../hooks/useCustomers';
import { formatDate } from '@/lib/utils/format';
import { Plus, Users, Phone, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Customer } from '@/lib/api/types';

export function CustomerList() {
  const router = useRouter();
  const { customers, total, page, totalPages, isLoading, error, filters, setFilters, setPage, mutate } = useCustomers();

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Müşteri',
      render: (customer) => (
        <button onClick={() => router.push(`/customers/${customer.id}`)} className="text-left">
          <p className="font-medium truncate max-w-[180px]" style={{ color: 'var(--sf-text)' }}>{customer.name}</p>
        </button>
      ),
    },
    {
      key: 'email',
      header: 'E-posta',
      render: (customer) => (
        <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--sf-text-2)' }}>
          {customer.email
            ? <><Mail className="h-3 w-3 flex-shrink-0" style={{ color: 'var(--sf-text-muted)' }} />{customer.email}</>
            : <span style={{ color: 'var(--sf-text-muted)' }}>—</span>}
        </span>
      ),
      className: 'w-52',
    },
    {
      key: 'phone',
      header: 'Telefon',
      render: (customer) => (
        <span className="flex items-center gap-1 text-sm whitespace-nowrap" style={{ color: 'var(--sf-text-2)' }}>
          {customer.phone
            ? <><Phone className="h-3 w-3 flex-shrink-0" style={{ color: 'var(--sf-text-muted)' }} />{customer.phone}</>
            : <span style={{ color: 'var(--sf-text-muted)' }}>—</span>}
        </span>
      ),
      className: 'w-36',
    },
    {
      key: 'taxNumber',
      header: 'Vergi No',
      render: (customer) => (
        <span className="text-sm font-mono" style={{ color: 'var(--sf-text-2)' }}>
          {customer.taxNumber ?? '—'}
        </span>
      ),
      className: 'w-32',
    },
    {
      key: 'totalWorkOrders',
      header: 'İş Emri',
      render: (customer) => (
        <span className="text-sm font-medium" style={{ color: 'var(--sf-accent)' }}>
          {customer.totalWorkOrders}
        </span>
      ),
      className: 'w-20 text-center',
    },
    {
      key: 'createdAt',
      header: 'Kayıt Tarihi',
      render: (customer) => <span className="text-sm" style={{ color: 'var(--sf-text-2)' }}>{formatDate(customer.createdAt)}</span>,
      className: 'w-28',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Müşteri ara…"
          value={filters.search ?? ''}
          onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
          className="max-w-xs"
          aria-label="Müşteri ara"
        />
        <Button onClick={() => router.push('/customers/new')}>
          <Plus className="h-4 w-4" />
          Yeni Müşteri
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Müşteriler yükleniyor..." />
      ) : error ? (
        <ErrorState message="Müşteriler yüklenirken bir hata oluştu." onRetry={() => mutate()} />
      ) : customers.length === 0 ? (
        <EmptyState
          icon={<Users className="h-14 w-14" />}
          title="Henüz müşteri yok"
          message="Yeni bir müşteri ekleyerek başlayabilirsiniz."
          actionLabel="Yeni Müşteri"
          onAction={() => router.push('/customers/new')}
        />
      ) : (
        <>
          <Table columns={columns} data={customers} keyExtractor={(c) => c.id} size="compact" />
          <Pagination page={page} totalPages={totalPages} total={total} limit={20} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
