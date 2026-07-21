import { cn } from '@/lib/utils/cn';
import { type ReactNode } from 'react';

const badgeVariants = {
  default: 'bg-white/10 text-white/80 border-white/10',
  primary: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
};

interface BadgeProps {
  children: ReactNode;
  variant?: keyof typeof badgeVariants;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        badgeVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export { badgeVariants };
