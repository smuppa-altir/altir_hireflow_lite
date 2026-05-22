import { API_ENDPOINTS } from '@/constants'
import { FEEDBACK_MOCK_DATA } from '@/components/feedback/feedbackMockData'
import type { FeedbackFormData, FeedbackListItem } from '@/types/feedback'
import type { PaginatedResponse, PaginationParams } from '@/types'
import { mapApiFeedback, type ApiFeedback } from './apiMappers'
import { apiClient } from './api'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export type ApiFeedbackRecommendation = 'hire' | 'maybe' | 'reject'

export interface FeedbackListParams extends PaginationParams {
  recommendation?: ApiFeedbackRecommendation
  minRating?: number
}

export interface CreateFeedbackInput {
  candidateId: string
  interviewerId: string
  rating: number
  comments: string
  recommendation: ApiFeedbackRecommendation
}

export const feedbackService = {
  async getAll(params?: FeedbackListParams): Promise<PaginatedResponse<FeedbackListItem>> {
    if (USE_MOCK) {
      await delay(400)
      let filtered = [...FEEDBACK_MOCK_DATA]
      if (params?.recommendation) {
        filtered = filtered.filter((f) => f.recommendation === params.recommendation)
      }
      if (params?.minRating) {
        filtered = filtered.filter((f) => f.rating >= params.minRating!)
      }
      return paginate(filtered, params?.page ?? 1, params?.pageSize ?? 100)
    }

    const { data } = await apiClient.get<{
      data: PaginatedResponse<ApiFeedback>
    }>(API_ENDPOINTS.FEEDBACK.BASE, {
      params: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 100,
        recommendation: params?.recommendation,
        minRating: params?.minRating,
      },
    })
    const page = data.data
    return {
      ...page,
      data: page.data.map(mapApiFeedback),
    }
  },

  async getByCandidate(
    candidateId: string,
    params?: FeedbackListParams,
  ): Promise<PaginatedResponse<FeedbackListItem>> {
    if (USE_MOCK) {
      await delay(300)
      const filtered = FEEDBACK_MOCK_DATA.filter((f) => f.candidateId === candidateId)
      return paginate(filtered, params?.page ?? 1, params?.pageSize ?? 50)
    }

    const { data } = await apiClient.get<{
      data: PaginatedResponse<ApiFeedback>
    }>(API_ENDPOINTS.FEEDBACK.BY_CANDIDATE(candidateId), {
      params: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 50,
        recommendation: params?.recommendation,
        minRating: params?.minRating,
      },
    })
    const page = data.data
    return {
      ...page,
      data: page.data.map(mapApiFeedback),
    }
  },

  async create(input: CreateFeedbackInput): Promise<FeedbackListItem> {
    if (USE_MOCK) {
      await delay(400)
      const mock: FeedbackListItem = {
        id: `fb-${Date.now()}`,
        candidateId: input.candidateId,
        candidateName: 'Candidate',
        jobTitle: '—',
        interviewer: 'You',
        interviewerRole: 'Interviewer',
        interviewType: 'Interview',
        date: new Date().toISOString(),
        rating: input.rating,
        recommendation: input.recommendation,
        comment: input.comments,
      }
      return mock
    }

    const { data } = await apiClient.post<{ data: ApiFeedback }>(API_ENDPOINTS.FEEDBACK.BASE, {
      candidateId: input.candidateId,
      interviewer: input.interviewerId,
      rating: input.rating,
      comments: input.comments,
      recommendation: input.recommendation,
    })
    return mapApiFeedback(data.data)
  },
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const start = (page - 1) * pageSize
  const data = items.slice(start, start + pageSize)
  return {
    data,
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize) || 1,
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function formToCreateInput(
  data: FeedbackFormData,
  interviewerId: string,
): CreateFeedbackInput {
  return {
    candidateId: data.candidateId,
    interviewerId,
    rating: Math.round(Math.min(5, Math.max(1, data.rating))),
    comments: data.comment.trim(),
    recommendation: data.recommendation as ApiFeedbackRecommendation,
  }
}
