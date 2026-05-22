export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled'

export type InterviewRound =
  | 'screening'
  | 'technical'
  | 'manager_round'
  | 'hr_round'
  | 'final'

export type MeetingType = 'virtual' | 'in_person'

export interface Interviewer {
  id: string
  name: string
  email: string
  role?: string
}

export interface InterviewCandidateInfo {
  id: string
  name: string
  email: string
  jobId: string
  jobTitle: string
}

export interface Interview {
  id: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  jobId: string
  jobTitle: string
  interviewerId: string
  interviewerName: string
  interviewerEmail: string
  round: InterviewRound
  status: InterviewStatus
  scheduledAt: string
  durationMinutes: number
  meetingType: MeetingType
  meetingLink?: string
  location?: string
  notes?: string
  candidateInstructions?: string
  cancelReason?: string
  createdAt?: string
  updatedAt?: string
}

export interface InterviewFilters {
  search?: string
  status?: InterviewStatus
  round?: InterviewRound
  interviewerId?: string
  dateFrom?: string
  dateTo?: string
}

export type InterviewEmailDeliveryStatus = 'SUCCESS' | 'FAILED' | 'SKIPPED'

export interface InterviewEmailNotificationResult {
  recipientEmail: string
  recipientRole: 'CANDIDATE' | 'INTERVIEWER'
  status: InterviewEmailDeliveryStatus
  errorMessage?: string
  previewUrl?: string
}

export interface InterviewScheduleResult extends Interview {
  emailNotifications?: {
    results: InterviewEmailNotificationResult[]
    deliveryChannel?: 'smtp' | 'ethereal' | 'console'
    deliveryMessage?: string
  }
}

export interface AdditionalInterviewerInput {
  id?: string
  name: string
  email: string
}

export interface CreateInterviewPayload {
  candidateId: string
  interviewer?: string
  interviewerName?: string
  interviewerEmail?: string
  additionalInterviewers?: AdditionalInterviewerInput[]
  round: InterviewRound
  date: string
  durationMinutes: number
  meetingType: MeetingType
  meetingLink?: string
  location?: string
  notes?: string
  candidateInstructions?: string
  sendEmailToCandidate?: boolean
  sendEmailToInterviewer?: boolean
}

export interface RescheduleInterviewPayload {
  date: string
  durationMinutes?: number
  interviewer?: string
  interviewerName?: string
  interviewerEmail?: string
  meetingType?: MeetingType
  meetingLink?: string
  location?: string
  sendEmailToCandidate?: boolean
  sendEmailToInterviewer?: boolean
}

export interface CancelInterviewPayload {
  reason: string
  sendEmailToCandidate?: boolean
  sendEmailToInterviewer?: boolean
}
