import { z } from 'zod'
import { normalizeDateInput } from '@/utils/dateFormat'

const roundEnum = z.enum([
  'screening',
  'technical',
  'manager_round',
  'hr_round',
  'final',
])

export const scheduleInterviewSchema = z
  .object({
    candidateId: z.string().min(1, 'Candidate is required'),
    round: roundEnum,
    interviewDate: z
      .string()
      .min(1, 'Date is required')
      .refine((v) => normalizeDateInput(v) !== null, {
        message: 'Enter date as DD/MM/YYYY',
      }),
    interviewTime: z.string().min(1, 'Time is required'),
    durationMinutes: z
      .number({ error: 'Duration is required' })
      .int()
      .min(15, 'Minimum 15 minutes')
      .max(480),
    interviewerName: z.string().trim().min(1, 'Interviewer name is required'),
    interviewerEmail: z.string().trim().email('Valid interviewer email is required'),
    interviewerId: z.string().optional(),
    meetingType: z.enum(['virtual', 'in_person']),
    meetingLink: z.string().optional(),
    location: z.string().optional(),
    notes: z.string().optional(),
    candidateInstructions: z.string().optional(),
    sendEmailToCandidate: z.boolean(),
    sendEmailToInterviewer: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.meetingType === 'virtual' && !data.meetingLink?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Meeting link is required for virtual interviews',
        path: ['meetingLink'],
      })
    }
    if (data.meetingType === 'in_person' && !data.location?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Location is required for in-person interviews',
        path: ['location'],
      })
    }
  })

export type ScheduleInterviewFormValues = z.infer<typeof scheduleInterviewSchema>

export const scheduleInterviewDefaults: ScheduleInterviewFormValues = {
  candidateId: '',
  round: 'screening',
  interviewDate: '',
  interviewTime: '',
  durationMinutes: 60,
  interviewerName: '',
  interviewerEmail: '',
  interviewerId: '',
  meetingType: 'virtual',
  meetingLink: '',
  location: '',
  notes: '',
  candidateInstructions: '',
  sendEmailToCandidate: true,
  sendEmailToInterviewer: true,
}

export const rescheduleInterviewSchema = z
  .object({
    interviewDate: z
      .string()
      .min(1, 'Date is required')
      .refine((v) => normalizeDateInput(v) !== null, {
        message: 'Enter date as DD/MM/YYYY',
      }),
    interviewTime: z.string().min(1, 'Time is required'),
    durationMinutes: z
      .number({ error: 'Duration is required' })
      .int()
      .min(15, 'Minimum 15 minutes')
      .max(480),
    interviewerName: z.string().trim().min(1, 'Interviewer name is required'),
    interviewerEmail: z.string().trim().email('Valid interviewer email is required'),
    interviewerId: z.string().optional(),
    meetingType: z.enum(['virtual', 'in_person']),
    meetingLink: z.string().optional(),
    location: z.string().optional(),
    sendEmailToCandidate: z.boolean(),
    sendEmailToInterviewer: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.meetingType === 'virtual' && !data.meetingLink?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Meeting link is required',
        path: ['meetingLink'],
      })
    }
    if (data.meetingType === 'in_person' && !data.location?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Location is required',
        path: ['location'],
      })
    }
  })

export type RescheduleInterviewFormValues = z.infer<typeof rescheduleInterviewSchema>

export const cancelInterviewSchema = z.object({
  reason: z.string().trim().min(1, 'Cancellation reason is required'),
  sendEmailToCandidate: z.boolean(),
  sendEmailToInterviewer: z.boolean(),
})

export type CancelInterviewFormValues = z.infer<typeof cancelInterviewSchema>

export function combineDateAndTime(date: string, time: string): string {
  const isoDate = normalizeDateInput(date)
  if (!isoDate) throw new Error('Invalid date')
  const [hours, minutes] = time.split(':').map(Number)
  const d = new Date(`${isoDate}T00:00:00`)
  d.setHours(hours, minutes ?? 0, 0, 0)
  return d.toISOString()
}

export function splitScheduledAt(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return { date: `${day}/${month}/${year}`, time }
}
