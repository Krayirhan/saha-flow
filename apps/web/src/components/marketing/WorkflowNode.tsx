/**
 * WorkflowNode — Saha Flow Flow Line node primitive
 *
 * Displays a single work-order state as a visual node.
 * Use with FlowConnector to build a flow timeline.
 *
 * DESIGN.md §4: Node sizes must be consistent.
 *               Icons only when they clarify state.
 *               State colors must be preserved from FLOW_STATE_CONFIG.
 */

import { cn } from '@/lib/utils/cn';
import { FLOW_STATE_CONFIG, type FlowState } from './FlowLine';
import type { ReactNode } from 'react';

// ── Status dot icons ─────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DotIcon() {
  return <div className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />;
}

function PulseIcon({ color }: { color: string }) {
  return (
    <div className="relative flex h-2 w-2 items-center justify-center" aria-hidden="true">
      <div
        className="absolute inline-flex h-full w-full animate-node-pulse rounded-full opacity-75"
        style={{ backgroundColor: color }}
      />
      <div className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
    </div>
  );
}

// ── WorkflowNode ─────────────────────────────────────────────────────────────

interface WorkflowNodeProps {
  state: FlowState;
  /** Whether the node has been reached (past or current) */
  active?: boolean;
  /** Whether this is the current active state (pulsing) */
  current?: boolean;
  /** Optional label shown beside the node */
  label?: string;
  /** Optional sublabel / timestamp */
  sublabel?: string;
  /** Custom icon — overrides auto icon */
  icon?: ReactNode;
  /** Layout direction */
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export function WorkflowNode({
  state,
  active = false,
  current = false,
  label,
  sublabel,
  icon,
  layout = 'horizontal',
  className,
}: WorkflowNodeProps) {
  const cfg = FLOW_STATE_CONFIG[state];

  const nodeSize = 32;
  const borderWidth = 2;

  const nodeStyle: React.CSSProperties = {
    width: nodeSize,
    height: nodeSize,
    minWidth: nodeSize,
    borderRadius: '50%',
    border: `${borderWidth}px solid`,
    borderColor: active || current ? cfg.border : 'rgba(255,255,255,0.12)',
    backgroundColor: active || current ? cfg.bg : 'rgba(255,255,255,0.04)',
    color: active || current ? cfg.color : 'rgba(255,255,255,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease',
    flexShrink: 0,
  };

  const nodeContent = icon ?? (
    current ? (
      <PulseIcon color={cfg.color} />
    ) : active ? (
      state === 'completed' ? <CheckIcon /> : <DotIcon />
    ) : (
      <DotIcon />
    )
  );

  if (layout === 'vertical') {
    // Vertical: node stacked above label
    return (
      <div className={cn('flex flex-col items-center gap-2', className)}>
        <div style={nodeStyle} role="img" aria-label={cfg.label}>
          {nodeContent}
        </div>
        {(label || sublabel) && (
          <div className="text-center">
            {label && (
              <p
                className="text-xs font-semibold leading-tight"
                style={{ color: active || current ? cfg.color : 'rgba(255,255,255,0.35)' }}
              >
                {label}
              </p>
            )}
            {sublabel && (
              <p className="mt-0.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {sublabel}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Horizontal: node + label side-by-side
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <div style={nodeStyle} role="img" aria-label={cfg.label}>
        {nodeContent}
      </div>
      {(label || sublabel) && (
        <div className="min-w-0">
          {label && (
            <p
              className="text-sm font-semibold leading-tight"
              style={{ color: active || current ? cfg.color : 'rgba(255,255,255,0.5)' }}
            >
              {label}
            </p>
          )}
          {sublabel && (
            <p className="mt-0.5 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {sublabel}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── StateChip — compact inline state badge ───────────────────────────────────

interface StateChipProps {
  state: FlowState;
  className?: string;
}

/**
 * Compact chip for displaying a work-order state inline.
 * Use in panels, cards, and tables — not as the primary flow indicator.
 */
export function StateChip({ state, className }: StateChipProps) {
  const cfg = FLOW_STATE_CONFIG[state];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        className,
      )}
      style={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cfg.color }} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}
