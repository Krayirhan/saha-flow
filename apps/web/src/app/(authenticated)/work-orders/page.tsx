'use client';

import { PermissionGuard } from '@/components/guard/PermissionGuard';
import { WorkOrderList } from '@/features/work-orders/components/WorkOrderList';
import { PERMISSIONS } from '@/lib/validation/formats';

export default function WorkOrdersPage() {
  return (
    <PermissionGuard permission={PERMISSIONS.WORK_ORDER_READ}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--sf-text)' }}>İş Emirleri</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--sf-text-muted)' }}>Tüm iş emirlerini takip edin</p>
        </div>
        <WorkOrderList />
      </div>
    </PermissionGuard>
  );
}
