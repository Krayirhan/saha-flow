import { cn } from '@/lib/utils/cn';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  message = 'Bir hata oluştu. Lütfen tekrar deneyin.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] py-16 text-center backdrop-blur-sm', className)}>
      <AlertTriangle className="mb-4 h-12 w-12 text-danger-500" />
      <p className="max-w-sm text-sm text-white/60">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Tekrar Dene
        </Button>
      )}
    </div>
  );
}
