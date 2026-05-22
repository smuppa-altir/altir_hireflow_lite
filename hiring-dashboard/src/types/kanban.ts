/** Canonical hiring pipeline stage (Kanban columns, list view, forms, imports) */
export type PipelineStage =
  | 'applied'
  | 'screening'
  | 'technical_interview'
  | 'manager_round'
  | 'hr_round'
  | 'offer'
  | 'hired'
  | 'rejected'

/** @deprecated Use PipelineStage */
export type KanbanStage = PipelineStage

export interface KanbanCandidate {
  id: string
  firstName: string
  lastName: string
  jobTitle: string
  experienceYears?: number
  appliedAt: string
  stage: KanbanStage
}

export interface KanbanColumn {
  id: KanbanStage
  title: string
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'applied', title: 'Applied' },
  { id: 'screening', title: 'Screening' },
  { id: 'technical_interview', title: 'Technical Interview' },
  { id: 'manager_round', title: 'Manager Round' },
  { id: 'hr_round', title: 'HR Round' },
  { id: 'offer', title: 'Offer' },
  { id: 'hired', title: 'Hired' },
  { id: 'rejected', title: 'Rejected' },
]

export const KANBAN_STAGE_IDS = KANBAN_COLUMNS.map((c) => c.id)

export function isPipelineStage(id: string): id is PipelineStage {
  return KANBAN_STAGE_IDS.includes(id as PipelineStage)
}

/** @deprecated Use isPipelineStage */
export function isKanbanStage(id: string): id is PipelineStage {
  return isPipelineStage(id)
}
