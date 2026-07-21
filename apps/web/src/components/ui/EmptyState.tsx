import { cn } from '@/lib/utils/cn';
import { Inbox } from 'lucide-react';
import { type ReactNode } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] py-16 text-center backdrop-blur-sm', className)}>
      <div className="mb-4 text-white/20">
        {icon ?? <Inbox className="h-16 w-16" />}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-white/50">{message}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
