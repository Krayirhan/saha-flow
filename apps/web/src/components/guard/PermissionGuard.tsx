'use client';

import { type ReactNode } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { hasPermission } from '@/lib/auth/permissions';
import type { Permission } from '@/lib/validation/formats';
import { ErrorState } from '@/components/ui/ErrorState';
import Link from 'next/link';

interface PermissionGuardProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({ permission, children, fallback }: PermissionGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user || !hasPermission(user.permissions, permission)) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white">
        <div className="text-center">
          <ErrorState message="Bu sayfaya erişim yetkiniz bulunmamaktadır." />
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-sm text-primary-400 hover:text-primary-300"
          >
            Dashboard&apos;a dön
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
