'use client';

import { useParams } from 'next/navigation';
import { PermissionGuard } from '@/components/guard/PermissionGuard';
import { WorkOrderDetail } from '@/features/work-orders/components/WorkOrderDetail';
import { PERMISSIONS } from '@/lib/validation/formats';

export default function WorkOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <PermissionGuard permission={PERMISSIONS.WORK_ORDER_READ}>
      <WorkOrderDetail id={id} />
    </PermissionGuard>
  );
}
