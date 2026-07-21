import { cn } from '@/lib/utils/cn';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { type ReactNode } from 'react';

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
}: TableProps<T>) {
  const renderSortIcon = (col: Column<T>) => {
    if (!col.sortable) return null;
    if (sortKey !== col.key)
      return <ArrowUpDown className="ml-1 inline h-3 w-3 text-white/40" />;
    if (sortDirection === 'asc')
      return <ArrowUp className="ml-1 inline h-3 w-3 text-primary-400" />;
    if (sortDirection === 'desc')
      return <ArrowDown className="ml-1 inline h-3 w-3 text-primary-400" />;
    return <ArrowUpDown className="ml-1 inline h-3 w-3 text-white/40" />;
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] shadow-sm backdrop-blur-sm">
      <table className="min-w-full divide-y divide-white/10 text-sm">
        <thead className="bg-white/[0.03]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  'px-4 py-3 text-left font-semibold text-white/70',
                  col.sortable && 'cursor-pointer select-none hover:bg-white/5',
                  col.className,
                )}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                {col.header}
                {renderSortIcon(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-white/40">
                Yükleniyor...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-white/40">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={keyExtractor(item)}
                className={cn(
                  'transition-colors hover:bg-white/5',
                  rowClassName,
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3 text-white/80', col.className)}>
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
    </div>
  );
}

export type { Column, SortDirection };
