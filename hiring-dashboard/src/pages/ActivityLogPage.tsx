import { History } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { PageHeader, SearchBar } from '@/components/common'
import {
  ACTIVITY_LOG_MOCK_DATA,
  ACTION_FILTER_OPTIONS,
  ActivityLogPagination,
  ActivityTimeline,
} from '@/components/activity-log'
import { EmptyState, Select } from '@/components/ui'
import { useDebounce } from '@/hooks'
import type { ActivityActionType } from '@/types/activityLog'

const PAGE_SIZE = 8

export function ActivityLogPage() {
  const [events] = useState(ACTIVITY_LOG_MOCK_DATA)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState<ActivityActionType | ''>('')
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebounce(search, 300)

  const filteredEvents = useMemo(() => {
    let result = [...events]

    if (actionFilter) {
      result = result.filter((e) => e.action === actionFilter)
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.actor.toLowerCase().includes(q) ||
          e.candidateName?.toLowerCase().includes(q) ||
          e.jobTitle?.toLowerCase().includes(q),
      )
    }

    return result.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
  }, [events, actionFilter, debouncedSearch])

  const total = filteredEvents.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredEvents.slice(start, start + PAGE_SIZE)
  }, [filteredEvents, currentPage])

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

      {/* Search & filters */}
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

      {/* Timeline */}
      {total === 0 ? (
        <EmptyState
          icon={History}
          title="No activity found"
          description="Try adjusting your search or action filter"
        />
      ) : (
        <div className="space-y-4">
          <ActivityTimeline events={paginatedEvents} />
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
