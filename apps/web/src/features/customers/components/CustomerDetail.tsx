'use client';

import { useCustomerDetail } from '../hooks/useCustomers';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { formatDate, formatDateTime } from '@/lib/utils/format';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Hash,
  Calendar,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

interface CustomerDetailProps {
  id: string;
}

export function CustomerDetail({ id }: CustomerDetailProps) {
  const { customer, isLoading, error, mutate } = useCustomerDetail(id);

  if (isLoading) return <LoadingSpinner text="Müşteri bilgileri yükleniyor..." />;
  if (error)
    return (
      <ErrorState
        message="Müşteri bilgileri yüklenirken bir hata oluştu."
        onRetry={() => mutate()}
      />
    );
  if (!customer) return <ErrorState message="Müşteri bulunamadı." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/customers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-white">{customer.name}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-white">Müşteri Bilgileri</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-1.5 text-sm text-white/50">
                  <Mail className="h-3.5 w-3.5" />
                  E-posta
                </dt>
                <dd className="mt-0.5 text-sm text-white">
                  {customer.email ? (
                    <a href={`mailto:${customer.email}`} className="text-primary-400 hover:underline">
                      {customer.email}
                    </a>
                  ) : (
                    '-'
                  )}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-sm text-white/50">
                  <Phone className="h-3.5 w-3.5" />
                  Telefon
                </dt>
                <dd className="mt-0.5 text-sm text-white">
                  {customer.phone ? (
                    <a href={`tel:${customer.phone}`} className="text-primary-400 hover:underline">
                      {customer.phone}
                    </a>
                  ) : (
                    '-'
                  )}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="flex items-center gap-1.5 text-sm text-white/50">
                  <MapPin className="h-3.5 w-3.5" />
                  Adres
                </dt>
                <dd className="mt-0.5 text-sm text-white">{customer.address ?? '-'}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-sm text-white/50">
                  <Hash className="h-3.5 w-3.5" />
                  Vergi Numarası
                </dt>
                <dd className="mt-0.5 text-sm text-white">{customer.taxNumber ?? '-'}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-sm text-white/50">
                  <Building2 className="h-3.5 w-3.5" />
                  Vergi Dairesi
                </dt>
                <dd className="mt-0.5 text-sm text-white">{customer.taxOffice ?? '-'}</dd>
              </div>
            </dl>
          </div>

          {customer.notes && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h2 className="mb-3 text-lg font-semibold text-white">Notlar</h2>
              <p className="whitespace-pre-wrap text-sm text-white/70">{customer.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
            <h3 className="mb-3 text-sm font-semibold text-white/80">Özet</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="flex items-center gap-1 text-white/50">
                  <FileText className="h-3.5 w-3.5" />
                  Toplam İş Emri
                </dt>
                <dd className="font-semibold text-primary-400">{customer.totalWorkOrders}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex items-center gap-1 text-white/50">
                  <Calendar className="h-3.5 w-3.5" />
                  Kayıt Tarihi
                </dt>
                <dd className="text-white">{formatDate(customer.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex items-center gap-1 text-white/50">
                  <Clock className="h-3.5 w-3.5" />
                  Son Güncelleme
                </dt>
                <dd className="text-white">{formatDateTime(customer.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
