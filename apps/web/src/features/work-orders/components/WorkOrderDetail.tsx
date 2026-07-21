'use client';

import { useWorkOrderDetail } from '../hooks/useWorkOrders';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { getStatusLabel, formatDate, formatDateTime } from '@/lib/utils/format';
import { WORK_ORDER_STATUSES } from '@/lib/validation/formats';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Building2,
  Tag,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { WorkOrderStatusHistory } from '@/lib/api/types';

interface WorkOrderDetailProps {
  id: string;
}

export function WorkOrderDetail({ id }: WorkOrderDetailProps) {
  const { workOrder, statusHistory, isLoading, error, mutate } = useWorkOrderDetail(id);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  if (isLoading) return <LoadingSpinner text="İş emri yükleniyor..." />;
  if (error)
    return (
      <ErrorState
        message="İş emri yüklenirken bir hata oluştu."
        onRetry={() => mutate()}
      />
    );
  if (!workOrder) return <ErrorState message="İş emri bulunamadı." />;

  const priorityColors: Record<string, string> = {
    low: 'text-white/50',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
    critical: 'text-red-400',
  };

  const priorityLabels: Record<string, string> = {
    low: 'Düşük',
    medium: 'Orta',
    high: 'Yüksek',
    critical: 'Kritik',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/work-orders">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{workOrder.title}</h1>
          <p className="mt-1 text-sm text-white/40">ID: {workOrder.id}</p>
        </div>
        <Button onClick={() => setStatusModalOpen(true)}>Durum Güncelle</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
            <h2 className="mb-3 text-lg font-semibold text-white">Açıklama</h2>
            <p className="whitespace-pre-wrap text-sm text-white/70">{workOrder.description}</p>
          </div>

          {statusHistory.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-lg font-semibold text-white">Durum Geçmişi</h2>
              <div className="relative space-y-4 before:absolute before:left-3 before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-white/10">
                {statusHistory.map((entry: WorkOrderStatusHistory) => (
                  <div key={entry.id} className="relative flex gap-4 pl-8">
                    <div className="absolute left-0 top-1 h-2.5 w-2.5 rounded-full border-2 border-primary-500 bg-[#0A0A0B]" />
                    <div className="flex-1 rounded-lg bg-white/5 p-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={entry.toStatus} />
                        <span className="text-xs text-white/40">
                          {formatDateTime(entry.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-white/60">
                        {entry.changedByName} tarafından{' '}
                        <span className="font-medium text-white/80">{getStatusLabel(entry.fromStatus)}</span>{' '}
                        durumundan değiştirildi
                      </p>
                      {entry.note && (
                        <p className="mt-1 text-sm text-white/70">{entry.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
            <h3 className="mb-3 text-sm font-semibold text-white/80">Detaylar</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="flex items-center gap-1 text-white/50">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Durum
                </dt>
                <dd>
                  <StatusBadge status={workOrder.status} />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex items-center gap-1 text-white/50">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Öncelik
                </dt>
                <dd className={priorityColors[workOrder.priority] ?? ''}>
                  {priorityLabels[workOrder.priority] ?? workOrder.priority}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex items-center gap-1 text-white/50">
                  <Calendar className="h-3.5 w-3.5" />
                  Planlanan
                </dt>
                <dd className="text-white">{formatDate(workOrder.scheduledDate)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex items-center gap-1 text-white/50">
                  <User className="h-3.5 w-3.5" />
                  Teknisyen
                </dt>
                <dd className="text-white">{workOrder.technicianName ?? 'Atanmadı'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex items-center gap-1 text-white/50">
                  <Building2 className="h-3.5 w-3.5" />
                  Müşteri
                </dt>
                <dd className="text-white">{workOrder.customerName ?? '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex items-center gap-1 text-white/50">
                  <Clock className="h-3.5 w-3.5" />
                  Oluşturma
                </dt>
                <dd className="text-white">{formatDateTime(workOrder.createdAt)}</dd>
              </div>
            </dl>
          </div>

          {workOrder.location?.address && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-sm font-semibold text-white/80">Konum</h3>
              <p className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-white/40" />
                {workOrder.location.address}
              </p>
            </div>
          )}

          {workOrder.tags.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-sm font-semibold text-white/80">Etiketler</h3>
              <div className="flex flex-wrap gap-1.5">
                {workOrder.tags.map((tag) => (
                  <Badge key={tag} variant="default" className="gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Durum Güncelle"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {WORK_ORDER_STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => setSelectedStatus(s.value)}
                className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                  selectedStatus === s.value
                    ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                    : 'border-white/10 text-white/70 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setStatusModalOpen(false)}>
              İptal
            </Button>
            <Button
              disabled={!selectedStatus}
              onClick={() => {
                setStatusModalOpen(false);
              }}
            >
              Güncelle
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
