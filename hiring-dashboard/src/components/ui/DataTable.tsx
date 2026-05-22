import type { ReactNode } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/utils'

export interface DataTableColumn<T> {
  key: string
  header: string
  render?: (row: T, index: number) => ReactNode
  className?: string
  headerClassName?: string
  sortable?: boolean
  sortAriaLabel?: string
}

export interface DataTablePagination {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  pagination?: DataTablePagination
  emptyMessage?: string
  className?: string
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  onSort?: (key: string) => void
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  pagination,
  emptyMessage = 'No data found',
  className,
  sortKey,
  sortDir,
  onSort,
}: DataTableProps<T>) {
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1
  const start = pagination ? (pagination.page - 1) * pagination.pageSize + 1 : 1
  const end = pagination
    ? Math.min(pagination.page * pagination.pageSize, pagination.total)
    : data.length

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/50',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/50">
              {columns.map((col) => {
                const isActive = col.sortable && sortKey === col.key
                return (
                  <th
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500',
                      col.headerClassName,
                    )}
                  >
                    {col.sortable && onSort ? (
                      <button
                        type="button"
                        onClick={() => onSort(col.key)}
                        aria-label={col.sortAriaLabel ?? `Sort by ${col.header}`}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-md transition-colors hover:text-indigo-600 dark:hover:text-indigo-400',
                          isActive && 'text-indigo-600 dark:text-indigo-400',
                        )}
                      >
                        {col.header}
                        {isActive ? (
                          sortDir === 'asc' ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )
                        ) : (
                          <span className="inline-flex flex-col opacity-40">
                            <ChevronUp className="-mb-1 h-2.5 w-2.5" />
                            <ChevronDown className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-16 text-center text-sm text-zinc-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={keyExtractor(row)}
                  className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50 dark:border-zinc-800/60 dark:hover:bg-zinc-800/30"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3.5 text-zinc-700 dark:text-zinc-300',
                        col.className,
                      )}
                    >
                      {col.render
                        ? col.render(row, index)
                        : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.total > 0 && (
        <div className="flex flex-col gap-3 border-t border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">Showing {start}–{end} of {pagination.total}</p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="min-w-[4rem] text-center text-xs text-zinc-500 dark:text-zinc-400">
              Page {pagination.page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
