import {
  Calendar,
  CalendarClock,
  MapPin,
  Plus,
  Search,
  Video,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/components/common'
import {
  CancelInterviewDialog,
  InterviewDetailsDrawer,
  RescheduleInterviewModal,
  ScheduleInterviewModal,
} from '@/components/interviews'
import {
  Badge,
  DataTable,
  EmptyState,
  Input,
  Select,
  type DataTableColumn,
} from '@/components/ui'
import { ShadcnButton } from '@/components/ui/shadcn-button'
import {
  INTERVIEW_ROUND_OPTIONS,
  INTERVIEW_ROUND_LABELS,
  INTERVIEW_STATUS_COLORS,
  INTERVIEW_STATUS_LABELS,
  INTERVIEW_STATUS_OPTIONS,
  MEETING_TYPE_LABELS,
} from '@/constants'
import { useDebounce, useToast } from '@/hooks'
import { candidateService, getApiErrorMessage, interviewApi } from '@/services'
import { userApi } from '@/services/userApi'
import type { Interviewer } from '@/types/interview'
import type { Candidate } from '@/types'
import type {
  CancelInterviewPayload,
  CreateInterviewPayload,
  Interview,
  InterviewFilters,
  InterviewRound,
  InterviewStatus,
  RescheduleInterviewPayload,
} from '@/types/interview'
import { DateInputDDMMYYYY } from '@/components/interviews/DateInputDDMMYYYY'
import { cn, formatDateTimeDDMMYYYY, normalizeDateInput } from '@/utils'
import type { CancelInterviewFormValues } from '@/lib/validations/interviewSchema'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const interviewActionLinkClass =
  'text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300'
const interviewDangerLinkClass =
  'text-sm font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'

function InterviewTableSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
      ))}
    </div>
  )
}

export function InterviewsPage() {
  const toast = useToast()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [staff, setStaff] = useState<Interviewer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [statusFilter, setStatusFilter] = useState<InterviewStatus | ''>('')
  const [roundFilter, setRoundFilter] = useState<InterviewRound | ''>('')
  const [interviewerFilter, setInterviewerFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeInterview, setActiveInterview] = useState<Interview | null>(null)
  const loadInterviews = useCallback(async () => {
    setLoading(true)
    setError(null)
    const filters: InterviewFilters = {
      search: debouncedSearch.trim() || undefined,
      status: statusFilter || undefined,
      round: roundFilter || undefined,
      interviewerId: interviewerFilter || undefined,
    }
    const isoDate = dateFilter ? normalizeDateInput(dateFilter) : null
    if (isoDate) {
      filters.dateFrom = `${isoDate}T00:00:00.000Z`
      filters.dateTo = `${isoDate}T23:59:59.999Z`
    }
    try {
      const result = await interviewApi.getInterviews({ pageSize: 100, ...filters })
      setInterviews(result.data)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, statusFilter, roundFilter, interviewerFilter, dateFilter])

  useEffect(() => {
    void loadInterviews()
  }, [loadInterviews])

  useEffect(() => {
    const onFocus = () => void loadInterviews()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [loadInterviews])

  useEffect(() => {
    candidateService.getAll({ pageSize: 100 }).then((r) => setCandidates(r.data)).catch(() => {})
    const loadStaff = () => {
      if (USE_MOCK) {
        interviewApi.getStaffInterviewers().then(setStaff).catch(() => {})
        return
      }
      userApi.getStaff().then(setStaff).catch(() => {})
    }
    loadStaff()
  }, [])

  const interviewerOptions = useMemo(() => {
    const fromData = new Map<string, string>()
    for (const i of interviews) {
      fromData.set(i.interviewerId, i.interviewerName)
    }
    for (const s of staff) {
      fromData.set(s.id, s.name)
    }
    return [
      { value: '', label: 'All interviewers' },
      ...[...fromData.entries()].map(([value, label]) => ({ value, label })),
    ]
  }, [interviews, staff])

  const handleSchedule = async (payload: CreateInterviewPayload) => {
    setSubmitting(true)
    try {
      const result = await interviewApi.createInterview(payload)
      const notifications = result.emailNotifications
      const failed = notifications?.results.filter((r) => r.status === 'FAILED') ?? []
      const skipped = notifications?.results.filter((r) => r.status === 'SKIPPED') ?? []
      const sent = notifications?.results.filter((r) => r.status === 'SUCCESS') ?? []

      if (failed.length > 0) {
        const detail = failed
          .map((f) => f.errorMessage || `${f.recipientRole} (${f.recipientEmail})`)
          .join(' ')
        toast.error(
          `Interview saved, but ${failed.length} email(s) failed. ${detail.slice(0, 280)}`,
        )
      } else if (notifications?.deliveryChannel === 'ethereal') {
        toast.error(
          'Interview saved. Test mail only (Ethereal) — emails did NOT go to real inboxes. Configure Gmail SMTP in backend/.env and restart the server.',
        )
      } else if (notifications?.deliveryChannel === 'console') {
        toast.error(
          notifications.deliveryMessage ??
            'Interview saved. Emails were not sent — add SMTP settings to backend/.env (see .env.example).',
        )
      } else if (sent.length > 0) {
        const preview = sent.find((s) => s.previewUrl)?.previewUrl
        if (notifications?.deliveryChannel === 'ethereal') {
          toast.success(
            preview
              ? `Interview scheduled. ${sent.length} test email(s) sent. Preview: ${preview}`
              : `Interview scheduled. ${sent.length} test email(s) sent (check backend logs for Ethereal preview links).`,
          )
        } else {
          toast.success(
            `Interview scheduled. ${sent.length} notification email(s) sent to inboxes.`,
          )
        }
      } else {
        toast.success('Interview scheduled successfully')
      }
      if (skipped.length > 0) {
        toast.error(`${skipped.length} duplicate notification(s) skipped.`)
      }
      await loadInterviews()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const handleReschedule = async (payload: RescheduleInterviewPayload) => {
    if (!activeInterview) return
    setSubmitting(true)
    try {
      await interviewApi.rescheduleInterview(activeInterview.id, payload)
      toast.success('Interview rescheduled successfully')
      setDrawerOpen(false)
      await loadInterviews()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = async (values: CancelInterviewFormValues) => {
    if (!activeInterview) return
    setSubmitting(true)
    try {
      const payload: CancelInterviewPayload = {
        reason: values.reason,
        sendEmailToCandidate: values.sendEmailToCandidate,
        sendEmailToInterviewer: values.sendEmailToInterviewer,
      }
      await interviewApi.cancelInterview(activeInterview.id, payload)
      toast.success('Interview cancelled')
      setDrawerOpen(false)
      await loadInterviews()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const handleMarkCompleted = async (interview: Interview) => {
    setSubmitting(true)
    try {
      await interviewApi.markInterviewCompleted(interview.id)
      toast.success('Interview marked as completed')
      setDrawerOpen(false)
      await loadInterviews()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const openDetails = (interview: Interview) => {
    setActiveInterview(interview)
    setDrawerOpen(true)
  }

  const columns: DataTableColumn<Interview>[] = [
    {
      key: 'candidate',
      header: 'Candidate',
      render: (row) => (
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{row.candidateName}</p>
          <p className="text-xs text-zinc-500">{row.candidateEmail}</p>
        </div>
      ),
    },
    {
      key: 'job',
      header: 'Job title',
      render: (row) => (
        <span className="text-zinc-700 dark:text-zinc-300">{row.jobTitle}</span>
      ),
    },
    {
      key: 'round',
      header: 'Round',
      render: (row) => (
        <span className="text-zinc-600 dark:text-zinc-400">
          {INTERVIEW_ROUND_LABELS[row.round]}
        </span>
      ),
    },
    {
      key: 'interviewer',
      header: 'Interviewer',
      render: (row) => (
        <div>
          <p className="text-zinc-800 dark:text-zinc-200">{row.interviewerName}</p>
          <p className="text-xs text-zinc-500">{row.interviewerEmail}</p>
        </div>
      ),
    },
    {
      key: 'datetime',
      header: 'Date & time',
      render: (row) => (
        <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
          <div>
            <p>{formatDateTimeDDMMYYYY(row.scheduledAt)}</p>
            <p className="text-xs">{row.durationMinutes} min</p>
          </div>
        </div>
      ),
    },
    {
      key: 'meeting',
      header: 'Meeting mode',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
          {row.meetingType === 'virtual' ? (
            <Video className="h-3.5 w-3.5" />
          ) : (
            <MapPin className="h-3.5 w-3.5" />
          )}
          {MEETING_TYPE_LABELS[row.meetingType]}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge className={cn(INTERVIEW_STATUS_COLORS[row.status])}>
          {INTERVIEW_STATUS_LABELS[row.status]}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right whitespace-nowrap',
      render: (row) => (
        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
          <button
            type="button"
            className={interviewActionLinkClass}
            onClick={() => openDetails(row)}
          >
            View
          </button>
          {row.status === 'scheduled' && (
            <>
              <button
                type="button"
                className={interviewActionLinkClass}
                onClick={() => {
                  setActiveInterview(row)
                  setRescheduleOpen(true)
                }}
              >
                Reschedule
              </button>
              <button
                type="button"
                className={interviewDangerLinkClass}
                onClick={() => {
                  setActiveInterview(row)
                  setCancelOpen(true)
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interviews"
        description="Schedule, manage, and notify participants across your hiring pipeline"
        actions={
          <ShadcnButton onClick={() => setScheduleOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Schedule interview
          </ShadcnButton>
        }
      />

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/40">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search candidate, job, or interviewer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              aria-label="Search interviews"
            />
          </div>
          <Select
            options={INTERVIEW_STATUS_OPTIONS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InterviewStatus | '')}
            aria-label="Filter by status"
          />
          <Select
            options={[{ value: '', label: 'All rounds' }, ...INTERVIEW_ROUND_OPTIONS]}
            value={roundFilter}
            onChange={(e) => setRoundFilter(e.target.value as InterviewRound | '')}
            aria-label="Filter by round"
          />
          <Select
            options={interviewerOptions}
            value={interviewerFilter}
            onChange={(e) => setInterviewerFilter(e.target.value)}
            aria-label="Filter by interviewer"
          />
          <DateInputDDMMYYYY
            value={dateFilter}
            onChange={setDateFilter}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      )}

      {loading ? (
        <InterviewTableSkeleton />
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No interviews scheduled"
          description={
            USE_MOCK
              ? 'Schedule your first interview to see it here'
              : 'Use Schedule interview to book a session with email notifications'
          }
          action={
            <ShadcnButton onClick={() => setScheduleOpen(true)}>
              <Plus className="h-4 w-4" />
              Schedule interview
            </ShadcnButton>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={interviews}
          keyExtractor={(row) => row.id}
          emptyMessage="No interviews match your filters"
        />
      )}

      <ScheduleInterviewModal
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        candidates={candidates}
        staff={staff}
        onStaffChange={setStaff}
        onSubmit={handleSchedule}
        isSubmitting={submitting}
      />

      <RescheduleInterviewModal
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        interview={activeInterview}
        staff={staff}
        onSubmit={handleReschedule}
        isSubmitting={submitting}
      />

      <CancelInterviewDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        interview={activeInterview}
        onConfirm={handleCancel}
        isSubmitting={submitting}
      />

      <InterviewDetailsDrawer
        interview={activeInterview}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onReschedule={(i) => {
          setActiveInterview(i)
          setRescheduleOpen(true)
        }}
        onCancel={(i) => {
          setActiveInterview(i)
          setCancelOpen(true)
        }}
        onMarkCompleted={handleMarkCompleted}
        isActionLoading={submitting}
      />
    </div>
  )
}
