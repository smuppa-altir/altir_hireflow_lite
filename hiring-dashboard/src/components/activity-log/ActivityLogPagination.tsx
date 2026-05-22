import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ShadcnButton } from '@/components/ui/shadcn-button'

interface ActivityLogPaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function ActivityLogPagination({
  page,
  pageSize,
  total,
  onPageChange,
}: ActivityLogPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800/80 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-zinc-600 dark:text-zinc-500">
        Showing {start}–{end} of {total} events
      </p>
      <div className="flex items-center gap-2">
        <ShadcnButton
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </ShadcnButton>
        <span className="min-w-[5rem] text-center text-sm text-zinc-500 dark:text-zinc-400">
          Page {page} of {totalPages}
        </span>
        <ShadcnButton
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </ShadcnButton>
      </div>
    </div>
  )
}
