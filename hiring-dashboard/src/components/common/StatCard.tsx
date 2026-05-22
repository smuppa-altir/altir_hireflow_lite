import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils'
import { Card } from '@/components/ui'

interface StatCardProps {
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  iconColor?: string
}

export function StatCard({
  label,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400',
}: StatCardProps) {
  const changeColors = {
    positive: 'text-emerald-600 dark:text-emerald-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-zinc-500 dark:text-zinc-400',
  }

  return (
    <Card hover className="flex items-start gap-4">
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', iconColor)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className="mt-0.5 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {value}
        </p>
        {change && (
          <p className={cn('mt-1 text-xs', changeColors[changeType])}>{change}</p>
        )}
      </div>
    </Card>
  )
}
