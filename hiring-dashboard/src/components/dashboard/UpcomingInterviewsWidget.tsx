import { Calendar, Clock, Video } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  INTERVIEW_ROUND_LABELS,
  ROUTES,
} from '@/constants'
import { DashboardCard, DashboardCardHeader } from './DashboardCard'
import { interviewApi } from '@/services'
import type { Interview } from '@/types/interview'
import { formatDateTimeDDMMYYYY, getLocalDayBoundsISO } from '@/utils'

const linkClass =
  'text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300'

export function UpcomingInterviewsWidget() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { dateFrom } = getLocalDayBoundsISO()
    interviewApi
      .getInterviews({
        pageSize: 8,
        status: 'scheduled',
        dateFrom,
      })
      .then((result) => setInterviews(result.data))
      .catch(() => setInterviews([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardCard className="h-full">
      <DashboardCardHeader
        title="Upcoming Interviews"
        description="Scheduled from today onward (same data as Interviews)"
        action={
          <Link to={ROUTES.INTERVIEWS} className={linkClass}>
            View all
          </Link>
        }
      />
      {loading ? (
        <p className="text-sm text-zinc-500">Loading interviews…</p>
      ) : interviews.length === 0 ? (
        <p className="text-sm text-zinc-500">No upcoming interviews scheduled.</p>
      ) : (
        <ul className="space-y-2.5">
          {interviews.map((interview) => (
            <li
              key={interview.id}
              className="flex gap-3 rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800/60 dark:bg-zinc-950/40 dark:hover:border-zinc-700/80 dark:hover:bg-zinc-900/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/15">
                <Video className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {interview.candidateName}
                </p>
                <p className="truncate text-xs text-zinc-600 dark:text-zinc-500">
                  {interview.jobTitle}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-zinc-400" />
                    {formatDateTimeDDMMYYYY(interview.scheduledAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-zinc-400" />
                    {interview.durationMinutes} min
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-600">
                  {INTERVIEW_ROUND_LABELS[interview.round]} · {interview.interviewerName}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  )
}
