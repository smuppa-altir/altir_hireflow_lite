import { PIPELINE_STAGE_LABELS } from '@/constants'
import { CANDIDATES_MOCK_DATA } from '@/components/candidates/candidatesMockData'
import type { Candidate } from '@/types'
import type { PipelineStage } from '@/types/kanban'
import type { CandidateDetail, TimelineEvent } from '@/types/candidateDetail'

const LINKEDIN_SLUGS: Record<string, string> = {
  'cand-1': 'mayachen',
  'cand-2': 'davidokonkwo',
  'cand-3': 'priyasharma',
  'cand-4': 'jameswilson',
  'cand-5': 'elenavasquez',
}

const STAGE_ORDER: PipelineStage[] = [
  'applied',
  'screening',
  'technical_interview',
  'manager_round',
  'hr_round',
  'offer',
  'hired',
  'rejected',
]

function stageIndex(stage: PipelineStage): number {
  return STAGE_ORDER.indexOf(stage)
}

function buildTimeline(candidate: Candidate): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: `${candidate.id}-tl-1`,
      type: 'application',
      title: 'Application submitted',
      description: `Applied for ${candidate.jobTitle}`,
      actor: 'System',
      timestamp: candidate.appliedAt,
    },
    {
      id: `${candidate.id}-tl-2`,
      type: 'stage_change',
      title: `Moved to ${PIPELINE_STAGE_LABELS.applied}`,
      description: 'Candidate entered the pipeline',
      actor: 'System',
      timestamp: candidate.appliedAt,
    },
  ]

  const currentIdx = stageIndex(candidate.pipelineStage)

  if (currentIdx > stageIndex('applied')) {
    events.push({
      id: `${candidate.id}-tl-3`,
      type: 'stage_change',
      title: `Moved to ${PIPELINE_STAGE_LABELS.screening}`,
      actor: 'Jordan Lee',
      timestamp: '2026-05-05T10:00:00Z',
    })
  }

  if (currentIdx >= stageIndex('technical_interview')) {
    events.push({
      id: `${candidate.id}-tl-4`,
      type: 'interview',
      title: 'Technical interview scheduled',
      description: '60 min video call with engineering team',
      actor: 'Jordan Lee',
      timestamp: '2026-05-12T09:00:00Z',
    })
    events.push({
      id: `${candidate.id}-tl-5`,
      type: 'feedback',
      title: 'Interview feedback submitted',
      description: 'Technical round — positive recommendation',
      actor: 'Sam Patel',
      timestamp: '2026-05-16T14:30:00Z',
    })
    events.push({
      id: `${candidate.id}-tl-6`,
      type: 'stage_change',
      title: `Moved to ${PIPELINE_STAGE_LABELS.technical_interview}`,
      actor: 'Jordan Lee',
      timestamp: '2026-05-14T11:00:00Z',
    })
  }

  if (currentIdx >= stageIndex('offer')) {
    events.push({
      id: `${candidate.id}-tl-7`,
      type: 'offer',
      title: 'Offer extended',
      description: 'Formal offer letter sent',
      actor: 'Alex Morgan',
      timestamp: '2026-05-19T10:00:00Z',
    })
    events.push({
      id: `${candidate.id}-tl-8`,
      type: 'stage_change',
      title: `Moved to ${PIPELINE_STAGE_LABELS.offer}`,
      actor: 'Alex Morgan',
      timestamp: '2026-05-18T16:00:00Z',
    })
  }

  if (candidate.pipelineStage === 'hired') {
    events.push({
      id: `${candidate.id}-tl-9`,
      type: 'stage_change',
      title: `Marked as ${PIPELINE_STAGE_LABELS.hired}`,
      description: 'Offer accepted — start date confirmed',
      actor: 'Alex Morgan',
      timestamp: candidate.updatedAt,
    })
  }

  if (candidate.pipelineStage === 'rejected') {
    events.push({
      id: `${candidate.id}-tl-r`,
      type: 'stage_change',
      title: `Moved to ${PIPELINE_STAGE_LABELS.rejected}`,
      description: 'Did not meet requirements for senior role',
      actor: 'Jordan Lee',
      timestamp: candidate.updatedAt,
    })
  }

  events.push({
    id: `${candidate.id}-tl-last`,
    type: 'note',
    title: 'Profile updated',
    actor: 'System',
    timestamp: candidate.updatedAt,
  })

  return events.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )
}

/** Build detail view (tabs data) from a list/API candidate record */
export function enrichCandidateDetail(candidate: Candidate): CandidateDetail {
  const slug = LINKEDIN_SLUGS[candidate.id]
  const skillHint =
    candidate.skills.length > 0
      ? candidate.skills.slice(0, 2).join(' and ')
      : candidate.jobTitle

  const experienceSummary =
    candidate.experienceSummary ??
    (candidate.experienceYears
      ? `${candidate.experienceYears}+ years of professional experience in ${skillHint}. Previously led projects at high-growth startups with a focus on shipping quality products.`
      : 'Professional background available upon request.')

  const notes =
    candidate.notes ??
    `${candidate.firstName} is a strong candidate for ${candidate.jobTitle}. ${
      candidate.rating ? `Overall rating: ${candidate.rating}/5. ` : ''
    }Follow up scheduled with the hiring team.`

  return {
    ...candidate,
    linkedinUrl:
      candidate.linkedinUrl ?? (slug ? `https://linkedin.com/in/${slug}` : undefined),
    resumeUrl: candidate.resumeUrl,
    experienceSummary,
    notes,
    feedback: candidate.feedback ?? [],
    timeline: buildTimeline(candidate),
  }
}

const detailCache = new Map<string, CandidateDetail>()

export function getCandidateDetail(id: string): CandidateDetail | null {
  if (detailCache.has(id)) return detailCache.get(id)!

  const base = CANDIDATES_MOCK_DATA.find((c) => c.id === id)
  if (!base) return null

  const detail = enrichCandidateDetail(base)
  detailCache.set(id, detail)
  return detail
}

export function getAllCandidateDetails(): CandidateDetail[] {
  return CANDIDATES_MOCK_DATA.map((c) => getCandidateDetail(c.id)!)
}
