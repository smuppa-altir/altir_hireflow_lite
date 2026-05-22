import { useDroppable } from '@dnd-kit/core'
import type { KanbanCandidate, KanbanColumn } from '@/types/kanban'
import { CandidateCard } from './CandidateCard'
import { cn } from '@/utils'

const stageAccent: Record<string, string> = {
  applied: 'border-t-blue-500',
  screening: 'border-t-amber-500',
  technical_interview: 'border-t-violet-500',
  manager_round: 'border-t-indigo-500',
  hr_round: 'border-t-cyan-500',
  offer: 'border-t-emerald-500',
  hired: 'border-t-green-500',
  rejected: 'border-t-red-500',
}

interface StageColumnProps {
  column: KanbanColumn
  candidates: KanbanCandidate[]
  activeId: string | null
  disabled?: boolean
}

export function StageColumn({ column, candidates, activeId, disabled }: StageColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', stage: column.id },
  })

  return (
    <div
      className={cn(
        'flex w-[280px] shrink-0 flex-col rounded-xl border border-zinc-200 bg-zinc-50/80',
        'dark:border-zinc-800/80 dark:bg-zinc-900/40',
        'border-t-[3px]',
        stageAccent[column.id],
      )}
    >
      <div className="flex items-center justify-between px-3 py-3">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{column.title}</h3>
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-zinc-200 px-1.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {candidates.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-[200px] flex-1 flex-col gap-2 px-2 pb-3 transition-colors duration-200',
          isOver && 'rounded-lg bg-indigo-500/5 ring-1 ring-inset ring-indigo-500/30',
        )}
      >
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            isDragging={activeId === candidate.id}
            dragDisabled={disabled}
          />
        ))}

        {candidates.length === 0 && (
          <div
            className={cn(
              'flex flex-1 items-center justify-center rounded-lg border border-dashed border-zinc-800 py-8 text-xs text-zinc-600',
              isOver && 'border-indigo-500/40 text-indigo-400/70',
            )}
          >
            Drop candidates here
          </div>
        )}
      </div>
    </div>
  )
}
