import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ open, onClose, title, children, size = 'md', className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="fixed inset-0 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.6)' }} />
      <div
        className={cn('relative w-full rounded-2xl shadow-2xl', sizeClasses[size], className)}
        style={{ background: 'var(--sf-surface)', border: '1px solid var(--sf-border-strong)' }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {title && (
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid var(--sf-border)' }}
          >
            <h2 className="text-base font-semibold" style={{ color: 'var(--sf-text)' }}>{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 transition-colors hover:bg-[#ebecf0]"
              style={{ color: 'var(--sf-text-muted)' }}
              aria-label="Kapat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
