export type ActivityActionType =
  | 'candidate_created'
  | 'stage_change'
  | 'feedback_submitted'
  | 'offer_released'
  | 'interview_scheduled'
  | 'offer_accepted'
  | 'candidate_hired'
  | 'candidate_rejected'
  | 'job_created'
  | 'note_added'
  | 'email_sent'

export interface ActivityLogEntry {
  id: string
  action: ActivityActionType
  title: string
  description?: string
  actor: string
  candidateId?: string
  candidateName?: string
  jobTitle?: string
  timestamp: string
}
