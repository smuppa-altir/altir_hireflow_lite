import type { InterviewFeedback } from './candidateDetail'
import type { CandidateSource } from '@/constants/candidateSource'
import type { PipelineStage } from './kanban'

export interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  pipelineStage: PipelineStage
  jobId: string
  jobTitle: string
  location?: string
  experienceYears?: number
  skills: string[]
  resumeUrl?: string
  linkedinUrl?: string
  photoUrl?: string
  experienceSummary?: string
  notes?: string
  rating?: number
  source?: CandidateSource
  appliedAt: string
  updatedAt: string
  /** Populated from API candidate detail; used instead of synthetic feedback */
  feedback?: InterviewFeedback[]
}

export interface CandidateFilters {
  pipelineStage?: PipelineStage
  jobId?: string
  search?: string
}
