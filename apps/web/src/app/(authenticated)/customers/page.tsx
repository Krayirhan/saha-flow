'use client';

import { PermissionGuard } from '@/components/guard/PermissionGuard';
import { CustomerList } from '@/features/customers/components/CustomerList';
import { PERMISSIONS } from '@/lib/validation/formats';

export default function CustomersPage() {
  return (
    <PermissionGuard permission={PERMISSIONS.CUSTOMER_READ}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Müşteriler</h1>
        <CustomerList />
      </div>
    </PermissionGuard>
  );
}
