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
          <label htmlFor={textareaId} className="sf-label">
            {label}
            {props.required && <span className="ml-0.5" style={{ color: 'var(--sf-sla-risk)' }}>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn('sf-field resize-none', error && 'sf-field-error', className)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="mt-1 text-xs" style={{ color: 'var(--sf-text-muted)' }}>
            {hint}
          </p>
        )}
        {error && (
          <p id={`${textareaId}-error`} className="mt-1 text-xs" style={{ color: 'var(--sf-sla-risk)' }}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea, type TextareaProps };
