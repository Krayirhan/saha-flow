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
  OPEN:        { bg: 'rgba(0,82,204,0.1)',    color: 'var(--sf-open)',        border: 'rgba(0,82,204,0.3)' },
  ASSIGNED:    { bg: 'rgba(82,67,170,0.1)',   color: 'var(--sf-assigned)',    border: 'rgba(82,67,170,0.3)' },
  IN_PROGRESS: { bg: 'rgba(255,139,0,0.1)',   color: 'var(--sf-in-progress)', border: 'rgba(255,139,0,0.3)' },
  COMPLETED:   { bg: 'rgba(0,135,90,0.1)',    color: 'var(--sf-completed)',   border: 'rgba(0,135,90,0.3)' },
  APPROVED:    { bg: 'rgba(0,135,90,0.1)',    color: 'var(--sf-completed)',   border: 'rgba(0,135,90,0.3)' },
  INVOICED:    { bg: 'rgba(0,178,217,0.1)',   color: 'var(--sf-synced)',      border: 'rgba(0,178,217,0.3)' },
  PAID:        { bg: 'rgba(0,82,204,0.1)',    color: 'var(--sf-open)',        border: 'rgba(0,82,204,0.3)' },
  CANCELLED:   { bg: 'rgba(94,108,132,0.1)',  color: 'var(--sf-offline)',     border: 'rgba(94,108,132,0.3)' },
  /* lowercase aliases for backward compat */
  pending:     { bg: 'rgba(255,139,0,0.1)',   color: 'var(--sf-in-progress)', border: 'rgba(255,139,0,0.3)' },
  assigned:    { bg: 'rgba(82,67,170,0.1)',   color: 'var(--sf-assigned)',    border: 'rgba(82,67,170,0.3)' },
  in_progress: { bg: 'rgba(255,139,0,0.1)',   color: 'var(--sf-in-progress)', border: 'rgba(255,139,0,0.3)' },
  completed:   { bg: 'rgba(0,135,90,0.1)',    color: 'var(--sf-completed)',   border: 'rgba(0,135,90,0.3)' },
  cancelled:   { bg: 'rgba(94,108,132,0.1)',  color: 'var(--sf-offline)',     border: 'rgba(94,108,132,0.3)' },
  approved:    { bg: 'rgba(0,135,90,0.1)',    color: 'var(--sf-completed)',   border: 'rgba(0,135,90,0.3)' },
  rejected:    { bg: 'rgba(222,53,11,0.1)',   color: 'var(--sf-sla-risk)',    border: 'rgba(222,53,11,0.3)' },
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
  return STATUS_STYLES[status] ?? { bg: 'var(--sf-bg-2)', color: 'var(--sf-text-2)', border: 'var(--sf-border)' };
}

export function getStatusColor(status: string): string {
  const s = getStatusStyle(status);
  return `bg-[${s.bg}] text-[${s.color}] border-[${s.border}]`;
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
