import { Calendar, Star, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { RECOMMENDATION_CONFIG } from './feedbackConstants'
import type { FeedbackListItem } from '@/types/feedback'
import { cn, formatDate, getInitials } from '@/utils'

interface FeedbackCardProps {
  feedback: FeedbackListItem
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const config =
    RECOMMENDATION_CONFIG[feedback.recommendation] ?? RECOMMENDATION_CONFIG.neutral
  const Icon = config.icon

  return (
    <article className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-all duration-200 hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700/80 dark:hover:shadow-lg dark:hover:shadow-black/20">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
            {getInitials(feedback.candidateName)}
          </div>
          <div className="min-w-0">
            <Link
              to={ROUTES.CANDIDATE_DETAIL.replace(':id', feedback.candidateId)}
              className="block truncate font-semibold text-zinc-900 transition-colors hover:text-indigo-600 group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400"
            >
              {feedback.candidateName}
            </Link>
            <p className="truncate text-xs text-zinc-600 dark:text-zinc-500">
              {feedback.jobTitle}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
            config.className,
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {config.label}
        </span>
      </div>

      {/* Rating */}
      <div className="mt-4 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-4 w-4',
              i < Math.floor(feedback.rating)
                ? 'fill-amber-400 text-amber-400'
                : i < feedback.rating
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'text-zinc-300 dark:text-zinc-700',
            )}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-amber-600 dark:text-amber-400">
          {feedback.rating.toFixed(1)}
        </span>
      </div>

      {/* Interviewer */}
      <div className="mt-4 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <User className="h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-600" />
        <span>
          <span className="font-medium text-zinc-800 dark:text-zinc-300">
            {feedback.interviewer}
          </span>
          <span className="text-zinc-400 dark:text-zinc-600"> · </span>
          {feedback.interviewerRole}
          <span className="text-zinc-400 dark:text-zinc-600"> · </span>
          {feedback.interviewType}
        </span>
      </div>

      {/* Comments */}
      <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {feedback.comment}
      </p>

      {/* Date */}
      <div className="mt-4 flex items-center gap-1.5 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800/80">
        <Calendar className="h-3.5 w-3.5" />
        {formatDate(feedback.date)}
      </div>
    </article>
  )
}
