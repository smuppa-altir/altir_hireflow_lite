import type { LucideIcon } from 'lucide-react'
import {
  Briefcase,
  Gift,
  Mail,
  MessageSquare,
  RefreshCw,
  StickyNote,
  UserCheck,
  UserPlus,
  UserX,
  Video,
} from 'lucide-react'
import type { ActivityActionType } from '@/types/activityLog'

export const ACTION_CONFIG: Record<
  ActivityActionType,
  { label: string; icon: LucideIcon; color: string; bg: string }
> = {
  candidate_created: {
    label: 'Candidate Created',
    icon: UserPlus,
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50 ring-1 ring-blue-100 dark:bg-blue-500/15 dark:ring-0',
  },
  stage_change: {
    label: 'Stage Change',
    icon: RefreshCw,
    color: 'text-violet-700 dark:text-violet-400',
    bg: 'bg-violet-50 ring-1 ring-violet-100 dark:bg-violet-500/15 dark:ring-0',
  },
  feedback_submitted: {
    label: 'Feedback Submitted',
    icon: MessageSquare,
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 ring-1 ring-amber-100 dark:bg-amber-500/15 dark:ring-0',
  },
  offer_released: {
    label: 'Offer Released',
    icon: Gift,
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-500/15 dark:ring-0',
  },
  interview_scheduled: {
    label: 'Interview Scheduled',
    icon: Video,
    color: 'text-indigo-700 dark:text-indigo-400',
    bg: 'bg-indigo-50 ring-1 ring-indigo-100 dark:bg-indigo-500/15 dark:ring-0',
  },
  offer_accepted: {
    label: 'Offer Accepted',
    icon: Gift,
    color: 'text-green-700 dark:text-green-400',
    bg: 'bg-green-50 ring-1 ring-green-100 dark:bg-green-500/15 dark:ring-0',
  },
  candidate_hired: {
    label: 'Candidate Hired',
    icon: UserCheck,
    color: 'text-green-700 dark:text-green-400',
    bg: 'bg-green-50 ring-1 ring-green-100 dark:bg-green-500/15 dark:ring-0',
  },
  candidate_rejected: {
    label: 'Candidate Rejected',
    icon: UserX,
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-50 ring-1 ring-red-100 dark:bg-red-500/15 dark:ring-0',
  },
  job_created: {
    label: 'Job Created',
    icon: Briefcase,
    color: 'text-cyan-700 dark:text-cyan-400',
    bg: 'bg-cyan-50 ring-1 ring-cyan-100 dark:bg-cyan-500/15 dark:ring-0',
  },
  note_added: {
    label: 'Note Added',
    icon: StickyNote,
    color: 'text-zinc-700 dark:text-zinc-400',
    bg: 'bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-500/15 dark:ring-0',
  },
  email_sent: {
    label: 'Email Sent',
    icon: Mail,
    color: 'text-zinc-700 dark:text-zinc-400',
    bg: 'bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-500/15 dark:ring-0',
  },
}

export const ACTION_FILTER_OPTIONS = [
  { value: '', label: 'All actions' },
  ...Object.entries(ACTION_CONFIG).map(([value, { label }]) => ({
    value,
    label,
  })),
]
