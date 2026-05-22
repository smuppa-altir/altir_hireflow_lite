import { useEffect, useState } from 'react'
import { FieldLabel } from '@/components/common'
import { CANDIDATES_MOCK_DATA } from '@/components/candidates/candidatesMockData'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ShadcnButton } from '@/components/ui/shadcn-button'
import { ShadcnInput } from '@/components/ui/shadcn-input'
import { ShadcnSelect } from '@/components/ui/shadcn-select'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks'
import { candidateService } from '@/services'
import {
  API_RECOMMENDATION_OPTIONS,
  INTERVIEW_TYPE_OPTIONS,
  RECOMMENDATION_CONFIG,
} from './feedbackConstants'
import type { FeedbackFormData, FeedbackListItem, FeedbackRecommendation } from '@/types/feedback'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

interface AddFeedbackModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FeedbackFormData) => void | Promise<void>
  submitting?: boolean
}

const EMPTY_FORM_MOCK: FeedbackFormData = {
  candidateId: '',
  interviewer: '',
  interviewerRole: '',
  interviewType: 'Technical Interview',
  rating: 4,
  recommendation: 'yes',
  comment: '',
}

const EMPTY_FORM_API: FeedbackFormData = {
  candidateId: '',
  interviewer: '',
  interviewerRole: '',
  interviewType: 'Interview',
  rating: 4,
  recommendation: 'hire',
  comment: '',
}

const mockRecommendationOptions = Object.entries(RECOMMENDATION_CONFIG)
  .filter(([value]) => !['hire', 'maybe', 'reject'].includes(value))
  .map(([value, { label }]) => ({
    value,
    label,
  }))

const mockCandidateOptions = CANDIDATES_MOCK_DATA.map((c) => ({
  value: c.id,
  label: `${c.firstName} ${c.lastName} — ${c.jobTitle}`,
}))

export function AddFeedbackModal({
  open,
  onOpenChange,
  onSubmit,
  submitting = false,
}: AddFeedbackModalProps) {
  const { user } = useAuth()
  const [form, setForm] = useState<FeedbackFormData>(USE_MOCK ? EMPTY_FORM_MOCK : EMPTY_FORM_API)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const [candidateOptions, setCandidateOptions] = useState(mockCandidateOptions)
  const [loadingCandidates, setLoadingCandidates] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(USE_MOCK ? EMPTY_FORM_MOCK : EMPTY_FORM_API)
      setErrors({})
    }
  }, [open])

  useEffect(() => {
    if (!open || USE_MOCK) return
    setLoadingCandidates(true)
    candidateService
      .getAll({ pageSize: 100 })
      .then((result) => {
        setCandidateOptions(
          result.data.map((c) => ({
            value: c.id,
            label: `${c.firstName} ${c.lastName} — ${c.jobTitle}`,
          })),
        )
      })
      .catch(() => setCandidateOptions([]))
      .finally(() => setLoadingCandidates(false))
  }, [open])

  const update = <K extends keyof FeedbackFormData>(field: K, value: FeedbackFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.candidateId) next.candidateId = 'Select a candidate'
    if (USE_MOCK && !form.interviewer.trim()) {
      next.interviewer = 'Interviewer name is required'
    }
    if (!USE_MOCK && !user?.id) {
      next.interviewer = 'You must be signed in to submit feedback'
    }
    if (!form.comment.trim()) next.comment = 'Comments are required'
    else if (form.comment.trim().length < 10) {
      next.comment = 'Comments must be at least 10 characters'
    }
    if (!USE_MOCK) {
      const rating = Math.round(form.rating)
      if (rating < 1 || rating > 5) next.rating = 'Rating must be between 1 and 5'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await onSubmit(form)
  }

  const recommendationOptions = USE_MOCK ? mockRecommendationOptions : API_RECOMMENDATION_OPTIONS
  const candidates = USE_MOCK ? mockCandidateOptions : candidateOptions

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Feedback</DialogTitle>
          <DialogDescription>
            Record interview feedback for a candidate in the hiring pipeline
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FieldLabel required>Candidate</FieldLabel>
            <ShadcnSelect
              value={form.candidateId}
              onChange={(e) => update('candidateId', e.target.value)}
              disabled={loadingCandidates}
            >
              <option value="">
                {loadingCandidates ? 'Loading candidates…' : 'Select candidate'}
              </option>
              {candidates.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </ShadcnSelect>
            {errors.candidateId && (
              <p className="mt-1 text-xs text-red-400">{errors.candidateId}</p>
            )}
          </div>

          {USE_MOCK ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel required>Interviewer</FieldLabel>
                <ShadcnInput
                  value={form.interviewer}
                  onChange={(e) => update('interviewer', e.target.value)}
                  placeholder="e.g. Jordan Lee"
                />
                {errors.interviewer && (
                  <p className="mt-1 text-xs text-red-400">{errors.interviewer}</p>
                )}
              </div>
              <div>
                <FieldLabel>Role</FieldLabel>
                <ShadcnInput
                  value={form.interviewerRole}
                  onChange={(e) => update('interviewerRole', e.target.value)}
                  placeholder="e.g. Engineering Manager"
                />
              </div>
            </div>
          ) : (
            <div>
              <FieldLabel>Interviewer</FieldLabel>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {user?.name ?? '—'}
                {user?.role ? ` · ${user.role.replace(/_/g, ' ')}` : ''}
              </p>
              {errors.interviewer && (
                <p className="mt-1 text-xs text-red-400">{errors.interviewer}</p>
              )}
            </div>
          )}

          {USE_MOCK && (
            <div>
              <FieldLabel required>Interview type</FieldLabel>
              <ShadcnSelect
                value={form.interviewType}
                onChange={(e) => update('interviewType', e.target.value)}
              >
                {INTERVIEW_TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </ShadcnSelect>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel required>Rating (1–5)</FieldLabel>
              <ShadcnInput
                type="number"
                min={1}
                max={5}
                step={USE_MOCK ? 0.1 : 1}
                value={form.rating}
                onChange={(e) => update('rating', Number(e.target.value))}
              />
              {errors.rating && <p className="mt-1 text-xs text-red-400">{errors.rating}</p>}
            </div>
            <div>
              <FieldLabel required>Recommendation</FieldLabel>
              <ShadcnSelect
                value={form.recommendation}
                onChange={(e) =>
                  update('recommendation', e.target.value as FeedbackRecommendation)
                }
              >
                {recommendationOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </ShadcnSelect>
            </div>
          </div>

          <div>
            <FieldLabel required>Comments</FieldLabel>
            <Textarea
              value={form.comment}
              onChange={(e) => update('comment', e.target.value)}
              rows={4}
              placeholder="Interview notes, strengths, areas of concern..."
            />
            {errors.comment && (
              <p className="mt-1 text-xs text-red-400">{errors.comment}</p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <ShadcnButton
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </ShadcnButton>
            <ShadcnButton type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Add feedback'}
            </ShadcnButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function formToFeedbackItem(data: FeedbackFormData): FeedbackListItem {
  const candidate = CANDIDATES_MOCK_DATA.find((c) => c.id === data.candidateId)!
  return {
    id: `fb-${Date.now()}`,
    candidateId: data.candidateId,
    candidateName: `${candidate.firstName} ${candidate.lastName}`,
    jobTitle: candidate.jobTitle,
    interviewer: data.interviewer.trim(),
    interviewerRole: data.interviewerRole.trim() || 'Interviewer',
    interviewType: data.interviewType,
    date: new Date().toISOString(),
    rating: data.rating,
    recommendation: data.recommendation,
    comment: data.comment.trim(),
  }
}
