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

export function EmptyState({ icon, title, message, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center rounded-2xl py-16 text-center', className)}
      style={{ background: 'var(--sf-surface)', border: '1px solid var(--sf-border)' }}
    >
      <div className="mb-4" style={{ color: 'var(--sf-text-muted)', opacity: 0.4 }}>
        {icon ?? <Inbox className="h-14 w-14" />}
      </div>
      <h3 className="text-base font-semibold" style={{ color: 'var(--sf-text)' }}>{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm" style={{ color: 'var(--sf-text-muted)' }}>{message}</p>}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
