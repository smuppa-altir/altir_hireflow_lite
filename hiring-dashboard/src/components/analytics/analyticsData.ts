export const ANALYTICS_KPIS = {
  conversionRate: '13.7%',
  timeToHire: 28,
  offerAcceptance: '76%',
  hiresYtd: 34,
} as const

export const ANALYTICS_KPI_TRENDS = {
  conversionRate: { value: '+2.1% vs last quarter', type: 'positive' as const },
  timeToHire: { value: '-3 days vs avg', type: 'positive' as const },
  offerAcceptance: { value: '+8% vs last month', type: 'positive' as const },
  hiresYtd: { value: 'On track for annual goal', type: 'neutral' as const },
}

export const ANALYTICS_FUNNEL_DATA = [
  { stage: 'Applied', count: 248, fill: '#6366f1' },
  { stage: 'Screening', count: 142, fill: '#8b5cf6' },
  { stage: 'Technical', count: 68, fill: '#a78bfa' },
  { stage: 'Manager', count: 42, fill: '#818cf8' },
  { stage: 'HR Round', count: 28, fill: '#22d3ee' },
  { stage: 'Offer', count: 24, fill: '#f59e0b' },
  { stage: 'Hired', count: 34, fill: '#22c55e' },
]

export const CONVERSION_RATE_DATA = [
  { stage: 'Applied', rate: 100, candidates: 248 },
  { stage: 'Screening', rate: 57.3, candidates: 142 },
  { stage: 'Technical', rate: 27.4, candidates: 68 },
  { stage: 'Manager', rate: 16.9, candidates: 42 },
  { stage: 'HR Round', rate: 11.3, candidates: 28 },
  { stage: 'Offer', rate: 9.7, candidates: 24 },
  { stage: 'Hired', rate: 13.7, candidates: 34 },
]

export const OFFERS_VS_HIRES_DATA = [
  { month: 'Jan', offers: 6, hires: 4 },
  { month: 'Feb', offers: 8, hires: 5 },
  { month: 'Mar', offers: 7, hires: 6 },
  { month: 'Apr', offers: 9, hires: 7 },
  { month: 'May', offers: 11, hires: 8 },
  { month: 'Jun', offers: 8, hires: 4 },
]

export const HIRING_BY_DEPARTMENT_DATA = [
  { department: 'Engineering', hires: 14, candidates: 98, fill: '#6366f1' },
  { department: 'Design', hires: 8, candidates: 52, fill: '#8b5cf6' },
  { department: 'Product', hires: 5, candidates: 34, fill: '#a78bfa' },
  { department: 'Sales', hires: 4, candidates: 28, fill: '#22d3ee' },
  { department: 'Marketing', hires: 2, candidates: 18, fill: '#f59e0b' },
  { department: 'Operations', hires: 1, candidates: 18, fill: '#22c55e' },
]
