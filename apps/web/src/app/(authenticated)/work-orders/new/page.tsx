'use client';

import { PermissionGuard } from '@/components/guard/PermissionGuard';
import { WorkOrderForm } from '@/features/work-orders/components/WorkOrderForm';
import { PERMISSIONS } from '@/lib/validation/formats';

export default function NewWorkOrderPage() {
  return (
    <PermissionGuard permission={PERMISSIONS.WORK_ORDER_CREATE}>
      <WorkOrderForm />
    </PermissionGuard>
  );
}
