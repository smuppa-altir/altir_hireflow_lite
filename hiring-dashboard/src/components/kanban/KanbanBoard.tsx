import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  KANBAN_COLUMNS,
  isKanbanStage,
  type KanbanCandidate,
  type KanbanStage,
} from '@/types/kanban'
import { groupCandidatesByStage } from './kanbanMockData'
import { CandidateCard } from './CandidateCard'
import { StageColumn } from './StageColumn'
import { candidateService, getApiErrorMessage } from '@/services'
import { candidateToKanban } from '@/utils/kanbanStages'
import { Spinner } from '@/components/ui'

function findStageForCandidate(
  candidates: KanbanCandidate[],
  candidateId: string,
): KanbanStage | undefined {
  return candidates.find((c) => c.id === candidateId)?.stage
}

function resolveTargetStage(
  overId: string,
  candidates: KanbanCandidate[],
): KanbanStage | null {
  if (isKanbanStage(overId)) return overId
  return findStageForCandidate(candidates, overId) ?? null
}

export function KanbanBoard() {
  const [candidates, setCandidates] = useState<KanbanCandidate[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadCandidates = useCallback(() => {
    setLoading(true)
    setError(null)
    candidateService
      .getAll({ page: 1, pageSize: 100 })
      .then((res) => setCandidates(res.data.map(candidateToKanban)))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadCandidates()
  }, [loadCandidates])

  useEffect(() => {
    const onFocus = () => loadCandidates()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [loadCandidates])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor),
  )

  const grouped = useMemo(() => groupCandidatesByStage(candidates), [candidates])

  const activeCandidate = useMemo(
    () => candidates.find((c) => c.id === activeId) ?? null,
    [candidates, activeId],
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }, [])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      setActiveId(null)

      if (!over || savingId) return

      const activeCandidateId = String(active.id)
      const targetStage = resolveTargetStage(String(over.id), candidates)

      if (!targetStage) return

      const sourceStage = findStageForCandidate(candidates, activeCandidateId)
      if (!sourceStage || sourceStage === targetStage) return

      const snapshot = candidates
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === activeCandidateId ? { ...c, stage: targetStage } : c,
        ),
      )
      setSavingId(activeCandidateId)
      setError(null)

      try {
        const updated = await candidateService.updatePipelineStage(
          activeCandidateId,
          targetStage,
        )
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === activeCandidateId ? candidateToKanban(updated) : c,
          ),
        )
      } catch (err) {
        setCandidates(snapshot)
        setError(getApiErrorMessage(err))
      } finally {
        setSavingId(null)
      }
    },
    [candidates, savingId],
  )

  const handleDragCancel = useCallback(() => {
    setActiveId(null)
  }, [])

  const totalCandidates = candidates.length

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      )}

      <p className="text-sm text-zinc-500">
        {totalCandidates} candidates across {KANBAN_COLUMNS.length} pipeline stages · Drag
        cards to move between columns
        {savingId ? ' · Saving…' : ''}
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="scrollbar-thin -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 lg:-mx-0 lg:px-0">
          {KANBAN_COLUMNS.map((column) => (
            <StageColumn
              key={column.id}
              column={column}
              candidates={grouped[column.id]}
              activeId={activeId}
              disabled={Boolean(savingId)}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1)' }}>
          {activeCandidate ? (
            <div className="w-[260px]">
              <CandidateCard candidate={activeCandidate} isOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
