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
          <label htmlFor={selectId} className="mb-1 block text-sm font-medium text-white/70">
            {label}
            {props.required && <span className="ml-0.5 text-danger-500">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'block w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
              : 'border-white/10 focus:border-primary-500 focus:ring-primary-500',
            props.disabled && 'cursor-not-allowed bg-white/5 text-white/40',
            className,
          )}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="bg-[#0A0A0B] text-white/50">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0A0A0B] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        {hint && !error && <p className="mt-1 text-xs text-white/40">{hint}</p>}
        {error && <p className="mt-1 text-xs text-danger-400">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';

export { Select, type SelectProps, type SelectOption };
