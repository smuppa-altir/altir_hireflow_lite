import { History } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { PageHeader, SearchBar } from '@/components/common'
import {
  ACTION_FILTER_OPTIONS,
  ActivityLogPagination,
  ActivityTimeline,
} from '@/components/activity-log'
import { EmptyState, Select, Spinner } from '@/components/ui'
import { useDebounce } from '@/hooks'
import { activityApi, getApiErrorMessage } from '@/services'
import { mapApiActivityToLogEntry } from '@/services/activityMappers'
import type { ActivityActionType, ActivityLogEntry } from '@/types/activityLog'

const PAGE_SIZE = 8

export function ActivityLogPage() {
  const [events, setEvents] = useState<ActivityLogEntry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState<ActivityActionType | ''>('')
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebounce(search, 300)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    activityApi
      .list({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch || undefined,
        action: actionFilter || undefined,
      })
      .then((result) => {
        setEvents(result.data.map(mapApiActivityToLogEntry))
        setTotal(result.total)
      })
      .catch((err) => {
        setError(getApiErrorMessage(err))
        setEvents([])
        setTotal(0)
      })
      .finally(() => setLoading(false))
  }, [page, debouncedSearch, actionFilter])

  useEffect(() => {
    load()
  }, [load])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const handleActionFilterChange = useCallback((value: ActivityActionType | '') => {
    setActionFilter(value)
    setPage(1)
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Log"
        description="Audit trail of actions across your hiring workspace"
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by title, candidate, job, or actor..."
          className="flex-1"
        />
        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={[...ACTION_FILTER_OPTIONS]}
            value={actionFilter}
            onChange={(e) => handleActionFilterChange(e.target.value as ActivityActionType | '')}
            className="lg:w-56"
          />
          {(actionFilter || search) && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setActionFilter('')
                setPage(1)
              }}
              className="text-sm text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : error ? (
        <p className="py-8 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : total === 0 ? (
        <EmptyState
          icon={History}
          title="No activity found"
          description="Try adjusting your search or action filter"
        />
      ) : (
        <div className="space-y-4">
          <ActivityTimeline events={events} />
          <ActivityLogPagination
            page={currentPage}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}
