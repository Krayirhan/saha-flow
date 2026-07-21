'use client';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { formatDate } from '@/lib/utils/format';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import type { WorkOrder } from '@/lib/api/types';

interface RecentWorkOrdersProps {
  workOrders: WorkOrder[];
  loading?: boolean;
}

export function RecentWorkOrders({ workOrders, loading = false }: RecentWorkOrdersProps) {
  const router = useRouter();

  return (
    <CardSpotlight
      className="sf-gradient-card overflow-hidden"
      spotlightColor="rgba(0,82,204,0.04)"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--sf-border)' }}
      >
        <h3 className="text-sm font-semibold" style={{ color: 'var(--sf-text)' }}>
          Son İş Emirleri
        </h3>
        <button
          onClick={() => router.push('/work-orders')}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-[var(--sf-hover)]"
          style={{ color: 'var(--sf-accent)' }}
        >
          Tümünü Gör
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Body */}
      {loading ? (
        <div className="px-5 py-10 text-center text-sm" style={{ color: 'var(--sf-text-muted)' }}>
          Yükleniyor…
        </div>
      ) : workOrders.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm" style={{ color: 'var(--sf-text-muted)' }}>
          Henüz iş emri bulunmamaktadır.
        </div>
      ) : (
        <div>
          {workOrders.map((wo, idx) => (
            <button
              key={wo.id}
              onClick={() => router.push(`/work-orders/${wo.id}`)}
              className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-[var(--sf-hover-soft)]"
              style={{ borderTop: idx === 0 ? undefined : '1px solid var(--sf-border)' }}
            >
              <span
                className="hidden w-5 flex-shrink-0 font-mono text-[11px] tabular-nums sm:block"
                style={{ color: 'var(--sf-text-muted)' }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" style={{ color: 'var(--sf-text)' }}>
                  {wo.title}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--sf-text-muted)' }}>
                  {wo.customerName ?? '—'}&nbsp;&middot;&nbsp;{formatDate(wo.createdAt)}
                </p>
              </div>
              <StatusBadge status={wo.status} className="flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </CardSpotlight>
  );
}
