/** API activity log item from GET /api/activity */
export interface ApiActivityLog {
  id: string
  action: string
  actionLabel: string
  oldValue?: string
  newValue?: string
  candidateId?: string
  candidateName?: string
  candidateEmail?: string
  createdAt: string
}

export type DashboardActivityType =
  | 'application'
  | 'interview'
  | 'offer'
  | 'hire'
  | 'status'
  | 'comment'

export interface DashboardActivityItem {
  id: string
  type: DashboardActivityType
  message: string
  actor: string
  timestamp: string
}

function parseJson(value?: string): Record<string, unknown> {
  if (!value?.trim().startsWith('{')) return {}
  try {
    return JSON.parse(value) as Record<string, unknown>
  } catch {
    return {}
  }
}

export function formatStageLabel(stage: string): string {
  return stage
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function resolveActor(parsed: Record<string, unknown>): string {
  const interviewer = parsed.interviewer
  if (typeof interviewer === 'string' && interviewer.trim()) return interviewer
  return 'System'
}

/** Human-readable line for dashboard widget and activity log description */
export function formatActivityMessage(log: ApiActivityLog): string {
  const name = log.candidateName ?? 'Candidate'
  const parsed = parseJson(log.newValue)
  const jobTitle = typeof parsed.jobTitle === 'string' ? parsed.jobTitle : undefined

  switch (log.action) {
    case 'candidate_created':
      return jobTitle ? `${name} applied for ${jobTitle}` : `${name} was added to the pipeline`
    case 'candidate_updated':
      return `${name}'s profile was updated`
    case 'candidate_deleted':
      return `${name} was removed from the pipeline`
    case 'stage_changed': {
      const to = formatStageLabel(log.newValue ?? '')
      const from = log.oldValue ? formatStageLabel(log.oldValue) : ''
      if (log.newValue === 'HIRED') {
        return jobTitle
          ? `${name} marked as hired for ${jobTitle}`
          : `${name} marked as hired`
      }
      return from
        ? `${name} moved from ${from} to ${to} stage`
        : `${name} moved to ${to} stage`
    }
    case 'candidate_hired':
      return jobTitle ? `${name} marked as hired for ${jobTitle}` : `${name} marked as hired`
    case 'candidate_rejected':
      return `${name} was rejected`
    case 'interview_scheduled': {
      const round = formatStageLabel(String(parsed.round ?? 'interview'))
      return `${round} interview scheduled with ${name}`
    }
    case 'interview_updated':
    case 'interview_status_changed':
      return `Interview updated for ${name}`
    case 'feedback_added':
    case 'feedback_submitted':
      return `Added feedback on ${name}`
    case 'offer_released':
      return `Offer extended to ${name}`
    case 'offer_accepted':
      return `${name} accepted the offer`
    case 'job_created': {
      const title = typeof parsed.title === 'string' ? parsed.title : 'New role'
      return `Job posted: ${title}`
    }
    case 'job_updated':
    case 'job_status_changed':
      return `Job listing updated`
    case 'email_sent':
      return `Email sent regarding ${name}`
    case 'note_added':
      return `Note added for ${name}`
    default:
      return log.actionLabel || `${name} — activity recorded`
  }
}

export function mapActionToDashboardType(action: string): DashboardActivityType {
  switch (action) {
    case 'candidate_created':
      return 'application'
    case 'interview_scheduled':
    case 'interview_updated':
    case 'interview_status_changed':
      return 'interview'
    case 'offer_released':
    case 'offer_accepted':
      return 'offer'
    case 'candidate_hired':
      return 'hire'
    case 'feedback_added':
    case 'feedback_submitted':
      return 'comment'
    default:
      return 'status'
  }
}

export function mapApiActivityToDashboardItem(log: ApiActivityLog): DashboardActivityItem {
  const parsed = parseJson(log.newValue)
  return {
    id: log.id,
    type: mapActionToDashboardType(log.action),
    message: formatActivityMessage(log),
    actor: resolveActor(parsed),
    timestamp: log.createdAt,
  }
}
