import type { Permission } from '@/lib/validation/formats';

export function hasPermission(userPermissions: string[], requiredPermission: Permission): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  if (userPermissions.includes('*')) return true;
  return userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(userPermissions: string[], requiredPermissions: Permission[]): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  if (userPermissions.includes('*')) return true;
  return requiredPermissions.some((p) => userPermissions.includes(p));
}

export function hasAllPermissions(userPermissions: string[], requiredPermissions: Permission[]): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  if (userPermissions.includes('*')) return true;
  return requiredPermissions.every((p) => userPermissions.includes(p));
}
