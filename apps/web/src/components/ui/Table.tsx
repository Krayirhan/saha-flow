'use client';

import { cn } from '@/lib/utils/cn';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { type ReactNode } from 'react';
import { CardSpotlight } from './CardSpotlight';

interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  sortKey?: string | null;
  sortDirection?: SortDirection;
  onSort?: (key: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  rowClassName?: string;
  size?: 'default' | 'compact';
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  sortKey,
  sortDirection,
  onSort,
  loading = false,
  emptyMessage = 'Kayıt bulunamadı',
  rowClassName,
  size = 'default',
}: TableProps<T>) {
  const cellPy = size === 'compact' ? 'py-2' : 'py-3';
  const renderSortIcon = (col: Column<T>) => {
    if (!col.sortable) return null;
    if (sortKey !== col.key) return <ArrowUpDown className="ml-1 inline h-3 w-3" style={{ color: 'var(--sf-text-muted)' }} />;
    if (sortDirection === 'asc') return <ArrowUp className="ml-1 inline h-3 w-3" style={{ color: 'var(--sf-accent)' }} />;
    if (sortDirection === 'desc') return <ArrowDown className="ml-1 inline h-3 w-3" style={{ color: 'var(--sf-accent)' }} />;
    return <ArrowUpDown className="ml-1 inline h-3 w-3" style={{ color: 'var(--sf-text-muted)' }} />;
  };

  return (
    <CardSpotlight
      className="sf-gradient-card overflow-x-auto shadow-sm"
      spotlightColor="rgba(79,140,255,0.05)"
    >
      <table className="min-w-full text-sm">
        <thead style={{ borderBottom: '1px solid var(--sf-border)' }}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  `px-4 ${cellPy} text-left text-xs font-semibold uppercase tracking-wider`,
                  col.sortable && 'cursor-pointer select-none hover:bg-white/[0.03]',
                  col.className,
                )}
                style={{ color: 'var(--sf-text-muted)' }}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                {col.header}
                {renderSortIcon(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center" style={{ color: 'var(--sf-text-muted)' }}>
                Yükleniyor…
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center" style={{ color: 'var(--sf-text-muted)' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={keyExtractor(item)}
                className={cn('transition-colors hover:bg-white/[0.03]', rowClassName)}
                style={{ borderTop: idx === 0 ? undefined : '1px solid var(--sf-border)' }}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn(`px-4 ${cellPy}`, col.className)} style={{ color: 'var(--sf-text-2)' }}>
                    {col.render
                      ? col.render(item, idx)
                      : (item as Record<string, unknown>)[col.key] as ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </CardSpotlight>
  );
}

export type { Column, SortDirection };
