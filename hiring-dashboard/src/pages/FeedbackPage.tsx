import { MessageSquare, Plus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/components/common'
import { AddFeedbackModal } from '@/components/feedback/AddFeedbackModal'
import { FeedbackCard } from '@/components/feedback/FeedbackCard'
import {
  API_RECOMMENDATION_FILTER_OPTIONS,
  RATING_FILTER_OPTIONS,
  RECOMMENDATION_FILTER_OPTIONS,
} from '@/components/feedback/feedbackConstants'
import { Button, EmptyState, Select, Spinner } from '@/components/ui'
import { useAuth } from '@/hooks'
import {
  feedbackService,
  formToCreateInput,
  getApiErrorMessage,
  type ApiFeedbackRecommendation,
} from '@/services'
import type { FeedbackFormData, FeedbackListItem, FeedbackRecommendation } from '@/types/feedback'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const API_RECOMMENDATIONS = new Set<string>(['hire', 'maybe', 'reject'])

function isApiRecommendation(value: string): value is ApiFeedbackRecommendation {
  return API_RECOMMENDATIONS.has(value)
}

export function FeedbackPage() {
  const { user } = useAuth()
  const [feedbackList, setFeedbackList] = useState<FeedbackListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [recommendationFilter, setRecommendationFilter] = useState<FeedbackRecommendation | ''>(
    '',
  )
  const [ratingFilter, setRatingFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const loadFeedback = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const minRating = ratingFilter ? Number(ratingFilter) : undefined
      const apiRecommendation =
        !USE_MOCK && recommendationFilter && isApiRecommendation(recommendationFilter)
          ? recommendationFilter
          : undefined

      const result = await feedbackService.getAll({
        pageSize: 100,
        minRating,
        recommendation: apiRecommendation,
      })
      setFeedbackList(result.data)
    } catch (err) {
      setError(getApiErrorMessage(err))
      setFeedbackList([])
    } finally {
      setLoading(false)
    }
  }, [ratingFilter, recommendationFilter])

  useEffect(() => {
    loadFeedback()
  }, [loadFeedback])

  const filteredFeedback = useMemo(() => {
    let result = [...feedbackList]

    if (recommendationFilter && (USE_MOCK || !isApiRecommendation(recommendationFilter))) {
      result = result.filter((f) => f.recommendation === recommendationFilter)
    }

    if (ratingFilter) {
      const minRating = Number(ratingFilter)
      result = result.filter((f) => f.rating >= minRating)
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [feedbackList, recommendationFilter, ratingFilter])

  const handleAddFeedback = useCallback(
    async (data: FeedbackFormData) => {
      if (!user?.id) {
        setError('You must be signed in to submit feedback')
        return
      }
      setSubmitting(true)
      setError(null)
      try {
        const created = await feedbackService.create(formToCreateInput(data, user.id))
        setFeedbackList((prev) => [created, ...prev])
        setModalOpen(false)
      } catch (err) {
        setError(getApiErrorMessage(err))
      } finally {
        setSubmitting(false)
      }
    },
    [user?.id],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interview Feedback"
        description={`${filteredFeedback.length} feedback record${filteredFeedback.length !== 1 ? 's' : ''}`}
        actions={
          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500"
            disabled={!user}
          >
            <Plus className="h-4 w-4" />
            Add Feedback
          </Button>
        }
      />

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          options={
            USE_MOCK ? [...RECOMMENDATION_FILTER_OPTIONS] : [...API_RECOMMENDATION_FILTER_OPTIONS]
          }
          value={recommendationFilter}
          onChange={(e) =>
            setRecommendationFilter(e.target.value as FeedbackRecommendation | '')
          }
          className="sm:w-56"
        />
        <Select
          options={[...RATING_FILTER_OPTIONS]}
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="sm:w-44"
        />
        {(recommendationFilter || ratingFilter) && (
          <button
            type="button"
            onClick={() => {
              setRecommendationFilter('')
              setRatingFilter('')
            }}
            className="text-sm text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : filteredFeedback.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No feedback found"
          description="Adjust filters or add new interview feedback"
          action={
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500"
              disabled={!user}
            >
              <Plus className="h-4 w-4" />
              Add Feedback
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredFeedback.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      )}

      <AddFeedbackModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleAddFeedback}
        submitting={submitting}
      />
    </div>
  )
}
