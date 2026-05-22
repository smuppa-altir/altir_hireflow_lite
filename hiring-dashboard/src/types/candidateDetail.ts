import type { Candidate } from './candidate'

export type FeedbackRecommendation =
  | 'strong_yes'
  | 'yes'
  | 'neutral'
  | 'no'
  | 'strong_no'
  | 'hire'
  | 'maybe'
  | 'reject'

export interface InterviewFeedback {
  id: string
  interviewer: string
  interviewerRole: string
  interviewType: string
  date: string
  rating: number
  recommendation: FeedbackRecommendation
  comment: string
}

export type TimelineEventType =
  | 'application'
  | 'stage_change'
  | 'interview'
  | 'feedback'
  | 'offer'
  | 'email'
  | 'note'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description?: string
  actor: string
  timestamp: string
}

export interface CandidateDetail extends Candidate {
  feedback: InterviewFeedback[]
  timeline: TimelineEvent[]
}
