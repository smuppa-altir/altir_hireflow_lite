import type { JobStatus } from '@/types'
import {
  PIPELINE_STAGE_COLORS,
  PIPELINE_STAGE_LABELS,
} from './pipelineStages'

/** @deprecated Use PIPELINE_STAGE_LABELS */
export const CANDIDATE_STATUS_LABELS = PIPELINE_STAGE_LABELS

/** @deprecated Use PIPELINE_STAGE_COLORS */
export const CANDIDATE_STATUS_COLORS = PIPELINE_STAGE_COLORS

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  draft: 'Draft',
  open: 'Open',
  paused: 'Paused',
  closed: 'Closed',
}

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  draft: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  open: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  paused: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  closed: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
}

/** @deprecated Use INTERVIEW_STATUS_LABELS from ./interviews */
export { INTERVIEW_STATUS_LABELS, INTERVIEW_STATUS_COLORS } from './interviews'

export const INTERVIEW_TYPE_LABELS = {
  phone: 'Phone',
  video: 'Video',
  onsite: 'On-site',
  technical: 'Technical',
  panel: 'Panel',
} as const
