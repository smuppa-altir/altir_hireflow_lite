import type { ReactNode } from 'react'
import { cn } from '@/utils'

interface DashboardCardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export function DashboardCard({ children, className, padding = 'md' }: DashboardCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-200 bg-white shadow-sm',
        'dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:shadow-none dark:backdrop-blur-sm',
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </div>
  )
}

interface DashboardCardHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function DashboardCardHeader({
  title,
  description,
  action,
  className,
}: DashboardCardHeaderProps) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-start justify-between gap-3', className)}>
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
