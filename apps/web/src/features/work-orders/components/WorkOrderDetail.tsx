'use client';

import { useWorkOrderDetail } from '../hooks/useWorkOrders';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { getStatusLabel, formatDate, formatDateTime } from '@/lib/utils/format';
import { WORK_ORDER_STATUSES } from '@/lib/validation/formats';
import { ArrowLeft, Calendar, Clock, MapPin, User, Building2, Tag, Circle, Flag } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { WorkOrderStatusHistory } from '@/lib/api/types';

interface WorkOrderDetailProps {
  id: string;
}

const priorityStyles: Record<string, { color: string; label: string }> = {
  low:      { color: 'var(--sf-text-muted)', label: 'Düşük' },
  medium:   { color: 'var(--sf-in-progress)', label: 'Orta' },
  high:     { color: '#ff9060', label: 'Yüksek' },
  critical: { color: 'var(--sf-sla-risk)', label: 'Kritik' },
};

function DetailRow({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 text-sm" style={{ borderBottom: '1px solid var(--sf-border)' }}>
      <dt className="flex items-center gap-1.5" style={{ color: 'var(--sf-text-muted)' }}>
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

export function WorkOrderDetail({ id }: WorkOrderDetailProps) {
  const { workOrder, statusHistory, isLoading, error, mutate } = useWorkOrderDetail(id);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  if (isLoading) return <LoadingSpinner text="İş emri yükleniyor..." />;
  if (error) return <ErrorState message="İş emri yüklenirken bir hata oluştu." onRetry={() => mutate()} />;
  if (!workOrder) return <ErrorState message="İş emri bulunamadı." />;

  const priority = priorityStyles[workOrder.priority] ?? { color: 'var(--sf-text-2)', label: workOrder.priority };

  return (
    <div className="space-y-6 sf-fade-up">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/work-orders">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight sf-gradient-text">{workOrder.title}</h1>
          <p className="mt-0.5 font-mono text-xs" style={{ color: 'var(--sf-text-muted)' }}>#{workOrder.id.slice(0, 8)}</p>
        </div>
        <Button onClick={() => setStatusModalOpen(true)}>Durum Güncelle</Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-5 lg:col-span-2">
          <CardSpotlight className="sf-gradient-card p-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--sf-text-muted)' }}>Açıklama</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'var(--sf-text-2)' }}>{workOrder.description}</p>
          </CardSpotlight>

          {statusHistory.length > 0 && (
            <CardSpotlight className="sf-gradient-card p-6">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--sf-text-muted)' }}>Durum Geçmişi</h2>
              <div className="relative space-y-4">
                <div className="absolute left-[5px] top-2 h-[calc(100%-16px)] w-px" style={{ background: 'var(--sf-border)' }} />
                {statusHistory.map((entry: WorkOrderStatusHistory) => (
                  <div key={entry.id} className="relative flex gap-4 pl-7">
                    <div
                      className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2"
                      style={{ borderColor: 'var(--sf-accent)', background: 'var(--sf-surface)', boxShadow: 'none' }}
                    />
                    <div className="flex-1 rounded-xl p-3" style={{ background: 'var(--sf-surface-2)', border: '1px solid var(--sf-border)' }}>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={entry.toStatus} />
                        <span className="text-xs" style={{ color: 'var(--sf-text-muted)' }}>{formatDateTime(entry.createdAt)}</span>
                      </div>
                      <p className="mt-1.5 text-xs" style={{ color: 'var(--sf-text-muted)' }}>
                        {entry.changedByName} tarafından{' '}
                        <span style={{ color: 'var(--sf-text-2)' }}>{getStatusLabel(entry.fromStatus)}</span>{' '}
                        durumundan değiştirildi
                      </p>
                      {entry.note && <p className="mt-1.5 text-sm" style={{ color: 'var(--sf-text-2)' }}>{entry.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardSpotlight>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <CardSpotlight className="sf-gradient-card p-5">
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--sf-text-muted)' }}>Detaylar</h3>
            <dl>
              <DetailRow icon={Circle} label="Durum"><StatusBadge status={workOrder.status} /></DetailRow>
              <DetailRow icon={Flag} label="Öncelik">
                <span className="text-sm font-medium" style={{ color: priority.color }}>{priority.label}</span>
              </DetailRow>
              <DetailRow icon={Calendar} label="Planlanan">
                <span className="text-sm" style={{ color: 'var(--sf-text)' }}>{formatDate(workOrder.scheduledDate)}</span>
              </DetailRow>
              <DetailRow icon={User} label="Teknisyen">
                <span className="text-sm" style={{ color: 'var(--sf-text)' }}>{workOrder.technicianName ?? 'Atanmadı'}</span>
              </DetailRow>
              <DetailRow icon={Building2} label="Müşteri">
                <span className="text-sm" style={{ color: 'var(--sf-text)' }}>{workOrder.customerName ?? '—'}</span>
              </DetailRow>
              <div className="flex items-center justify-between pt-2.5 text-sm">
                <dt className="flex items-center gap-1.5" style={{ color: 'var(--sf-text-muted)' }}>
                  <Clock className="h-3.5 w-3.5" />Oluşturma
                </dt>
                <dd style={{ color: 'var(--sf-text)' }}>{formatDateTime(workOrder.createdAt)}</dd>
              </div>
            </dl>
          </CardSpotlight>

          {workOrder.location?.address && (
            <CardSpotlight className="sf-gradient-card p-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--sf-text-muted)' }}>Konum</h3>
              <p className="flex items-start gap-2 text-sm" style={{ color: 'var(--sf-text-2)' }}>
                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--sf-text-muted)' }} />
                {workOrder.location.address}
              </p>
            </CardSpotlight>
          )}

          {workOrder.tags.length > 0 && (
            <CardSpotlight className="sf-gradient-card p-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--sf-text-muted)' }}>Etiketler</h3>
              <div className="flex flex-wrap gap-1.5">
                {workOrder.tags.map((tag) => (
                  <Badge key={tag} variant="default" className="gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardSpotlight>
          )}
        </div>
      </div>

      {/* Status modal */}
      <Modal open={statusModalOpen} onClose={() => setStatusModalOpen(false)} title="Durum Güncelle">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {WORK_ORDER_STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => setSelectedStatus(s.value)}
                className="rounded-xl p-3 text-sm font-medium transition-all duration-200"
                style={
                  selectedStatus === s.value
                    ? { background: 'var(--sf-accent-bg)', color: 'var(--sf-accent)', border: '1px solid var(--sf-accent)', boxShadow: 'none' }
                    : { background: 'var(--sf-surface-2)', color: 'var(--sf-text-2)', border: '1px solid var(--sf-border)' }
                }
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setStatusModalOpen(false)}>İptal</Button>
            <Button disabled={!selectedStatus} onClick={() => setStatusModalOpen(false)}>Güncelle</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
