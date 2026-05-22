export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  JOBS: '/jobs',
  JOB_DETAIL: '/jobs/:id',
  CANDIDATES: '/candidates',
  CANDIDATE_DETAIL: '/candidates/:id',
  KANBAN: '/kanban',
  INTERVIEWS: '/interviews',
  FEEDBACK: '/feedback',
  REPORTS: '/reports',
  ACTIVITY_LOG: '/activity-log',
  SETTINGS: '/settings',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
