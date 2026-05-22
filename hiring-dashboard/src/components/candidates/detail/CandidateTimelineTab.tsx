import {
  ArrowRight,
  Calendar,
  FileText,
  Gift,
  Mail,
  MessageSquare,
  RefreshCw,
  UserPlus,
} from 'lucide-react'
import type { CandidateDetail, TimelineEventType } from '@/types/candidateDetail'
import { cn, formatDateTime, formatRelativeTime } from '@/utils'

interface CandidateTimelineTabProps {
  candidate: CandidateDetail
}

const eventConfig: Record<
  TimelineEventType,
  { icon: typeof Calendar; color: string; bg: string }
> = {
  application: {
    icon: UserPlus,
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50 ring-1 ring-blue-100 dark:bg-blue-500/15 dark:ring-0',
  },
  stage_change: {
    icon: RefreshCw,
    color: 'text-violet-700 dark:text-violet-400',
    bg: 'bg-violet-50 ring-1 ring-violet-100 dark:bg-violet-500/15 dark:ring-0',
  },
  interview: {
    icon: Calendar,
    color: 'text-indigo-700 dark:text-indigo-400',
    bg: 'bg-indigo-50 ring-1 ring-indigo-100 dark:bg-indigo-500/15 dark:ring-0',
  },
  feedback: {
    icon: MessageSquare,
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 ring-1 ring-amber-100 dark:bg-amber-500/15 dark:ring-0',
  },
  offer: {
    icon: Gift,
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-500/15 dark:ring-0',
  },
  email: {
    icon: Mail,
    color: 'text-zinc-700 dark:text-zinc-400',
    bg: 'bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-500/15 dark:ring-0',
  },
  note: {
    icon: FileText,
    color: 'text-zinc-700 dark:text-zinc-400',
    bg: 'bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-500/15 dark:ring-0',
  },
}

export function CandidateTimelineTab({ candidate }: CandidateTimelineTabProps) {
  return (
    <div className="relative">
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-500">
        {candidate.timeline.length} activities in hiring history
      </p>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800/80 dark:bg-zinc-900/30">
        <ul className="space-y-0">
          {candidate.timeline.map((event, index) => {
            const config = eventConfig[event.type]
            const Icon = config.icon
            const isLast = index === candidate.timeline.length - 1

            return (
              <li key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
                {!isLast && (
                  <span
                    className="absolute left-[19px] top-10 h-[calc(100%-16px)] w-px bg-zinc-200 dark:bg-zinc-800"
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

                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{event.title}</p>
                    <time
                      className="shrink-0 text-xs text-zinc-500"
                      dateTime={event.timestamp}
                    >
                      {formatRelativeTime(event.timestamp)}
                    </time>
                  </div>
                  {event.description && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {event.description}
                    </p>
                  )}
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span>{event.actor}</span>
                    <span className="text-zinc-300 dark:text-zinc-700">·</span>
                    <span className="text-zinc-400 dark:text-zinc-600">
                      {formatDateTime(event.timestamp)}
                    </span>
                  </p>
                </div>
              </li>
            )
          })}
        </ul>

        {candidate.timeline.length === 0 && (
          <div className="flex flex-col items-center py-12 text-center">
            <ArrowRight className="h-8 w-8 text-zinc-400 dark:text-zinc-600" />
            <p className="mt-2 text-sm text-zinc-500">No activity recorded</p>
          </div>
        )}
      </div>
    </div>
  )
}
