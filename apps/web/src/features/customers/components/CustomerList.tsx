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
  const {
    customers,
    total,
    page,
    totalPages,
    isLoading,
    error,
    filters,
    setFilters,
    setPage,
    mutate,
  } = useCustomers();

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Müşteri',
      sortable: false,
      render: (customer) => (
        <button
          onClick={() => router.push(`/customers/${customer.id}`)}
          className="text-left hover:text-primary-400"
        >
          <p className="font-medium text-white">{customer.name}</p>
          <p className="text-xs text-white/40">
            {customer.totalWorkOrders} iş emri
          </p>
        </button>
      ),
    },
    {
      key: 'email',
      header: 'İletişim',
      sortable: false,
      render: (customer) => (
        <div className="space-y-0.5 text-sm text-white/60">
          {customer.email && (
            <p className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {customer.email}
            </p>
          )}
          {customer.phone && (
            <p className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {customer.phone}
            </p>
          )}
          {!customer.email && !customer.phone && <span className="text-white/30">-</span>}
        </div>
      ),
      className: 'w-56',
    },
    {
      key: 'address',
      header: 'Adres',
      sortable: false,
      render: (customer) => (
        <span className="text-sm text-white/60">{customer.address ?? '-'}</span>
      ),
      className: 'max-w-xs',
    },
    {
      key: 'taxNumber',
      header: 'Vergi',
      sortable: false,
      render: (customer) => (
        <span className="text-sm text-white/60">
          {customer.taxNumber ? `${customer.taxNumber} (${customer.taxOffice})` : '-'}
        </span>
      ),
      className: 'w-40',
    },
    {
      key: 'createdAt',
      header: 'Kayıt Tarihi',
      sortable: false,
      render: (customer) => (
        <span className="text-sm text-white/60">{formatDate(customer.createdAt)}</span>
      ),
      className: 'w-28',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Müşteri ara..."
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
          icon={<Users className="h-16 w-16" />}
          title="Henüz müşteri yok"
          message="Yeni bir müşteri ekleyerek başlayabilirsiniz."
          actionLabel="Yeni Müşteri"
          onAction={() => router.push('/customers/new')}
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={customers}
            keyExtractor={(c) => c.id}
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
