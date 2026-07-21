import { cn } from '@/lib/utils/cn';
import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, rows = 4, ...props }, ref) => {
    const textareaId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="mb-1 block text-sm font-medium text-white/70">
            {label}
            {props.required && <span className="ml-0.5 text-danger-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'block w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white shadow-sm transition-colors placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
              : 'border-white/10 focus:border-primary-500 focus:ring-primary-500',
            props.disabled && 'cursor-not-allowed bg-white/5 text-white/40',
            className,
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="mt-1 text-xs text-white/40">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${textareaId}-error`} className="mt-1 text-xs text-danger-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea, type TextareaProps };
