'use client';

import { PermissionGuard } from '@/components/guard/PermissionGuard';
import { CustomerList } from '@/features/customers/components/CustomerList';
import { PERMISSIONS } from '@/lib/validation/formats';

export default function CustomersPage() {
  return (
    <PermissionGuard permission={PERMISSIONS.CUSTOMER_READ}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--sf-text)' }}>Müşteriler</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--sf-text-muted)' }}>Tüm müşterileri yönetin</p>
        </div>
        <CustomerList />
      </div>
    </PermissionGuard>
  );
}
