import { format as dateFnsFormat, parseISO, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { tr } from 'date-fns/locale';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Bekliyor',
  assigned: 'Atandı',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  assigned: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_progress: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-white/10 text-white/60 border-white/10',
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function formatDate(date: string | Date | null | undefined, fmt: string = 'dd.MM.yyyy'): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  try {
    return dateFnsFormat(d, fmt, { locale: tr });
  } catch {
    return '-';
  }
}

export function formatDateTime(date: string | Date | null | undefined): string {
  return formatDate(date, 'dd.MM.yyyy HH:mm');
}

export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return `Bugün ${dateFnsFormat(d, 'HH:mm')}`;
  if (isYesterday(d)) return `Dün ${dateFnsFormat(d, 'HH:mm')}`;
  return formatDistanceToNow(d, { addSuffix: true, locale: tr });
}

export function formatCurrency(
  amount: number | null | undefined,
  currency: string = 'TRY',
): string {
  if (amount == null) return '-';
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(amount);
}

export function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? 'bg-white/10 text-white/80 border-white/10';
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
