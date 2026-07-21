import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

const variantClass = {
  primary: 'sf-btn-shimmer font-semibold',
  secondary: 'sf-button-secondary',
  danger: 'sf-button-danger',
  ghost: 'sf-button-ghost',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClass;
  size?: keyof typeof sizes;
  loading?: boolean;
  loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', loading = false, loadingText, children, disabled, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sf-accent)] focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          variantClass[variant],
          sizes[size],
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading && loadingText ? loadingText : children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button, type ButtonProps };
