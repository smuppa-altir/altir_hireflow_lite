import { KANBAN_COLUMNS, type PipelineStage } from '@/types/kanban'

export const PIPELINE_STAGE_ORDER: PipelineStage[] = KANBAN_COLUMNS.map((c) => c.id)

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = Object.fromEntries(
  KANBAN_COLUMNS.map((c) => [c.id, c.title]),
) as Record<PipelineStage, string>

export const PIPELINE_STAGE_COLORS: Record<PipelineStage, string> = {
  applied: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  screening: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  technical_interview:
    'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  manager_round: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  hr_round: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
  offer: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  hired: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
}

export const PIPELINE_STAGE_OPTIONS = KANBAN_COLUMNS.map((c) => ({
  value: c.id,
  label: c.title,
}))
