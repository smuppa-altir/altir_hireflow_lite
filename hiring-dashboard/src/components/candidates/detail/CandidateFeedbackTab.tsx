import { MessageSquare, Star, ThumbsDown, ThumbsUp } from 'lucide-react'
import type { CandidateDetail, FeedbackRecommendation } from '@/types/candidateDetail'
import { cn, formatDate } from '@/utils'

interface CandidateFeedbackTabProps {
  candidate: CandidateDetail
}

const recommendationConfig: Record<
  FeedbackRecommendation,
  { label: string; className: string; icon: typeof ThumbsUp }
> = {
  strong_yes: {
    label: 'Strong Yes',
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400',
    icon: ThumbsUp,
  },
  yes: {
    label: 'Yes',
    className:
      'border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/15 dark:text-green-400',
    icon: ThumbsUp,
  },
  neutral: {
    label: 'Neutral',
    className:
      'border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-500/30 dark:bg-zinc-500/15 dark:text-zinc-400',
    icon: MessageSquare,
  },
  no: {
    label: 'No',
    className:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400',
    icon: ThumbsDown,
  },
  strong_no: {
    label: 'Strong No',
    className:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-400',
    icon: ThumbsDown,
  },
  hire: {
    label: 'Hire',
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400',
    icon: ThumbsUp,
  },
  maybe: {
    label: 'Maybe',
    className:
      'border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-500/30 dark:bg-zinc-500/15 dark:text-zinc-400',
    icon: MessageSquare,
  },
  reject: {
    label: 'Reject',
    className:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-400',
    icon: ThumbsDown,
  },
}

function FeedbackCard({ feedback }: { feedback: CandidateDetail['feedback'][0] }) {
  const config = recommendationConfig[feedback.recommendation]
  const Icon = config.icon

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-950/40 dark:shadow-none dark:hover:border-zinc-700/80">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{feedback.interviewer}</p>
          <p className="text-xs text-zinc-500">
            {feedback.interviewerRole} · {feedback.interviewType}
          </p>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
            config.className,
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {config.label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
        <span>{formatDate(feedback.date)}</span>
        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
          <Star className="h-3.5 w-3.5 fill-current" />
          {feedback.rating.toFixed(1)} / 5
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {feedback.comment}
      </p>
    </article>
  )
}

export function CandidateFeedbackTab({ candidate }: CandidateFeedbackTabProps) {
  if (candidate.feedback.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800">
        <MessageSquare className="h-10 w-10 text-zinc-400 dark:text-zinc-600" />
        <p className="mt-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">No feedback yet</p>
        <p className="mt-1 text-xs text-zinc-500">
          Interview feedback will appear here after sessions are completed
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-500">
        {candidate.feedback.length} interview feedback
        {candidate.feedback.length !== 1 ? 's' : ''} on record
      </p>
      {candidate.feedback.map((fb) => (
        <FeedbackCard key={fb.id} feedback={fb} />
      ))}
    </div>
  )
}
