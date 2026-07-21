import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

const variants = {
  primary: 'bg-white text-[#0A0A0B] hover:bg-white/90 focus:ring-primary-500 disabled:opacity-60 shadow-lg shadow-white/10',
  secondary: 'border border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10 hover:text-white focus:ring-primary-500 disabled:opacity-60',
  danger: 'bg-danger-500 text-white hover:bg-danger-700 focus:ring-danger-500 disabled:opacity-60',
  ghost: 'text-white/70 hover:bg-white/10 hover:text-white focus:ring-white/50 disabled:text-white/40',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
  loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, loadingText, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed',
          variants[variant],
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
