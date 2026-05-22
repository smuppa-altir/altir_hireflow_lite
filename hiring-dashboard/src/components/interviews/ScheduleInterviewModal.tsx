import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import {
  INTERVIEW_ROUND_OPTIONS,
  MEETING_TYPE_LABELS,
} from '@/constants'
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
import { Textarea } from '@/components/ui/textarea'
import {
  combineDateAndTime,
  scheduleInterviewDefaults,
  scheduleInterviewSchema,
  type ScheduleInterviewFormValues,
} from '@/lib/validations/interviewSchema'
import type { Candidate } from '@/types'
import type { Interviewer } from '@/types/interview'
import type { CreateInterviewPayload } from '@/types/interview'
import { CreateInterviewerSection } from './CreateInterviewerSection'
import { EmailPreview } from './EmailPreview'

interface ScheduleInterviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidates: Candidate[]
  staff: Interviewer[]
  onStaffChange?: (staff: Interviewer[]) => void
  onSubmit: (payload: CreateInterviewPayload) => void | Promise<void>
  isSubmitting?: boolean
}

export function ScheduleInterviewModal({
  open,
  onOpenChange,
  candidates,
  staff,
  onStaffChange,
  onSubmit,
  isSubmitting,
}: ScheduleInterviewModalProps) {
  const form = useForm<ScheduleInterviewFormValues>({
    resolver: zodResolver(scheduleInterviewSchema),
    defaultValues: scheduleInterviewDefaults,
    mode: 'onBlur',
  })

  const candidateId = form.watch('candidateId')
  const meetingType = form.watch('meetingType')
  const watched = form.watch()

  const selectedCandidate = useMemo(
    () => candidates.find((c) => c.id === candidateId),
    [candidates, candidateId],
  )

  useEffect(() => {
    if (!open) {
      form.reset(scheduleInterviewDefaults)
      return
    }
  }, [open, form])

  useEffect(() => {
    if (selectedCandidate) {
      form.setValue('candidateId', selectedCandidate.id, { shouldValidate: true })
    }
  }, [selectedCandidate, form])

  const previewInterview = useMemo(() => {
    const dateIso =
      watched.interviewDate && watched.interviewTime
        ? combineDateAndTime(watched.interviewDate, watched.interviewTime)
        : new Date().toISOString()
    return {
      candidateName: selectedCandidate
        ? `${selectedCandidate.firstName} ${selectedCandidate.lastName}`.trim()
        : 'Candidate',
      jobTitle: selectedCandidate?.jobTitle ?? 'Role',
      round: watched.round,
      scheduledAt: dateIso,
      durationMinutes: Number(watched.durationMinutes) || 60,
      meetingType: watched.meetingType,
      meetingLink: watched.meetingLink,
      location: watched.location,
      interviewerName: watched.interviewerName || 'Interviewer',
      candidateInstructions: watched.candidateInstructions,
      notes: watched.notes,
    }
  }, [watched, selectedCandidate])

  const handleStaffPick = (userId: string) => {
    const user = staff.find((s) => s.id === userId)
    if (user) {
      form.setValue('interviewerId', user.id)
      form.setValue('interviewerName', user.name)
      form.setValue('interviewerEmail', user.email)
    }
  }

  const handleInterviewerCreated = (member: Interviewer) => {
    const next = [...staff.filter((s) => s.id !== member.id), member].sort((a, b) =>
      a.name.localeCompare(b.name),
    )
    onStaffChange?.(next)
    form.setValue('interviewerId', member.id)
    form.setValue('interviewerName', member.name)
    form.setValue('interviewerEmail', member.email)
  }

  const handleSubmit = async (values: ScheduleInterviewFormValues) => {
    const payload: CreateInterviewPayload = {
      candidateId: values.candidateId,
      interviewer: values.interviewerId || undefined,
      interviewerName: values.interviewerName,
      interviewerEmail: values.interviewerEmail,
      round: values.round,
      date: combineDateAndTime(values.interviewDate, values.interviewTime),
      durationMinutes: values.durationMinutes,
      meetingType: values.meetingType,
      meetingLink: values.meetingType === 'virtual' ? values.meetingLink : undefined,
      location: values.meetingType === 'in_person' ? values.location : undefined,
      notes: values.notes,
      candidateInstructions: values.candidateInstructions,
      sendEmailToCandidate: values.sendEmailToCandidate,
      sendEmailToInterviewer: values.sendEmailToInterviewer,
    }
    await onSubmit(payload)
    form.reset(scheduleInterviewDefaults)
    onOpenChange(false)
  }

  const candidateOptions = candidates.map((c) => ({
    value: c.id,
    label: `${c.firstName} ${c.lastName} — ${c.jobTitle}`,
  }))

  const staffOptions = [
    { value: '', label: 'Select team member (optional)' },
    ...staff.map((s) => ({ value: s.id, label: `${s.name} (${s.email})` })),
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule interview</DialogTitle>
          <DialogDescription>
            Book a session and notify the candidate and interviewer by email.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Candidate information
              </h3>
              <FormField
                control={form.control}
                name="candidateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidate *</FormLabel>
                    <FormControl>
                      <ShadcnSelect
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <option value="">Select candidate</option>
                        {candidateOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </ShadcnSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <FormItem>
                  <FormLabel>Candidate email</FormLabel>
                  <ShadcnInput value={selectedCandidate?.email ?? ''} readOnly disabled />
                </FormItem>
                <FormItem>
                  <FormLabel>Applied job</FormLabel>
                  <ShadcnInput value={selectedCandidate?.jobTitle ?? ''} readOnly disabled />
                </FormItem>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Interview details
              </h3>
              <FormField
                control={form.control}
                name="round"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview round *</FormLabel>
                    <FormControl>
                      <ShadcnSelect value={field.value} onChange={field.onChange}>
                        {INTERVIEW_ROUND_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </ShadcnSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="interviewDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date *</FormLabel>
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
                      <FormLabel>Time *</FormLabel>
                      <FormControl>
                        <ShadcnInput type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (min) *</FormLabel>
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
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Interviewer details
              </h3>
              <CreateInterviewerSection onCreated={handleInterviewerCreated} />
              <FormField
                control={form.control}
                name="interviewerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quick fill from team</FormLabel>
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
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Meeting details
              </h3>
              <FormField
                control={form.control}
                name="meetingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting type *</FormLabel>
                    <FormControl>
                      <ShadcnSelect value={field.value} onChange={field.onChange}>
                        <option value="virtual">{MEETING_TYPE_LABELS.virtual}</option>
                        <option value="in_person">{MEETING_TYPE_LABELS.in_person}</option>
                      </ShadcnSelect>
                    </FormControl>
                    <FormMessage />
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
                        <ShadcnInput type="url" placeholder="https://meet.google.com/..." {...field} />
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
                        <ShadcnInput placeholder="Office address or room" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Additional details
              </h3>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} placeholder="Internal notes for the team" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="candidateInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions for candidate</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} placeholder="What the candidate should prepare" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Notifications
              </h3>
              <div className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <FormField
                  control={form.control}
                  name="sendEmailToCandidate"
                  render={({ field }) => (
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-zinc-300 text-indigo-600"
                      />
                      Send email to candidate
                    </label>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sendEmailToInterviewer"
                  render={({ field }) => (
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-zinc-300 text-indigo-600"
                      />
                      Send email to interviewer
                    </label>
                  )}
                />
              </div>
              <EmailPreview interview={previewInterview} />
            </section>

            <DialogFooter>
              <ShadcnButton type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </ShadcnButton>
              <ShadcnButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Scheduling…' : 'Schedule interview'}
              </ShadcnButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
