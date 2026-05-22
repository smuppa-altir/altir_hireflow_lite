export const DASHBOARD_KPIS = {
  openJobs: 12,
  totalCandidates: 248,
  offers: 8,
  hired: 34,
} as const

export const KPI_TRENDS = {
  openJobs: { value: '+2', type: 'positive' as const },
  totalCandidates: { value: '+18 this week', type: 'positive' as const },
  offers: { value: '3 pending sign-off', type: 'neutral' as const },
  hired: { value: '+12% vs last month', type: 'positive' as const },
}

export const HIRING_FUNNEL_DATA = [
  { stage: 'Applied', count: 248, fill: '#6366f1' },
  { stage: 'Screening', count: 142, fill: '#8b5cf6' },
  { stage: 'Interview', count: 68, fill: '#a78bfa' },
  { stage: 'Offer', count: 24, fill: '#f59e0b' },
  { stage: 'Hired', count: 34, fill: '#22c55e' },
]

export const CANDIDATE_STAGE_DATA = [
  { name: 'New', value: 52, color: '#3b82f6' },
  { name: 'Screening', value: 78, color: '#f59e0b' },
  { name: 'Interview', value: 45, color: '#8b5cf6' },
  { name: 'Offer', value: 18, color: '#10b981' },
  { name: 'Hired', value: 34, color: '#22c55e' },
  { name: 'Rejected', value: 21, color: '#ef4444' },
]

export const UPCOMING_INTERVIEWS = [
  {
    id: '1',
    candidate: 'Maya Chen',
    role: 'Senior Frontend Engineer',
    interviewer: 'Jordan Lee',
    type: 'Technical',
    datetime: '2026-05-22T15:00:00Z',
    duration: 60,
  },
  {
    id: '2',
    candidate: 'David Okonkwo',
    role: 'Senior Frontend Engineer',
    interviewer: 'Jordan Lee',
    type: 'Phone Screen',
    datetime: '2026-05-23T17:00:00Z',
    duration: 30,
  },
  {
    id: '3',
    candidate: 'Priya Sharma',
    role: 'Product Designer',
    interviewer: 'Sam Patel',
    type: 'Panel',
    datetime: '2026-05-24T14:00:00Z',
    duration: 90,
  },
  {
    id: '4',
    candidate: 'James Wilson',
    role: 'Product Designer',
    interviewer: 'Sam Patel',
    type: 'Portfolio Review',
    datetime: '2026-05-25T11:00:00Z',
    duration: 45,
  },
]

export type ActivityType = 'application' | 'interview' | 'offer' | 'hire' | 'status' | 'comment'

export const RECENT_ACTIVITY = [
  {
    id: '1',
    type: 'application' as ActivityType,
    message: 'James Wilson applied for Product Designer',
    actor: 'System',
    timestamp: '2026-05-21T09:15:00Z',
  },
  {
    id: '2',
    type: 'interview' as ActivityType,
    message: 'Technical interview scheduled with Maya Chen',
    actor: 'Jordan Lee',
    timestamp: '2026-05-21T08:42:00Z',
  },
  {
    id: '3',
    type: 'offer' as ActivityType,
    message: 'Offer extended to Priya Sharma',
    actor: 'Sam Patel',
    timestamp: '2026-05-20T16:30:00Z',
  },
  {
    id: '4',
    type: 'hire' as ActivityType,
    message: 'Elena Vasquez marked as hired for DevOps Engineer',
    actor: 'Alex Morgan',
    timestamp: '2026-05-20T11:00:00Z',
  },
  {
    id: '5',
    type: 'status' as ActivityType,
    message: 'David Okonkwo moved to Screening stage',
    actor: 'Jordan Lee',
    timestamp: '2026-05-19T14:22:00Z',
  },
  {
    id: '6',
    type: 'comment' as ActivityType,
    message: 'Added feedback on Priya Sharma panel interview',
    actor: 'Sam Patel',
    timestamp: '2026-05-19T10:05:00Z',
  },
]
