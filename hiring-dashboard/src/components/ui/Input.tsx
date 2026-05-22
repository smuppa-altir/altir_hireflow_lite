import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  /** Shows a red asterisk next to the label */
  labelRequired?: boolean
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, labelRequired, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
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
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 w-full rounded-lg border bg-white px-3 text-sm text-zinc-900',
            'placeholder:text-zinc-400 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            'dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500',
            error
              ? 'border-red-300 dark:border-red-800'
              : 'border-zinc-200 dark:border-zinc-700',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
