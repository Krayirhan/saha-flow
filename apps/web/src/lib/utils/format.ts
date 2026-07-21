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

type StatusStyle = { bg: string; color: string; border: string };

const STATUS_STYLES: Record<string, StatusStyle> = {
  pending:     { bg: 'rgba(255,170,76,0.1)',  color: 'var(--sf-in-progress)', border: 'rgba(255,170,76,0.25)' },
  assigned:    { bg: 'rgba(125,108,255,0.1)', color: 'var(--sf-assigned)',    border: 'rgba(125,108,255,0.25)' },
  in_progress: { bg: 'rgba(79,140,255,0.1)',  color: 'var(--sf-open)',        border: 'rgba(79,140,255,0.25)' },
  completed:   { bg: 'rgba(56,217,150,0.1)',  color: 'var(--sf-completed)',   border: 'rgba(56,217,150,0.25)' },
  cancelled:   { bg: 'rgba(116,125,141,0.1)', color: 'var(--sf-offline)',     border: 'rgba(116,125,141,0.25)' },
  approved:    { bg: 'rgba(56,217,150,0.1)',  color: 'var(--sf-completed)',   border: 'rgba(56,217,150,0.25)' },
  rejected:    { bg: 'rgba(255,95,109,0.1)',  color: 'var(--sf-sla-risk)',    border: 'rgba(255,95,109,0.25)' },
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

export function getStatusStyle(status: string): StatusStyle {
  return STATUS_STYLES[status] ?? { bg: 'rgba(255,255,255,0.06)', color: 'var(--sf-text-2)', border: 'rgba(255,255,255,0.1)' };
}

export function getStatusColor(status: string): string {
  const s = getStatusStyle(status);
  return `bg-[${s.bg}] text-[${s.color}] border-[${s.border}]`;
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
