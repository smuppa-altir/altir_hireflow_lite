import type { InterviewRound, InterviewStatus, MeetingType } from '@/types/interview'

export const INTERVIEW_ROUND_OPTIONS: { value: InterviewRound; label: string }[] = [
  { value: 'screening', label: 'Screening' },
  { value: 'technical', label: 'Technical Interview' },
  { value: 'manager_round', label: 'Manager Round' },
  { value: 'hr_round', label: 'HR Round' },
  { value: 'final', label: 'Final Round' },
]

export const INTERVIEW_ROUND_LABELS: Record<InterviewRound, string> = Object.fromEntries(
  INTERVIEW_ROUND_OPTIONS.map((o) => [o.value, o.label]),
) as Record<InterviewRound, string>

export const INTERVIEW_STATUS_OPTIONS: { value: InterviewStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const INTERVIEW_STATUS_COLORS: Record<InterviewStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  cancelled: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
}

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  virtual: 'Virtual',
  in_person: 'In-Person',
}
