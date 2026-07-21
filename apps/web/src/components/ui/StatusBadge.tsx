import { cn } from '@/lib/utils/cn';
import { getStatusLabel, getStatusColor } from '@/lib/utils/format';

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        getStatusColor(status),
        className,
      )}
    >
      {label ?? getStatusLabel(status)}
    </span>
  );
}
