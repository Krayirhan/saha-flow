import { cn } from '@/lib/utils/cn';
import { type ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

const badgeStyles: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  default:  { bg: 'rgba(255,255,255,0.06)', color: 'var(--sf-text-2)',    border: 'var(--sf-border)' },
  primary:  { bg: 'rgba(79,140,255,0.1)',   color: 'var(--sf-open)',      border: 'rgba(79,140,255,0.25)' },
  success:  { bg: 'rgba(56,217,150,0.1)',   color: 'var(--sf-completed)', border: 'rgba(56,217,150,0.25)' },
  warning:  { bg: 'rgba(255,170,76,0.1)',   color: 'var(--sf-in-progress)',border: 'rgba(255,170,76,0.25)' },
  danger:   { bg: 'rgba(255,95,109,0.1)',   color: 'var(--sf-sla-risk)',  border: 'rgba(255,95,109,0.25)' },
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const s = badgeStyles[variant];
  return (
    <span
      className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium', className)}
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {children}
    </span>
  );
}

export { badgeStyles };
