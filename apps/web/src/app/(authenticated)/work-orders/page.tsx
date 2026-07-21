'use client';

import { PermissionGuard } from '@/components/guard/PermissionGuard';
import { WorkOrderList } from '@/features/work-orders/components/WorkOrderList';
import { PERMISSIONS } from '@/lib/validation/formats';

export default function WorkOrdersPage() {
  return (
    <PermissionGuard permission={PERMISSIONS.WORK_ORDER_READ}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">İş Emirleri</h1>
        <WorkOrderList />
      </div>
    </PermissionGuard>
  );
}
