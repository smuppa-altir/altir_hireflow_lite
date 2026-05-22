import { KANBAN_COLUMNS } from '@/types/kanban'
import type { Candidate } from '@/types'
import type { KanbanCandidate, PipelineStage } from '@/types/kanban'

const API_TO_PIPELINE: Record<string, PipelineStage> = {
  applied: 'applied',
  screening: 'screening',
  technical: 'technical_interview',
  manager_round: 'manager_round',
  hr_round: 'hr_round',
  offer: 'offer',
  hired: 'hired',
  rejected: 'rejected',
}

const LABEL_TO_PIPELINE: Record<string, PipelineStage> = Object.fromEntries(
  KANBAN_COLUMNS.map((c) => [
    c.title.toLowerCase().replace(/[\s-]+/g, '_'),
    c.id,
  ]),
) as Record<string, PipelineStage>

const STAGE_ALIASES: Record<string, PipelineStage> = {
  new: 'applied',
  applied: 'applied',
  application: 'applied',
  screening: 'screening',
  screen: 'screening',
  technical: 'technical_interview',
  technical_interview: 'technical_interview',
  tech: 'technical_interview',
  interview: 'technical_interview',
  interviewing: 'technical_interview',
  manager: 'manager_round',
  manager_round: 'manager_round',
  hr: 'hr_round',
  hr_round: 'hr_round',
  offer: 'offer',
  offered: 'offer',
  hired: 'hired',
  hire: 'hired',
  rejected: 'rejected',
  reject: 'rejected',
  declined: 'rejected',
  ...LABEL_TO_PIPELINE,
}

export function normalizeApiStage(stage: string): string {
  return stage.toLowerCase().replace(/-/g, '_')
}

export function apiStageToPipelineStage(apiStage: string): PipelineStage {
  return API_TO_PIPELINE[normalizeApiStage(apiStage)] ?? 'applied'
}

export function pipelineStageToApiStage(stage: PipelineStage): string {
  if (stage === 'technical_interview') return 'technical'
  return stage
}

/** Parse Excel/form labels into a pipeline stage */
export function parsePipelineStageLabel(value: string): PipelineStage {
  const key = value.trim().toLowerCase().replace(/[\s-]+/g, '_')
  return STAGE_ALIASES[key] ?? 'applied'
}

export function candidateToKanban(candidate: Candidate): KanbanCandidate {
  return {
    id: candidate.id,
    firstName: candidate.firstName,
    lastName: candidate.lastName,
    jobTitle: candidate.jobTitle,
    experienceYears: candidate.experienceYears,
    appliedAt: candidate.appliedAt,
    stage: candidate.pipelineStage,
  }
}

/** @deprecated Use pipelineStageToApiStage */
export const kanbanStageToApiStage = pipelineStageToApiStage

/** @deprecated Use apiStageToPipelineStage */
export const apiStageToKanbanStage = apiStageToPipelineStage
