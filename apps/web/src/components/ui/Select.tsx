import { cn } from '@/lib/utils/cn';
import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, placeholder, id, ...props }, ref) => {
    const selectId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="sf-label">
            {label}
            {props.required && <span className="ml-0.5" style={{ color: 'var(--sf-sla-risk)' }}>*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn('sf-field', error && 'sf-field-error', className)}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled style={{ background: 'var(--sf-bg)', color: 'var(--sf-text-muted)' }}>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: 'var(--sf-bg)', color: 'var(--sf-text)' }}>
              {opt.label}
            </option>
          ))}
        </select>
        {hint && !error && <p className="mt-1 text-xs" style={{ color: 'var(--sf-text-muted)' }}>{hint}</p>}
        {error && <p className="mt-1 text-xs" style={{ color: 'var(--sf-sla-risk)' }}>{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';

export { Select, type SelectProps, type SelectOption };
