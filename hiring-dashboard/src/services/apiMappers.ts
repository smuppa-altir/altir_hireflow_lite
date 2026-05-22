import type { CandidateSource } from '@/constants/candidateSource'
import { normalizeCandidateSource } from '@/constants/candidateSource'
import type {
  Candidate,
  Interview,
  Job,
  User,
  UserRole,
} from '@/types'
import type { FeedbackRecommendation, InterviewFeedback } from '@/types/candidateDetail'
import { apiStageToPipelineStage } from '@/utils/kanbanStages'
import type { FeedbackListItem } from '@/types/feedback'

/** Job DTO from HireFlow API */
export interface ApiJob {
  id: string
  title: string
  department: string
  location: string
  experience: string
  description: string
  status: string
  candidateCount?: number
  createdAt: string
  updatedAt: string
}

export interface ApiCandidateFeedback {
  id: string
  rating: number
  comments: string
  recommendation: string
  interviewerName: string
  createdAt: string
}

/** Candidate DTO from HireFlow API */
export interface ApiCandidate {
  id: string
  name: string
  email: string
  phone?: string
  linkedin?: string
  resumeUrl?: string
  currentStage: string
  appliedDate: string
  jobId: string
  jobTitle: string
  jobDepartment?: string
  experienceYears?: number
  rating?: number
  source?: string
  skills?: string[]
  createdAt: string
  updatedAt: string
  feedback?: ApiCandidateFeedback[]
}

/** Feedback DTO from HireFlow API */
export interface ApiFeedback {
  id: string
  candidateId: string
  candidateName: string
  candidateEmail?: string
  jobTitle: string
  interviewer: { id: string; name: string; email: string }
  rating: number
  comments: string
  recommendation: string
  createdAt: string
  updatedAt: string
}

/** Interview DTO from HireFlow API */
export interface ApiInterview {
  id: string
  candidateId: string
  candidateName: string
  candidateEmail?: string
  jobId?: string
  jobTitle: string
  interviewer: { id: string; name: string; email?: string }
  round: string
  date: string
  durationMinutes?: number
  meetingType?: string
  meetingLink?: string
  location?: string
  notes?: string
  candidateInstructions?: string
  cancelReason?: string
  status: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiAuthPayload {
  user: { id: string; email: string; name: string; role: string }
  accessToken: string
  refreshToken: string
}

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

function toUserRole(role: string): UserRole {
  const normalized = role.toLowerCase() as UserRole
  if (
    normalized === 'admin' ||
    normalized === 'recruiter' ||
    normalized === 'hiring_manager' ||
    normalized === 'interviewer' ||
    normalized === 'viewer'
  ) {
    return normalized
  }
  return 'recruiter'
}

export function mapApiUser(user: ApiAuthPayload['user']): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: toUserRole(user.role),
  }
}

export function mapApiJob(job: ApiJob): Job {
  return {
    id: job.id,
    title: job.title,
    department: job.department,
    location: job.location || '—',
    experience: job.experience || '—',
    status: job.status as Job['status'],
    employmentType: 'full_time',
    description: job.description || '',
    requirements: [],
    candidateCount: job.candidateCount ?? 0,
    hiringManagerId: '',
    hiringManagerName: '—',
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  }
}

function mapApiCandidateFeedbackItem(f: ApiCandidateFeedback): InterviewFeedback {
  return {
    id: f.id,
    interviewer: f.interviewerName,
    interviewerRole: 'Interviewer',
    interviewType: 'Interview',
    date: f.createdAt,
    rating: f.rating,
    recommendation: f.recommendation as FeedbackRecommendation,
    comment: f.comments,
  }
}

export function mapApiFeedback(f: ApiFeedback): FeedbackListItem {
  return {
    id: f.id,
    candidateId: f.candidateId,
    candidateName: f.candidateName,
    jobTitle: f.jobTitle,
    interviewer: f.interviewer.name,
    interviewerRole: 'Interviewer',
    interviewType: 'Interview',
    date: f.createdAt,
    rating: f.rating,
    recommendation: f.recommendation as FeedbackRecommendation,
    comment: f.comments,
  }
}

export function mapApiCandidate(c: ApiCandidate): Candidate {
  const { firstName, lastName } = splitName(c.name)
  const stage = c.currentStage.toLowerCase().replace(/-/g, '_')
  return {
    id: c.id,
    firstName,
    lastName,
    email: c.email,
    phone: c.phone,
    pipelineStage: apiStageToPipelineStage(stage),
    jobId: c.jobId,
    jobTitle: c.jobTitle,
    skills: c.skills ?? [],
    resumeUrl: c.resumeUrl,
    linkedinUrl: c.linkedin,
    appliedAt: c.appliedDate,
    updatedAt: c.updatedAt,
    experienceYears: c.experienceYears,
    rating: c.rating,
    source: c.source ? (normalizeCandidateSource(c.source) || (c.source as CandidateSource)) : undefined,
    feedback: c.feedback?.map(mapApiCandidateFeedbackItem),
  }
}

const ROUND_NORMALIZE: Record<string, Interview['round']> = {
  screening: 'screening',
  phone: 'screening',
  technical: 'technical',
  manager_round: 'manager_round',
  onsite: 'manager_round',
  hr: 'hr_round',
  hr_round: 'hr_round',
  panel: 'final',
  final: 'final',
  final_round: 'final',
}

export function mapApiInterview(i: ApiInterview): Interview {
  const roundKey = i.round.toLowerCase().replace(/-/g, '_')
  const meetingType = (i.meetingType ?? 'virtual').toLowerCase().replace(/-/g, '_') as Interview['meetingType']
  return {
    id: i.id,
    candidateId: i.candidateId,
    candidateName: i.candidateName,
    candidateEmail: i.candidateEmail ?? '',
    jobId: i.jobId ?? '',
    jobTitle: i.jobTitle,
    interviewerId: i.interviewer.id,
    interviewerName: i.interviewer.name,
    interviewerEmail: i.interviewer.email ?? '',
    round: ROUND_NORMALIZE[roundKey] ?? 'screening',
    status: i.status as Interview['status'],
    scheduledAt: i.date,
    durationMinutes: i.durationMinutes ?? 60,
    meetingType: meetingType === 'in_person' ? 'in_person' : 'virtual',
    meetingLink: i.meetingLink,
    location: i.location,
    notes: i.notes,
    candidateInstructions: i.candidateInstructions,
    cancelReason: i.cancelReason,
    createdAt: i.createdAt,
    updatedAt: i.updatedAt,
  }
}
