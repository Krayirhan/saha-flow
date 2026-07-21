export const TURKISH_PHONE_MASK = '(5XX) XXX XX XX';

export const TAX_NUMBER_REGEX = /^[0-9]{10,11}$/;

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const WORK_ORDER_PRIORITIES = [
  { value: 'low', label: 'Düşük', color: 'text-white/50' },
  { value: 'medium', label: 'Orta', color: 'text-yellow-400' },
  { value: 'high', label: 'Yüksek', color: 'text-orange-400' },
  { value: 'critical', label: 'Kritik', color: 'text-red-400' },
] as const;

export const WORK_ORDER_STATUSES = [
  { value: 'pending', label: 'Bekliyor' },
  { value: 'assigned', label: 'Atandı' },
  { value: 'in_progress', label: 'Devam Ediyor' },
  { value: 'completed', label: 'Tamamlandı' },
  { value: 'cancelled', label: 'İptal Edildi' },
] as const;

export const PERMISSIONS = {
  WORK_ORDER_CREATE: 'work_order:create',
  WORK_ORDER_READ: 'work_order:read',
  WORK_ORDER_UPDATE: 'work_order:update',
  WORK_ORDER_DELETE: 'work_order:delete',
  CUSTOMER_CREATE: 'customer:create',
  CUSTOMER_READ: 'customer:read',
  CUSTOMER_UPDATE: 'customer:update',
  CUSTOMER_DELETE: 'customer:delete',
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
