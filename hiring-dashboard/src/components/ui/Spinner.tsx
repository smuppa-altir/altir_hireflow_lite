import { cn } from '@/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'animate-spin rounded-full border-2 border-zinc-200 border-t-brand-600',
        'dark:border-zinc-700 dark:border-t-brand-500',
        sizeMap[size],
        className,
      )}
    />
  )
}
