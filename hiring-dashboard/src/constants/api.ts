export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  CANDIDATES: {
    BASE: '/candidates',
    BY_ID: (id: string) => `/candidates/${id}`,
    STAGE: (id: string) => `/candidates/${id}/stage`,
  },
  JOBS: {
    BASE: '/jobs',
    BY_ID: (id: string) => `/jobs/${id}`,
  },
  INTERVIEWS: {
    BASE: '/interviews',
    BY_ID: (id: string) => `/interviews/${id}`,
    RESCHEDULE: (id: string) => `/interviews/${id}/reschedule`,
    CANCEL: (id: string) => `/interviews/${id}/cancel`,
    COMPLETE: (id: string) => `/interviews/${id}/complete`,
  },
  USERS: {
    STAFF: '/users/staff',
    CREATE_STAFF: '/users/staff',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    FUNNEL: '/dashboard/funnel',
  },
  FEEDBACK: {
    BASE: '/feedback',
    BY_CANDIDATE: (candidateId: string) => `/feedback/${candidateId}`,
    BY_ID: (id: string) => `/feedback/${id}`,
  },
  ACTIVITY: {
    BASE: '/activity',
    BY_CANDIDATE: (candidateId: string) => `/activity/${candidateId}`,
  },
} as const

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'hireflow_access_token',
  REFRESH_TOKEN: 'hireflow_refresh_token',
  THEME: 'hireflow_theme',
} as const
