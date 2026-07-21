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
    return <ErrorState message="Dashboard verileri yüklenirken bir hata oluştu." onRetry={() => mutate()} />;

  return (
    <div className="space-y-6 sf-fade-up">
      {/* Page heading */}
      <div>
        <h1 className="text-xl font-bold tracking-tight sf-gradient-text">Dashboard</h1>
        <p className="mt-0.5 text-sm" style={{ color: 'var(--sf-text-muted)' }}>
          Genel bakış ve son aktiviteler
        </p>
      </div>

      {/* Stats bento grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Bugünkü İşler"
          value={stats?.totalToday ?? 0}
          subtitle="Bugün oluşturulan"
          icon={<Wrench className="h-5 w-5" />}
          accentColor="#60a5fa"
          gradientClass="sf-gradient-card"
        />
        <StatsCard
          title="Bekleyen"
          value={stats?.pending ?? 0}
          subtitle="Atanmayı bekliyor"
          icon={<Clock className="h-5 w-5" />}
          accentColor="#ffaa4c"
          gradientClass="sf-gradient-card-amber"
        />
        <StatsCard
          title="Tamamlanan"
          value={stats?.completedThisMonth ?? 0}
          subtitle="Bu ay tamamlanan"
          icon={<CheckCircle className="h-5 w-5" />}
          accentColor="#38d996"
          gradientClass="sf-gradient-card-green"
        />
        <StatsCard
          title="Tahsilat"
          value={
            stats?.totalCollection != null
              ? formatCurrency(stats.totalCollection, stats.collectionCurrency)
              : '₺0,00'
          }
          subtitle="Bu ay toplam"
          icon={<Banknote className="h-5 w-5" />}
          accentColor="#7d6cff"
          gradientClass="sf-gradient-card-purple"
        />
      </div>

      {/* Recent work orders */}
      <RecentWorkOrders workOrders={recentWorkOrders} loading={isLoading} />
    </div>
  );
}
