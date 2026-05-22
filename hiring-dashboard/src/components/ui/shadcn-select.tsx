import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/utils'

const ShadcnSelect = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus-visible:ring-offset-zinc-900',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
)
ShadcnSelect.displayName = 'ShadcnSelect'

export { ShadcnSelect }
