import {
  Calendar,
  Clock,
  Link2,
  Mail,
  MapPin,
  User,
  Video,
  X,
} from 'lucide-react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  INTERVIEW_ROUND_LABELS,
  INTERVIEW_STATUS_COLORS,
  INTERVIEW_STATUS_LABELS,
  MEETING_TYPE_LABELS,
} from '@/constants'
import { Badge } from '@/components/ui'
import { ShadcnButton } from '@/components/ui/shadcn-button'
import type { Interview } from '@/types/interview'
import { cn, formatDateTimeDDMMYYYY } from '@/utils'

interface InterviewDetailsDrawerProps {
  interview: Interview | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onReschedule: (interview: Interview) => void
  onCancel: (interview: Interview) => void
  onMarkCompleted: (interview: Interview) => void
  isActionLoading?: boolean
}

export function InterviewDetailsDrawer({
  interview,
  open,
  onOpenChange,
  onReschedule,
  onCancel,
  onMarkCompleted,
  isActionLoading,
}: InterviewDetailsDrawerProps) {
  if (!interview) return null

  const canModify = interview.status === 'scheduled'

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-2xl',
            'dark:border-zinc-800 dark:bg-zinc-900',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-200',
          )}
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
            <div>
              <DialogPrimitive.Title className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Interview details
              </DialogPrimitive.Title>
              <p className="text-sm text-zinc-500">{interview.candidateName}</p>
            </div>
            <DialogPrimitive.Close
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={cn(INTERVIEW_STATUS_COLORS[interview.status])}>
                {INTERVIEW_STATUS_LABELS[interview.status]}
              </Badge>
              <Badge className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {INTERVIEW_ROUND_LABELS[interview.round]}
              </Badge>
            </div>

            <Section title="Candidate">
              <Row icon={User} label="Name" value={interview.candidateName} />
              <Row icon={Mail} label="Email" value={interview.candidateEmail} />
              <Row icon={User} label="Job" value={interview.jobTitle} />
            </Section>

            <Section title="Interview">
              <Row icon={Calendar} label="Date & time" value={formatDateTimeDDMMYYYY(interview.scheduledAt)} />
              <Row icon={Clock} label="Duration" value={`${interview.durationMinutes} minutes`} />
              <Row
                icon={Video}
                label="Meeting mode"
                value={MEETING_TYPE_LABELS[interview.meetingType]}
              />
              {interview.meetingType === 'virtual' && interview.meetingLink && (
                <Row icon={Link2} label="Meeting link" value={interview.meetingLink} isLink />
              )}
              {interview.meetingType === 'in_person' && interview.location && (
                <Row icon={MapPin} label="Location" value={interview.location} />
              )}
            </Section>

            <Section title="Interviewer">
              <Row icon={User} label="Name" value={interview.interviewerName} />
              <Row icon={Mail} label="Email" value={interview.interviewerEmail} />
            </Section>

            {interview.notes && (
              <Section title="Notes">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{interview.notes}</p>
              </Section>
            )}

            {interview.candidateInstructions && (
              <Section title="Instructions for candidate">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {interview.candidateInstructions}
                </p>
              </Section>
            )}

            {interview.cancelReason && (
              <Section title="Cancellation reason">
                <p className="text-sm text-red-600 dark:text-red-400">{interview.cancelReason}</p>
              </Section>
            )}
          </div>

          {canModify && (
            <div className="flex flex-col gap-2 border-t border-zinc-200 p-5 dark:border-zinc-800">
              <ShadcnButton
                type="button"
                variant="outline"
                disabled={isActionLoading}
                onClick={() => onReschedule(interview)}
              >
                Reschedule interview
              </ShadcnButton>
              <ShadcnButton
                type="button"
                disabled={isActionLoading}
                onClick={() => onMarkCompleted(interview)}
              >
                Mark completed
              </ShadcnButton>
              <ShadcnButton
                type="button"
                variant="destructive"
                disabled={isActionLoading}
                onClick={() => onCancel(interview)}
              >
                Cancel interview
              </ShadcnButton>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">{title}</h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  )
}

function Row({
  icon: Icon,
  label,
  value,
  isLink,
}: {
  icon: typeof User
  label: string
  value: string
  isLink?: boolean
}) {
  return (
    <div className="flex gap-3 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
      <div className="min-w-0">
        <p className="text-xs text-zinc-500">{label}</p>
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            {value}
          </a>
        ) : (
          <p className="font-medium text-zinc-800 dark:text-zinc-200">{value}</p>
        )}
      </div>
    </div>
  )
}
