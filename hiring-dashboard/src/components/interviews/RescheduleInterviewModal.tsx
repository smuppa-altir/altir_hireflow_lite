import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { MEETING_TYPE_LABELS } from '@/constants'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { DateInputDDMMYYYY } from '@/components/interviews/DateInputDDMMYYYY'
import { ShadcnButton } from '@/components/ui/shadcn-button'
import { ShadcnInput } from '@/components/ui/shadcn-input'
import { ShadcnSelect } from '@/components/ui/shadcn-select'
import {
  combineDateAndTime,
  rescheduleInterviewSchema,
  splitScheduledAt,
  type RescheduleInterviewFormValues,
} from '@/lib/validations/interviewSchema'
import type { Interview, Interviewer, RescheduleInterviewPayload } from '@/types/interview'
import { EmailPreview } from './EmailPreview'

interface RescheduleInterviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  interview: Interview | null
  staff: Interviewer[]
  onSubmit: (payload: RescheduleInterviewPayload) => void | Promise<void>
  isSubmitting?: boolean
}

export function RescheduleInterviewModal({
  open,
  onOpenChange,
  interview,
  staff,
  onSubmit,
  isSubmitting,
}: RescheduleInterviewModalProps) {
  const form = useForm<RescheduleInterviewFormValues>({
    resolver: zodResolver(rescheduleInterviewSchema),
    defaultValues: {
      interviewDate: '',
      interviewTime: '',
      durationMinutes: 60,
      interviewerName: '',
      interviewerEmail: '',
      interviewerId: '',
      meetingType: 'virtual',
      meetingLink: '',
      location: '',
      sendEmailToCandidate: true,
      sendEmailToInterviewer: true,
    },
    mode: 'onBlur',
  })

  const meetingType = form.watch('meetingType')
  const watched = form.watch()

  useEffect(() => {
    if (!open || !interview) return
    const { date, time } = splitScheduledAt(interview.scheduledAt)
    form.reset({
      interviewDate: date,
      interviewTime: time,
      durationMinutes: interview.durationMinutes,
      interviewerName: interview.interviewerName,
      interviewerEmail: interview.interviewerEmail,
      interviewerId: interview.interviewerId,
      meetingType: interview.meetingType,
      meetingLink: interview.meetingLink ?? '',
      location: interview.location ?? '',
      sendEmailToCandidate: true,
      sendEmailToInterviewer: true,
    })
  }, [open, interview, form])

  const previewInterview = useMemo(() => {
    if (!interview) return null
    const dateIso =
      watched.interviewDate && watched.interviewTime
        ? combineDateAndTime(watched.interviewDate, watched.interviewTime)
        : interview.scheduledAt
    return {
      ...interview,
      scheduledAt: dateIso,
      durationMinutes: Number(watched.durationMinutes) || interview.durationMinutes,
      meetingType: watched.meetingType,
      meetingLink: watched.meetingLink,
      location: watched.location,
      interviewerName: watched.interviewerName,
    }
  }, [interview, watched])

  const handleStaffPick = (userId: string) => {
    const user = staff.find((s) => s.id === userId)
    if (user) {
      form.setValue('interviewerId', user.id)
      form.setValue('interviewerName', user.name)
      form.setValue('interviewerEmail', user.email)
    }
  }

  const handleSubmit = async (values: RescheduleInterviewFormValues) => {
    const payload: RescheduleInterviewPayload = {
      date: combineDateAndTime(values.interviewDate, values.interviewTime),
      durationMinutes: values.durationMinutes,
      interviewer: values.interviewerId || undefined,
      interviewerName: values.interviewerName,
      interviewerEmail: values.interviewerEmail,
      meetingType: values.meetingType,
      meetingLink: values.meetingType === 'virtual' ? values.meetingLink : undefined,
      location: values.meetingType === 'in_person' ? values.location : undefined,
      sendEmailToCandidate: values.sendEmailToCandidate,
      sendEmailToInterviewer: values.sendEmailToInterviewer,
    }
    await onSubmit(payload)
    onOpenChange(false)
  }

  if (!interview) return null

  const staffOptions = [
    { value: '', label: 'Keep current interviewer' },
    ...staff.map((s) => ({ value: s.id, label: `${s.name} (${s.email})` })),
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reschedule interview</DialogTitle>
          <DialogDescription>
            Update the schedule for {interview.candidateName}. Notification emails can be sent
            again.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="interviewDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New date *</FormLabel>
                    <FormControl>
                      <DateInputDDMMYYYY
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interviewTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New time *</FormLabel>
                    <FormControl>
                      <ShadcnInput type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                        <ShadcnInput
                          type="number"
                          min={15}
                          step={15}
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interviewerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change interviewer</FormLabel>
                  <FormControl>
                      <ShadcnSelect
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const v = e.target.value
                          field.onChange(v)
                          if (v) handleStaffPick(v)
                        }}
                      >
                        {staffOptions.map((o) => (
                          <option key={o.value || 'none'} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </ShadcnSelect>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="interviewerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interviewer name *</FormLabel>
                    <FormControl>
                      <ShadcnInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interviewerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interviewer email *</FormLabel>
                    <FormControl>
                      <ShadcnInput type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="meetingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting type</FormLabel>
                  <FormControl>
                    <ShadcnSelect value={field.value} onChange={field.onChange}>
                      <option value="virtual">{MEETING_TYPE_LABELS.virtual}</option>
                      <option value="in_person">{MEETING_TYPE_LABELS.in_person}</option>
                    </ShadcnSelect>
                  </FormControl>
                </FormItem>
              )}
            />

            {meetingType === 'virtual' ? (
              <FormField
                control={form.control}
                name="meetingLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting link *</FormLabel>
                    <FormControl>
                      <ShadcnInput type="url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <ShadcnInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {previewInterview && <EmailPreview interview={previewInterview} />}

            <DialogFooter>
              <ShadcnButton type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </ShadcnButton>
              <ShadcnButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Save changes'}
              </ShadcnButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
