import type { Interview } from '@/types/interview'
import { INTERVIEW_ROUND_LABELS, MEETING_TYPE_LABELS } from '@/constants/interviews'

export interface EmailTemplatePreview {
  subject: string
  body: string
}

const APP_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

function formatDisplayDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: APP_TIMEZONE,
    }),
    time: d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: APP_TIMEZONE,
      timeZoneName: 'short',
    }),
  }
}

function meetingDetails(interview: Pick<Interview, 'meetingType' | 'meetingLink' | 'location'>): string {
  if (interview.meetingType === 'in_person') {
    return interview.location ?? 'Venue to be confirmed'
  }
  return interview.meetingLink ?? 'Meeting link to be shared'
}

function interviewerNames(interview: Pick<Interview, 'interviewerName'> & { additionalInterviewerNames?: string[] }): string {
  const names = [interview.interviewerName, ...(interview.additionalInterviewerNames ?? [])].filter(Boolean)
  return [...new Set(names)].join(', ')
}

export function buildCandidateEmailPreview(
  interview: Pick<
    Interview,
    | 'candidateName'
    | 'jobTitle'
    | 'round'
    | 'scheduledAt'
    | 'durationMinutes'
    | 'meetingType'
    | 'meetingLink'
    | 'location'
    | 'interviewerName'
    | 'candidateInstructions'
  > & { additionalInterviewerNames?: string[] },
): EmailTemplatePreview {
  const { date, time } = formatDisplayDateTime(interview.scheduledAt)
  const round = INTERVIEW_ROUND_LABELS[interview.round]
  const meetingType = MEETING_TYPE_LABELS[interview.meetingType]
  const details = meetingDetails(interview)

  return {
    subject: `Interview Scheduled – ${interview.jobTitle}`,
    body: `Hello ${interview.candidateName},

Your interview has been scheduled. Please review the details below.

Job Title:
${interview.jobTitle}

Interview Round:
${round}

Date:
${date}

Time:
${time}

Time Zone:
${APP_TIMEZONE}

Duration:
${interview.durationMinutes} minutes

Interview Mode:
${meetingType}

Meeting Link / Venue:
${details}

Interviewer(s):
${interviewerNames(interview)}
${interview.candidateInstructions ? `\nAdditional Instructions:\n${interview.candidateInstructions}\n` : ''}
Best regards,
Recruitment Team`,
  }
}

export function buildInterviewerEmailPreview(
  interview: Pick<
    Interview,
    | 'candidateName'
    | 'jobTitle'
    | 'round'
    | 'scheduledAt'
    | 'durationMinutes'
    | 'meetingType'
    | 'meetingLink'
    | 'location'
    | 'interviewerName'
    | 'notes'
  >,
  candidateProfileUrl = '(profile link after save)',
): EmailTemplatePreview {
  const { date, time } = formatDisplayDateTime(interview.scheduledAt)
  const round = INTERVIEW_ROUND_LABELS[interview.round]
  const details = meetingDetails(interview)

  return {
    subject: `New Interview Assigned – ${interview.candidateName}`,
    body: `Hello ${interview.interviewerName},

You have been assigned a new interview.

Candidate Name:
${interview.candidateName}

Job Title / Position:
${interview.jobTitle}

Interview Round / Type:
${round}

Date:
${date}

Time:
${time}

Time Zone:
${APP_TIMEZONE}

Duration:
${interview.durationMinutes} minutes

Meeting Link / Venue:
${details}

Candidate Profile:
${candidateProfileUrl}
${interview.notes ? `\nAdditional Notes:\n${interview.notes}\n` : ''}
Regards,
Recruitment Team`,
  }
}
