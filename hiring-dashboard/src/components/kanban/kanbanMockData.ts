import type { KanbanCandidate, KanbanStage } from '@/types/kanban'

/** Initial board seeded from pipeline mock candidates */
export const KANBAN_MOCK_CANDIDATES: KanbanCandidate[] = [
  {
    id: 'cand-4',
    firstName: 'James',
    lastName: 'Wilson',
    jobTitle: 'Product Designer',
    experienceYears: 3,
    appliedAt: '2026-05-19T16:00:00Z',
    stage: 'applied',
  },
  {
    id: 'cand-7',
    firstName: 'Sofia',
    lastName: 'Martinez',
    jobTitle: 'Data Analyst',
    experienceYears: 2,
    appliedAt: '2026-05-20T14:00:00Z',
    stage: 'applied',
  },
  {
    id: 'cand-12',
    firstName: 'Tom',
    lastName: 'Bradley',
    jobTitle: 'QA Engineer',
    experienceYears: 0,
    appliedAt: '2026-05-21T08:00:00Z',
    stage: 'applied',
  },
  {
    id: 'cand-2',
    firstName: 'David',
    lastName: 'Okonkwo',
    jobTitle: 'Senior Frontend Engineer',
    experienceYears: 5,
    appliedAt: '2026-05-02T08:00:00Z',
    stage: 'screening',
  },
  {
    id: 'cand-6',
    firstName: 'Alex',
    lastName: 'Kim',
    jobTitle: 'Backend Engineer',
    experienceYears: 4,
    appliedAt: '2026-05-10T11:00:00Z',
    stage: 'screening',
  },
  {
    id: 'cand-11',
    firstName: 'Lily',
    lastName: 'Nguyen',
    jobTitle: 'Product Designer',
    experienceYears: 4,
    appliedAt: '2026-05-12T13:00:00Z',
    stage: 'screening',
  },
  {
    id: 'cand-1',
    firstName: 'Maya',
    lastName: 'Chen',
    jobTitle: 'Senior Frontend Engineer',
    experienceYears: 7,
    appliedAt: '2026-04-28T12:00:00Z',
    stage: 'technical_interview',
  },
  {
    id: 'cand-8',
    firstName: 'Ryan',
    lastName: 'Foster',
    jobTitle: 'QA Engineer',
    experienceYears: 5,
    appliedAt: '2026-05-08T10:00:00Z',
    stage: 'technical_interview',
  },
  {
    id: 'cand-10',
    firstName: 'Marcus',
    lastName: 'Johnson',
    jobTitle: 'Backend Engineer',
    experienceYears: 9,
    appliedAt: '2026-03-15T08:00:00Z',
    stage: 'manager_round',
  },
  {
    id: 'cand-3',
    firstName: 'Priya',
    lastName: 'Sharma',
    jobTitle: 'Product Designer',
    experienceYears: 6,
    appliedAt: '2026-04-10T10:00:00Z',
    stage: 'hr_round',
  },
  {
    id: 'cand-offer-1',
    firstName: 'Marcus',
    lastName: 'Reed',
    jobTitle: 'Product Designer',
    experienceYears: 6,
    appliedAt: '2026-04-22T10:00:00Z',
    stage: 'offer',
  },
  {
    id: 'cand-5',
    firstName: 'Elena',
    lastName: 'Vasquez',
    jobTitle: 'DevOps Engineer',
    experienceYears: 8,
    appliedAt: '2026-02-20T09:00:00Z',
    stage: 'hired',
  },
  {
    id: 'cand-9',
    firstName: 'Nina',
    lastName: 'Patel',
    jobTitle: 'Senior Frontend Engineer',
    experienceYears: 1,
    appliedAt: '2026-04-01T09:00:00Z',
    stage: 'rejected',
  },
]

export function groupCandidatesByStage(
  candidates: KanbanCandidate[],
): Record<KanbanStage, KanbanCandidate[]> {
  const grouped = {} as Record<KanbanStage, KanbanCandidate[]>
  for (const col of [
    'applied',
    'screening',
    'technical_interview',
    'manager_round',
    'hr_round',
    'offer',
    'hired',
    'rejected',
  ] as KanbanStage[]) {
    grouped[col] = []
  }
  for (const c of candidates) {
    grouped[c.stage].push(c)
  }
  return grouped
}
