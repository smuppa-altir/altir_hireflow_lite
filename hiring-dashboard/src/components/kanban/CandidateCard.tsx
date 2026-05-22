import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Briefcase, Calendar, GripVertical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import type { KanbanCandidate } from '@/types/kanban'
import { cn, formatDate, getInitials } from '@/utils'

interface CandidateCardProps {
  candidate: KanbanCandidate
  isDragging?: boolean
  isOverlay?: boolean
  dragDisabled?: boolean
}

export function CandidateCard({
  candidate,
  isDragging,
  isOverlay,
  dragDisabled,
}: CandidateCardProps) {
  const fullName = `${candidate.firstName} ${candidate.lastName}`

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: candidate.id,
    data: { type: 'candidate', candidate },
    disabled: dragDisabled,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  const experienceLabel =
    candidate.experienceYears != null
      ? `${candidate.experienceYears}${candidate.experienceYears === 0 ? '' : '+'} years`
      : 'Not specified'

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={isOverlay ? undefined : style}
      className={cn(
        'group rounded-lg border border-zinc-200 bg-white p-3 shadow-sm',
        'dark:border-zinc-700/80 dark:bg-zinc-900',
        'transition-shadow duration-200',
        isDragging && !isOverlay && 'opacity-40 shadow-none',
        isOverlay && 'rotate-2 scale-[1.02] border-indigo-500/50 shadow-xl shadow-indigo-500/10',
        !isOverlay && 'hover:border-zinc-300 hover:shadow-md dark:hover:border-zinc-600',
      )}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className={cn(
            'mt-0.5 shrink-0 cursor-grab touch-none rounded p-0.5 text-zinc-600',
            'opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing',
            isOverlay && 'opacity-100',
          )}
          {...listeners}
          {...attributes}
          aria-label={`Drag ${fullName}`}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
              {getInitials(fullName)}
            </div>
            <Link
              to={ROUTES.CANDIDATE_DETAIL.replace(':id', candidate.id)}
              className="truncate font-medium text-zinc-900 transition-colors hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
              onClick={(e) => isOverlay && e.preventDefault()}
            >
              {fullName}
            </Link>
          </div>

          <div className="mt-2.5 space-y-1.5 text-xs text-zinc-500">
            <p className="flex items-center gap-1.5 truncate" title={candidate.jobTitle}>
              <Briefcase className="h-3 w-3 shrink-0 text-zinc-600" />
              <span className="truncate text-zinc-600 dark:text-zinc-400">{candidate.jobTitle}</span>
            </p>
            <p className="text-zinc-500">{experienceLabel}</p>
            <p className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 shrink-0 text-zinc-600" />
              Applied {formatDate(candidate.appliedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
