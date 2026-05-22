import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { ACTION_CONFIG } from './activityLogConstants'
import type { ActivityLogEntry } from '@/types/activityLog'
import { cn, formatDateTime, formatRelativeTime } from '@/utils'

interface ActivityTimelineProps {
  events: ActivityLogEntry[]
  className?: string
}

export function ActivityTimeline({ events, className }: ActivityTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">No activity found</p>
        <p className="mt-1 text-xs text-zinc-500">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800/80 dark:bg-zinc-900/30',
        className,
      )}
    >
      <ul className="space-y-0">
        {events.map((event, index) => {
          const config = ACTION_CONFIG[event.action] ?? ACTION_CONFIG.note_added
          const Icon = config.icon
          const isLast = index === events.length - 1

          return (
            <li key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast && (
                <span
                  className="absolute left-[19px] top-10 h-[calc(100%-16px)] w-px bg-zinc-200 dark:bg-gradient-to-b dark:from-zinc-700 dark:to-zinc-800/50"
                  aria-hidden
                />
              )}

              <div
                className={cn(
                  'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-white dark:ring-zinc-900/50',
                  config.bg,
                )}
              >
                <Icon className={cn('h-4 w-4', config.color)} />
              </div>

              <div className="min-w-0 flex-1 rounded-lg border border-transparent py-0.5 transition-colors hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-zinc-800/60 dark:hover:bg-zinc-950/30">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{event.title}</p>
                    <span
                      className={cn(
                        'mt-1 inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                        config.bg,
                        config.color,
                      )}
                    >
                      {config.label}
                    </span>
                  </div>
                  <time
                    className="shrink-0 text-xs text-zinc-500"
                    dateTime={event.timestamp}
                    title={formatDateTime(event.timestamp)}
                  >
                    {formatRelativeTime(event.timestamp)}
                  </time>
                </div>

                {event.description && (
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {event.description}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
                  <span>{event.actor}</span>
                  {event.candidateName && (
                    <>
                      <span className="text-zinc-300 dark:text-zinc-700">·</span>
                      {event.candidateId ? (
                        <Link
                          to={ROUTES.CANDIDATE_DETAIL.replace(':id', event.candidateId)}
                          className="text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          {event.candidateName}
                        </Link>
                      ) : (
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {event.candidateName}
                        </span>
                      )}
                    </>
                  )}
                  {event.jobTitle && (
                    <>
                      <span className="text-zinc-300 dark:text-zinc-700">·</span>
                      <span>{event.jobTitle}</span>
                    </>
                  )}
                </div>

                <p className="mt-1.5 text-[11px] text-zinc-400 dark:text-zinc-600">
                  {formatDateTime(event.timestamp)}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
