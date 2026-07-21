import { cn } from '@/lib/utils/cn';
import { getStatusLabel, getStatusStyle } from '@/lib/utils/format';

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const style = getStatusStyle(status);
  return (
    <span
      className={cn('inline-flex items-center rounded px-2.5 py-0.5 text-xs font-semibold', className)}
      style={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
      }}
    >
      {label ?? getStatusLabel(status)}
    </span>
  );
}
