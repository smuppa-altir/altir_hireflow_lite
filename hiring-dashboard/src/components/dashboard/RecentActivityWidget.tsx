import {
  Briefcase,
  Calendar,
  Gift,
  MessageSquare,
  RefreshCw,
  UserCheck,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { Spinner } from '@/components/ui'
import { activityApi, getApiErrorMessage } from '@/services'
import {
  mapApiActivityToDashboardItem,
  type DashboardActivityItem,
  type DashboardActivityType,
} from '@/utils/activityFormat'
import { DashboardCard, DashboardCardHeader } from './DashboardCard'
import { cn, formatRelativeTime } from '@/utils'

const linkClass =
  'text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300'

const activityConfig: Record<
  DashboardActivityType,
  { icon: typeof Briefcase; iconClass: string; bgClass: string }
> = {
  application: {
    icon: Briefcase,
    iconClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-50 ring-1 ring-blue-100 dark:bg-blue-500/15 dark:ring-0',
  },
  interview: {
    icon: Calendar,
    iconClass: 'text-violet-600 dark:text-violet-400',
    bgClass: 'bg-violet-50 ring-1 ring-violet-100 dark:bg-violet-500/15 dark:ring-0',
  },
  offer: {
    icon: Gift,
    iconClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-50 ring-1 ring-amber-100 dark:bg-amber-500/15 dark:ring-0',
  },
  hire: {
    icon: UserCheck,
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-500/15 dark:ring-0',
  },
  status: {
    icon: RefreshCw,
    iconClass: 'text-zinc-600 dark:text-zinc-400',
    bgClass: 'bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-500/15 dark:ring-0',
  },
  comment: {
    icon: MessageSquare,
    iconClass: 'text-indigo-600 dark:text-indigo-400',
    bgClass: 'bg-indigo-50 ring-1 ring-indigo-100 dark:bg-indigo-500/15 dark:ring-0',
  },
}

const RECENT_LIMIT = 6

export function RecentActivityWidget() {
  const [items, setItems] = useState<DashboardActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    activityApi
      .getRecent(RECENT_LIMIT)
      .then((logs) => setItems(logs.map(mapApiActivityToDashboardItem)))
      .catch((err) => {
        setError(getApiErrorMessage(err))
        setItems([])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [load])

  return (
    <DashboardCard className="h-full">
      <DashboardCardHeader
        title="Recent Activity"
        description="Latest updates across your workspace"
        action={
          <Link to={ROUTES.ACTIVITY_LOG} className={linkClass}>
            View log
          </Link>
        }
      />
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-6 w-6" />
        </div>
      ) : error ? (
        <p className="py-6 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : items.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-500">No recent activity yet</p>
      ) : (
        <ul className="relative">
          {items.map((item, index) => {
            const config = activityConfig[item.type]
            const Icon = config.icon
            const isLast = index === items.length - 1

            return (
              <li key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
                {!isLast && (
                  <span
                    className="absolute left-[17px] top-9 h-[calc(100%-8px)] w-px bg-zinc-200 dark:bg-zinc-800"
                    aria-hidden
                  />
                )}
                <div
                  className={cn(
                    'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                    config.bgClass,
                  )}
                >
                  <Icon className={cn('h-4 w-4', config.iconClass)} />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm leading-snug text-zinc-800 dark:text-zinc-300">
                    {item.message}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {item.actor} · {formatRelativeTime(item.timestamp)}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </DashboardCard>
  )
}
