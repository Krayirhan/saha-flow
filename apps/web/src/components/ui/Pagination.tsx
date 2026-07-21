import { cn } from '@/lib/utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
  limit?: number;
  className?: string;
}

export function Pagination({ page, totalPages, onPageChange, total, limit, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const start = ((page - 1) * (limit ?? 20)) + 1;
  const end = total ? Math.min(page * (limit ?? 20), total) : null;

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {total != null && (
        <p className="text-xs" style={{ color: 'var(--sf-text-muted)' }}>
          Toplam {total} kayıttan {start}–{end} arası gösteriliyor
        </p>
      )}
      <nav className="flex items-center gap-1" aria-label="Sayfalama">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Önceki sayfa"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pageNumbers.map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-sm" style={{ color: 'var(--sf-text-muted)' }}>
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className="min-w-[2rem] rounded-lg px-2 py-1 text-sm font-medium transition-colors"
              style={
                p === page
                  ? { background: 'var(--sf-accent)', color: '#fff' }
                  : { color: 'var(--sf-text-2)' }
              }
              aria-label={`Sayfa ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ),
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Sonraki sayfa"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
}
