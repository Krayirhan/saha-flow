'use client';

import { useParams } from 'next/navigation';
import { PermissionGuard } from '@/components/guard/PermissionGuard';
import { CustomerDetail } from '@/features/customers/components/CustomerDetail';
import { PERMISSIONS } from '@/lib/validation/formats';

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <PermissionGuard permission={PERMISSIONS.CUSTOMER_READ}>
      <CustomerDetail id={id} />
    </PermissionGuard>
  );
}
