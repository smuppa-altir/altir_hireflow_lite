import { Eye, Pencil, Star, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { formatCandidateExperience } from '@/constants/candidateExperience'
import { CandidateStatusBadge } from './CandidateStatusBadge'
import { Button } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import type { Candidate } from '@/types'
import {
  getSortAriaLabel,
  type CandidateSortKey,
  type SortDirection,
} from '@/utils/candidateSort'
import { formatDate, getInitials } from '@/utils'

interface CandidateTableProps {
  candidates: Candidate[]
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onView: (candidate: Candidate) => void
  onEdit: (candidate: Candidate) => void
  onDelete: (candidate: Candidate) => void
  sortKey: CandidateSortKey
  sortDir: SortDirection
  onSort: (key: CandidateSortKey) => void
  emptyMessage?: string
}

function RatingDisplay({ rating }: { rating?: number }) {
  if (rating == null) {
    return <span className="text-zinc-600">—</span>
  }
  return (
    <span className="inline-flex items-center gap-1 text-amber-400">
      <Star className="h-3.5 w-3.5 fill-current" />
      <span className="text-sm text-zinc-700 dark:text-zinc-300">{rating.toFixed(1)}</span>
    </span>
  )
}

export function CandidateTable({
  candidates,
  page,
  pageSize,
  total,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  sortKey,
  sortDir,
  onSort,
  emptyMessage = 'No candidates found',
}: CandidateTableProps) {
  const columns: DataTableColumn<Candidate>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      sortAriaLabel: getSortAriaLabel('name', sortKey, sortDir),
      render: (candidate) => {
        const fullName = `${candidate.firstName} ${candidate.lastName}`
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
              {getInitials(fullName)}
            </div>
            <div className="min-w-0">
              <Link
                to={ROUTES.CANDIDATE_DETAIL.replace(':id', candidate.id)}
                className="font-medium text-zinc-900 transition-colors hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
              >
                {fullName}
              </Link>
              {candidate.location && (
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {candidate.location}
                </p>
              )}
            </div>
          </div>
        )
      },
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      sortAriaLabel: getSortAriaLabel('email', sortKey, sortDir),
      render: (c) => (
        <a
          href={`mailto:${c.email}`}
          className="text-zinc-600 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
        >
          {c.email}
        </a>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (c) => (
        <span className="text-zinc-600 dark:text-zinc-400">{c.phone ?? '—'}</span>
      ),
    },
    {
      key: 'appliedAt',
      header: 'Applied Date',
      sortable: true,
      sortAriaLabel: getSortAriaLabel('appliedAt', sortKey, sortDir),
      render: (c) => (
        <span className="text-zinc-500 dark:text-zinc-400">{formatDate(c.appliedAt)}</span>
      ),
    },
    {
      key: 'jobTitle',
      header: 'Job',
      sortable: true,
      sortAriaLabel: getSortAriaLabel('jobTitle', sortKey, sortDir),
      render: (c) => (
        <span
          className="max-w-[180px] truncate text-zinc-700 dark:text-zinc-300"
          title={c.jobTitle}
        >
          {c.jobTitle}
        </span>
      ),
    },
    {
      key: 'experienceYears',
      header: 'Experience',
      sortable: true,
      sortAriaLabel: getSortAriaLabel('experienceYears', sortKey, sortDir),
      render: (c) => (
        <span className="text-zinc-600 dark:text-zinc-400">
          {formatCandidateExperience(c.experienceYears)}
        </span>
      ),
    },
    {
      key: 'pipelineStage',
      header: 'Current Stage',
      sortable: true,
      sortAriaLabel: getSortAriaLabel('pipelineStage', sortKey, sortDir),
      render: (c) => <CandidateStatusBadge stage={c.pipelineStage} />,
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      sortAriaLabel: getSortAriaLabel('rating', sortKey, sortDir),
      render: (c) => <RatingDisplay rating={c.rating} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (candidate) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(candidate)}
            className="text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
            aria-label={`View profile for ${candidate.firstName}`}
            title="View Profile"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(candidate)}
            className="text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
            aria-label={`Edit ${candidate.firstName}`}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(candidate)}
            className="text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
            aria-label={`Delete ${candidate.firstName}`}
            title="Delete"
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
      data={candidates}
      keyExtractor={(c) => c.id}
      emptyMessage={emptyMessage}
      sortKey={sortKey}
      sortDir={sortDir}
      onSort={(key) => onSort(key as CandidateSortKey)}
      pagination={{
        page,
        pageSize,
        total,
        onPageChange,
      }}
    />
  )
}
