'use client';

import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { StatsCard } from '@/features/dashboard/components/StatsCard';
import { RecentWorkOrders } from '@/features/dashboard/components/RecentWorkOrders';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatCurrency } from '@/lib/utils/format';
import { Wrench, Clock, CheckCircle, Banknote } from 'lucide-react';

export default function DashboardPage() {
  const { stats, recentWorkOrders, isLoading, error, mutate } = useDashboard();

  if (isLoading && !stats) return <LoadingSpinner text="Dashboard yükleniyor..." />;
  if (error)
    return (
      <ErrorState
        message="Dashboard verileri yüklenirken bir hata oluştu."
        onRetry={() => mutate()}
      />
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Bugünkü İşler"
          value={stats?.totalToday ?? 0}
          subtitle="Bugün oluşturulan iş emirleri"
          icon={<Wrench className="h-5 w-5" />}
        />
        <StatsCard
          title="Bekleyen"
          value={stats?.pending ?? 0}
          subtitle="Bekleyen iş emirleri"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatsCard
          title="Tamamlanan (Bu Ay)"
          value={stats?.completedThisMonth ?? 0}
          subtitle="Bu ay tamamlanan işler"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatsCard
          title="Tahsilat (Bu Ay)"
          value={stats?.totalCollection != null ? formatCurrency(stats.totalCollection, stats.collectionCurrency) : '₺0,00'}
          subtitle="Bu ay toplam tahsilat"
          icon={<Banknote className="h-5 w-5" />}
        />
      </div>

      <RecentWorkOrders workOrders={recentWorkOrders} loading={isLoading} />
    </div>
  );
}
