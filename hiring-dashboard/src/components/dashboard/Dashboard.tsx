import { Briefcase, CalendarClock, Gift, UserCheck, Users } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { PageHeader } from '@/components/common'
import { Spinner } from '@/components/ui'
import { dashboardService, getApiErrorMessage, interviewApi } from '@/services'
import { getLocalDayBoundsISO } from '@/utils'
import { CandidateStagePieChart } from './CandidateStagePieChart'
import { HiringFunnelChart } from './HiringFunnelChart'
import { KpiCard } from './KpiCard'
import { RecentActivityWidget } from './RecentActivityWidget'
import { UpcomingInterviewsWidget } from './UpcomingInterviewsWidget'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export function Dashboard() {
  const [stats, setStats] = useState({
    openJobs: 0,
    totalCandidates: 0,
    offers: 0,
    hired: 0,
  })
  const [interviewsToday, setInterviewsToday] = useState(0)
  const [interviewsTodayLoading, setInterviewsTodayLoading] = useState(true)
  const [loading, setLoading] = useState(!USE_MOCK)
  const [error, setError] = useState<string | null>(null)

  const loadInterviewsScheduledToday = useCallback(() => {
    const { dateFrom, dateTo } = getLocalDayBoundsISO()
    setInterviewsTodayLoading(true)
    interviewApi
      .getInterviews({
        pageSize: 100,
        status: 'scheduled',
        dateFrom,
        dateTo,
      })
      .then((result) => setInterviewsToday(result.total))
      .catch(() => setInterviewsToday(0))
      .finally(() => setInterviewsTodayLoading(false))
  }, [])

  const loadStats = () => {
    if (USE_MOCK) return
    setLoading(true)
    setError(null)
    dashboardService
      .getStats()
      .then(setStats)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadStats()
    loadInterviewsScheduledToday()
  }, [loadInterviewsScheduledToday])

  // Refetch when user returns to this tab (e.g. after scheduling on Interviews)
  useEffect(() => {
    const onFocus = () => {
      loadStats()
      loadInterviewsScheduledToday()
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [loadInterviewsScheduledToday])

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your hiring pipeline and team activity"
        actions={
          <Link
            to={ROUTES.CANDIDATES}
            className="inline-flex h-9 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm shadow-indigo-500/20 transition-colors hover:bg-indigo-500"
          >
            View candidates
          </Link>
        }
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      )}

      {loading && !USE_MOCK ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <section aria-label="Key metrics">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <KpiCard
              label="Open Jobs"
              value={stats.openJobs}
              trend={`${stats.openJobs} active postings`}
              trendType="neutral"
              icon={Briefcase}
              accent="from-blue-500/20 to-indigo-500/10 text-blue-400"
            />
            <KpiCard
              label="Total Candidates"
              value={stats.totalCandidates}
              trend={`${stats.totalCandidates} in pipeline`}
              trendType="neutral"
              icon={Users}
              accent="from-indigo-500/20 to-violet-500/10 text-indigo-400"
            />
            <KpiCard
              label="Offers"
              value={stats.offers}
              trend={`${stats.offers} at offer stage`}
              trendType="neutral"
              icon={Gift}
              accent="from-amber-500/20 to-orange-500/10 text-amber-400"
            />
            <KpiCard
              label="Hired"
              value={stats.hired}
              trend={`${stats.hired} hired`}
              trendType="positive"
              icon={UserCheck}
              accent="from-emerald-500/20 to-green-500/10 text-emerald-400"
            />
            <KpiCard
              label="Interviews Scheduled Today"
              value={interviewsTodayLoading ? '—' : interviewsToday}
              trend={
                interviewsTodayLoading
                  ? 'Loading today’s schedule…'
                  : interviewsToday === 1
                    ? '1 interview scheduled today'
                    : `${interviewsToday} interviews scheduled today`
              }
              trendType="neutral"
              icon={CalendarClock}
              accent="from-violet-500/20 to-purple-500/10 text-violet-600 dark:text-violet-400"
              to={ROUTES.INTERVIEWS}
            />
          </div>
        </section>
      )}

      <section aria-label="Analytics" className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-6">
        <div className="lg:col-span-3">
          <HiringFunnelChart />
        </div>
        <div className="lg:col-span-2">
          <CandidateStagePieChart />
        </div>
      </section>

      <section
        aria-label="Activity and interviews"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6"
      >
        <UpcomingInterviewsWidget />
        <RecentActivityWidget />
      </section>
    </div>
  )
}
