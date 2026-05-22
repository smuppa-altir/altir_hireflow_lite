import { Pencil, Trash2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { JOB_STATUS_COLORS, JOB_STATUS_LABELS, ROUTES } from '@/constants'
import { Badge, Button } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import type { Job } from '@/types'
import { cn, formatDate } from '@/utils'

interface JobTableProps {
  jobs: Job[]
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onEdit: (job: Job) => void
  onDelete: (job: Job) => void
  emptyMessage?: string
}

export function JobTable({
  jobs,
  page,
  pageSize,
  total,
  onPageChange,
  onEdit,
  onDelete,
  emptyMessage = 'No jobs found',
}: JobTableProps) {
  const columns: DataTableColumn<Job>[] = [
    {
      key: 'title',
      header: 'Job Title',
      render: (job) => (
        <Link
          to={ROUTES.JOB_DETAIL.replace(':id', job.id)}
          className="font-medium text-zinc-900 transition-colors hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
        >
          {job.title}
        </Link>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: (job) => (
        <span className="text-zinc-600 dark:text-zinc-400">{job.department}</span>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (job) => (
        <span className="text-zinc-600 dark:text-zinc-400">{job.location}</span>
      ),
    },
    {
      key: 'experience',
      header: 'Experience',
      render: (job) => (
        <span className="inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300">
          {job.experience}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (job) => (
        <Badge className={cn(JOB_STATUS_COLORS[job.status])}>
          {JOB_STATUS_LABELS[job.status]}
        </Badge>
      ),
    },
    {
      key: 'candidateCount',
      header: 'Candidates',
      render: (job) => (
        <span className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
          <Users className="h-3.5 w-3.5" />
          {job.candidateCount}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created Date',
      render: (job) => (
        <span className="text-zinc-500 dark:text-zinc-400">{formatDate(job.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (job) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(job)}
            className="text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
            aria-label={`Edit ${job.title}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(job)}
            className="text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
            aria-label={`Delete ${job.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={jobs}
      keyExtractor={(job) => job.id}
      emptyMessage={emptyMessage}
      pagination={{
        page,
        pageSize,
        total,
        onPageChange,
      }}
    />
  )
}
