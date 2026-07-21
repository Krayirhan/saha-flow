/**
 * FlowLine — İşAkış design primitive
 *
 * A reusable system representing the operational lifecycle of a work order.
 * DESIGN.md §4: The Flow Line must always communicate a real workflow.
 * Never use as decoration.
 *
 * Animasyon: Animasyonsuz (CSS transition only). Hareket: WorkflowNode kullanır.
 * Reduced-motion: globals.css ile global olarak yönetilir.
 */

import { cn } from '@/lib/utils/cn';

// ── State definitions ────────────────────────────────────────────────────────

export type FlowState =
  | 'open'
  | 'assigned'
  | 'on-the-way'
  | 'in-progress'
  | 'completed'
  | 'sla-risk'
  | 'offline'
  | 'synced';

/** DESIGN.md §4.2 state colors */
export const FLOW_STATE_CONFIG: Record<
  FlowState,
  { color: string; bg: string; border: string; label: string }
> = {
  'open':        { color: '#4f8cff', bg: 'rgba(79,140,255,0.12)',  border: 'rgba(79,140,255,0.35)',  label: 'Açık' },
  'assigned':    { color: '#7d6cff', bg: 'rgba(125,108,255,0.12)', border: 'rgba(125,108,255,0.35)', label: 'Atandı' },
  'on-the-way':  { color: '#74b8ff', bg: 'rgba(116,184,255,0.12)', border: 'rgba(116,184,255,0.35)', label: 'Yolda' },
  'in-progress': { color: '#ffaa4c', bg: 'rgba(255,170,76,0.12)',  border: 'rgba(255,170,76,0.35)',  label: 'Devam Ediyor' },
  'completed':   { color: '#38d996', bg: 'rgba(56,217,150,0.12)',  border: 'rgba(56,217,150,0.35)',  label: 'Tamamlandı' },
  'sla-risk':    { color: '#ff5f6d', bg: 'rgba(255,95,109,0.12)',  border: 'rgba(255,95,109,0.35)',  label: 'SLA Riski' },
  'offline':     { color: '#747d8d', bg: 'rgba(116,125,141,0.12)', border: 'rgba(116,125,141,0.35)', label: 'Çevrimdışı' },
  'synced':      { color: '#3dd6d0', bg: 'rgba(61,214,208,0.12)',  border: 'rgba(61,214,208,0.35)',  label: 'Senkronize' },
};

// ── FlowConnector — vertical line between nodes ──────────────────────────────

interface FlowConnectorProps {
  active?: boolean;
  className?: string;
}

/**
 * Vertical connector line between two FlowNodes.
 * active: line is highlighted (node above is done).
 */
export function FlowConnector({ active = false, className }: FlowConnectorProps) {
  return (
    <div
      className={cn('mx-auto w-px', className)}
      style={{
        height: '40px',
        background: active
          ? 'linear-gradient(to bottom, rgba(79,140,255,0.5), rgba(79,140,255,0.1))'
          : 'rgba(255,255,255,0.07)',
        transition: 'background 0.4s ease',
      }}
      aria-hidden="true"
    />
  );
}

// ── FlowLine — full vertical or horizontal line ──────────────────────────────

interface FlowLineProps {
  /** Direction of the line */
  direction?: 'vertical' | 'horizontal';
  /** Progress 0–1 how much of the line is highlighted */
  progress?: number;
  className?: string;
  height?: number;
}

/**
 * A single continuous Flow Line.
 * Used in section backgrounds and lifecycle connectors.
 * progress: fraction of line filled with brand color (0 = none, 1 = full).
 */
export function FlowLine({
  direction = 'vertical',
  progress = 0,
  height = 120,
  className,
}: FlowLineProps) {
  const isVertical = direction === 'vertical';

  return (
    <div
      className={cn('relative overflow-hidden rounded-full', className)}
      style={
        isVertical
          ? { width: '1px', height: `${height}px`, background: 'rgba(255,255,255,0.07)' }
          : { height: '1px', width: '100%',         background: 'rgba(255,255,255,0.07)' }
      }
      aria-hidden="true"
    >
      <div
        style={
          isVertical
            ? {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
                background: 'linear-gradient(to bottom, #4f8cff, #7d6cff)',
                transition: 'height 0.6s ease',
              }
            : {
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
                background: 'linear-gradient(to right, #4f8cff, #7d6cff)',
                transition: 'width 0.6s ease',
              }
        }
      />
    </div>
  );
}
