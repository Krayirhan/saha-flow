'use client';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/utils/format';
import { useRouter } from 'next/navigation';
import type { WorkOrder } from '@/lib/api/types';

interface RecentWorkOrdersProps {
  workOrders: WorkOrder[];
  loading?: boolean;
}

export function RecentWorkOrders({ workOrders, loading = false }: RecentWorkOrdersProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h3 className="text-sm font-semibold text-white">Son İş Emirleri</h3>
        <button
          onClick={() => router.push('/work-orders')}
          className="text-xs font-medium text-primary-400 hover:text-primary-300"
        >
          Tümünü Gör
        </button>
      </div>
      <div className="divide-y divide-white/5">
        {loading ? (
          <div className="px-6 py-8 text-center text-sm text-white/40">Yükleniyor...</div>
        ) : workOrders.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-white/40">
            Henüz iş emri bulunmamaktadır.
          </div>
        ) : (
          workOrders.map((wo) => (
            <button
              key={wo.id}
              onClick={() => router.push(`/work-orders/${wo.id}`)}
              className="flex w-full items-center justify-between px-6 py-3 text-left transition-colors hover:bg-white/5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{wo.title}</p>
                <p className="text-xs text-white/40">
                  {wo.customerName ?? '-'} &middot; {formatDate(wo.createdAt)}
                </p>
              </div>
              <StatusBadge status={wo.status} className="flex-shrink-0" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
