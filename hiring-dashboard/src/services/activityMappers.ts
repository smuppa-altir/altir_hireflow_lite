import type { ActivityActionType, ActivityLogEntry } from '@/types/activityLog'
import {
  formatActivityMessage,
  type ApiActivityLog,
} from '@/utils/activityFormat'

function parseJson(value?: string): Record<string, unknown> {
  if (!value?.trim().startsWith('{')) return {}
  try {
    return JSON.parse(value) as Record<string, unknown>
  } catch {
    return {}
  }
}

/** Map API action string to frontend ActivityLogEntry.action */
export function mapApiActionToLogType(action: string): ActivityActionType {
  const map: Record<string, ActivityActionType> = {
    candidate_created: 'candidate_created',
    candidate_updated: 'note_added',
    candidate_deleted: 'candidate_rejected',
    stage_changed: 'stage_change',
    feedback_added: 'feedback_submitted',
    feedback_submitted: 'feedback_submitted',
    interview_scheduled: 'interview_scheduled',
    interview_updated: 'interview_scheduled',
    interview_status_changed: 'interview_scheduled',
    offer_released: 'offer_released',
    offer_accepted: 'offer_accepted',
    candidate_hired: 'candidate_hired',
    candidate_rejected: 'candidate_rejected',
    job_created: 'job_created',
    job_updated: 'job_created',
    job_status_changed: 'job_created',
    note_added: 'note_added',
    email_sent: 'email_sent',
  }
  return map[action] ?? 'note_added'
}

/** Map activity log filter value to API query param */
export function mapLogFilterToApiAction(action: ActivityActionType): string {
  const map: Partial<Record<ActivityActionType, string>> = {
    stage_change: 'stage_changed',
    feedback_submitted: 'feedback_added',
  }
  return map[action] ?? action
}

export function mapApiActivityToLogEntry(log: ApiActivityLog): ActivityLogEntry {
  const parsed = parseJson(log.newValue)
  const jobTitle = typeof parsed.jobTitle === 'string' ? parsed.jobTitle : undefined
  const interviewer = typeof parsed.interviewer === 'string' ? parsed.interviewer : undefined

  return {
    id: log.id,
    action: mapApiActionToLogType(log.action),
    title: log.actionLabel,
    description: formatActivityMessage(log),
    actor: interviewer ?? 'System',
    candidateId: log.candidateId,
    candidateName: log.candidateName,
    jobTitle,
    timestamp: log.createdAt,
  }
}
