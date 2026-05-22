import { MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react'
import type { FeedbackRecommendation } from '@/types/feedback'

export const RECOMMENDATION_CONFIG: Record<
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

/** Recommendation options when submitting feedback to the API */
export const API_RECOMMENDATION_OPTIONS = [
  { value: 'hire' as const, label: 'Hire' },
  { value: 'maybe' as const, label: 'Maybe' },
  { value: 'reject' as const, label: 'Reject' },
]

const mockRecommendationKeys = ['strong_yes', 'yes', 'neutral', 'no', 'strong_no'] as const

export const RECOMMENDATION_FILTER_OPTIONS = [
  { value: '', label: 'All recommendations' },
  ...mockRecommendationKeys.map((value) => ({
    value,
    label: RECOMMENDATION_CONFIG[value].label,
  })),
]

export const API_RECOMMENDATION_FILTER_OPTIONS = [
  { value: '', label: 'All recommendations' },
  ...API_RECOMMENDATION_OPTIONS.map(({ value, label }) => ({ value, label })),
]

export const RATING_FILTER_OPTIONS = [
  { value: '', label: 'All ratings' },
  { value: '4', label: '4+ stars' },
  { value: '3', label: '3+ stars' },
  { value: '2', label: '2+ stars' },
  { value: '1', label: '1+ stars' },
]

export const INTERVIEW_TYPE_OPTIONS = [
  'Phone Screen',
  'Technical Interview',
  'Culture Fit',
  'Panel Interview',
  'Portfolio Review',
  'HR Round',
]
