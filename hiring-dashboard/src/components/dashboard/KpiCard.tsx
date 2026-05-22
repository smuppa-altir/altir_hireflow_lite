import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardCard } from './DashboardCard'
import { cn } from '@/utils'

interface KpiCardProps {
  label: string
  value: number | string
  trend?: string
  trendType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  accent?: string
  /** When set, the whole card links to this route (e.g. Interviews list) */
  to?: string
}

export function KpiCard({
  label,
  value,
  trend,
  trendType = 'neutral',
  icon: Icon,
  accent = 'from-indigo-500/20 to-violet-500/10 text-indigo-600 dark:text-indigo-400',
  to,
}: KpiCardProps) {
  const trendColors = {
    positive: 'text-emerald-600 dark:text-emerald-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-zinc-500',
  }

  const card = (
    <DashboardCard
      className={cn(
        'group transition-colors hover:border-zinc-300 dark:hover:border-zinc-700/80',
        to && 'cursor-pointer',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br',
            accent,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        {trend && trendType !== 'neutral' && (
          <span className={cn('flex items-center gap-0.5 text-xs', trendColors[trendType])}>
            {trendType === 'positive' ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          {value}
        </p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
        {trend && <p className={cn('mt-2 text-xs', trendColors[trendType])}>{trend}</p>}
      </div>
    </DashboardCard>
  )

  if (to) {
    return (
      <Link to={to} className="block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
        {card}
      </Link>
    )
  }

  return card
}
