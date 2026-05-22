import type { FeedbackRecommendation } from './candidateDetail'

export type { FeedbackRecommendation }

export interface FeedbackListItem {
  id: string
  candidateId: string
  candidateName: string
  jobTitle: string
  interviewer: string
  interviewerRole: string
  interviewType: string
  date: string
  rating: number
  recommendation: FeedbackRecommendation
  comment: string
}

export interface FeedbackFormData {
  candidateId: string
  interviewer: string
  interviewerRole: string
  interviewType: string
  rating: number
  recommendation: FeedbackRecommendation
  comment: string
}
