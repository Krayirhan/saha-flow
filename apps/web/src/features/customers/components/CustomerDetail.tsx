'use client';

import { useCustomerDetail } from '../hooks/useCustomers';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { formatDate, formatDateTime } from '@/lib/utils/format';
import { ArrowLeft, Mail, Phone, MapPin, Building2, FileText, Hash, Calendar, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface CustomerDetailProps {
  id: string;
}

function InfoRow({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 text-sm" style={{ borderBottom: '1px solid var(--sf-border)' }}>
      <dt className="flex items-center gap-1.5" style={{ color: 'var(--sf-text-muted)' }}>
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd style={{ color: 'var(--sf-text)' }}>{children}</dd>
    </div>
  );
}

export function CustomerDetail({ id }: CustomerDetailProps) {
  const { customer, isLoading, error, mutate } = useCustomerDetail(id);

  if (isLoading) return <LoadingSpinner text="Müşteri bilgileri yükleniyor..." />;
  if (error) return <ErrorState message="Müşteri bilgileri yüklenirken bir hata oluştu." onRetry={() => mutate()} />;
  if (!customer) return <ErrorState message="Müşteri bulunamadı." />;

  return (
    <div className="space-y-6 sf-fade-up">
      <div className="flex items-center gap-3">
        <Link href="/customers">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-xl font-bold tracking-tight sf-gradient-text">{customer.name}</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <CardSpotlight className="sf-gradient-card p-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--sf-text-muted)' }}>
              Müşteri Bilgileri
            </h2>
            <dl>
              <InfoRow icon={Mail} label="E-posta">
                {customer.email
                  ? <a href={`mailto:${customer.email}`} className="hover:underline" style={{ color: 'var(--sf-accent)' }}>{customer.email}</a>
                  : <span style={{ color: 'var(--sf-text-muted)' }}>—</span>}
              </InfoRow>
              <InfoRow icon={Phone} label="Telefon">
                {customer.phone
                  ? <a href={`tel:${customer.phone}`} className="hover:underline" style={{ color: 'var(--sf-accent)' }}>{customer.phone}</a>
                  : <span style={{ color: 'var(--sf-text-muted)' }}>—</span>}
              </InfoRow>
              <InfoRow icon={MapPin} label="Adres">
                {customer.address ?? <span style={{ color: 'var(--sf-text-muted)' }}>—</span>}
              </InfoRow>
              <InfoRow icon={Hash} label="Vergi Numarası">
                {customer.taxNumber ?? <span style={{ color: 'var(--sf-text-muted)' }}>—</span>}
              </InfoRow>
              <InfoRow icon={Building2} label="Vergi Dairesi">
                {customer.taxOffice ?? <span style={{ color: 'var(--sf-text-muted)' }}>—</span>}
              </InfoRow>
            </dl>
          </CardSpotlight>

          {customer.notes && (
            <CardSpotlight className="sf-gradient-card p-6">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--sf-text-muted)' }}>Notlar</h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'var(--sf-text-2)' }}>{customer.notes}</p>
            </CardSpotlight>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <CardSpotlight className="sf-gradient-card p-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--sf-text-muted)' }}>Özet</h3>
            <dl className="space-y-4">
              <div className="flex items-center justify-between py-2.5 text-sm" style={{ borderBottom: '1px solid var(--sf-border)' }}>
                <dt className="flex items-center gap-1.5" style={{ color: 'var(--sf-text-muted)' }}>
                  <FileText className="h-3.5 w-3.5" /> Toplam İş Emri
                </dt>
                <dd>
                  <Link
                    href={`/work-orders?customerId=${customer.id}`}
                    className="flex items-center gap-1 font-mono font-bold hover:underline"
                    style={{ color: 'var(--sf-accent)', textShadow: 'none' }}
                  >
                    {customer.totalWorkOrders}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </dd>
              </div>
              <div className="flex items-center justify-between pt-4 text-sm">
                <dt className="flex items-center gap-1.5" style={{ color: 'var(--sf-text-muted)' }}>
                  <Calendar className="h-3.5 w-3.5" /> Kayıt Tarihi
                </dt>
                <dd style={{ color: 'var(--sf-text)' }}>{formatDate(customer.createdAt)}</dd>
              </div>
              <div className="flex items-center justify-between pt-4 text-sm">
                <dt className="flex items-center gap-1.5" style={{ color: 'var(--sf-text-muted)' }}>
                  <Clock className="h-3.5 w-3.5" /> Son Güncelleme
                </dt>
                <dd style={{ color: 'var(--sf-text)' }}>{formatDateTime(customer.updatedAt)}</dd>
              </div>
            </dl>
          </CardSpotlight>
        </div>
      </div>
    </div>
  );
}
