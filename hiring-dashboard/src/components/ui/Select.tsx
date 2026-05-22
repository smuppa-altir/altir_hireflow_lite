import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  labelRequired?: boolean
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, labelRequired, options, placeholder, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
            {labelRequired && (
              <span className="ml-0.5 text-red-500" aria-hidden>
                *
              </span>
            )}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm',
            'text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500',
            'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  },
)

Select.displayName = 'Select'
