import { cn } from '@/lib/utils/cn';
import { type ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

const badgeStyles: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  default:  { bg: 'var(--sf-bg-2)',          color: 'var(--sf-text-2)',     border: 'var(--sf-border)' },
  primary:  { bg: 'var(--sf-accent-bg)',     color: 'var(--sf-open)',       border: 'rgba(0,82,204,0.3)' },
  success:  { bg: 'rgba(0,135,90,0.1)',      color: 'var(--sf-completed)',  border: 'rgba(0,135,90,0.3)' },
  warning:  { bg: 'rgba(255,139,0,0.1)',     color: 'var(--sf-in-progress)',border: 'rgba(255,139,0,0.3)' },
  danger:   { bg: 'rgba(222,53,11,0.1)',     color: 'var(--sf-sla-risk)',   border: 'rgba(222,53,11,0.3)' },
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
      className={cn('inline-flex items-center rounded px-2 py-0.5 text-xs font-medium', className)}
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {children}
    </span>
  );
}

export { badgeStyles };
