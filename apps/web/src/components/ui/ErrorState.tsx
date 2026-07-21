import { cn } from '@/lib/utils/cn';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message = 'Bir hata oluştu. Lütfen tekrar deneyin.', onRetry, className }: ErrorStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center rounded-2xl py-16 text-center', className)}
      style={{ background: 'var(--sf-surface)', border: '1px solid var(--sf-border)' }}
    >
      <AlertTriangle className="mb-4 h-10 w-10" style={{ color: 'var(--sf-sla-risk)' }} />
      <p className="max-w-sm text-sm" style={{ color: 'var(--sf-text-2)' }}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-5" onClick={onRetry}>
          Tekrar Dene
        </Button>
      )}
    </div>
  );
}
