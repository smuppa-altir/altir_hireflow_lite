import type { ReactNode } from 'react'
import { cn } from '@/utils'

interface FieldLabelProps {
  htmlFor?: string
  required?: boolean
  className?: string
  children: ReactNode
}

export function FieldLabel({ htmlFor, required, className, children }: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300', className)}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-red-500" aria-hidden>
          *
        </span>
      )}
    </label>
  )
}
