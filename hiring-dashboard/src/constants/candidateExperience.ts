/** Experience buckets shared by filter, add/edit form, and list display */
export type CandidateExperienceLevel =
  | ''
  | '0-2'
  | '3-5'
  | '6-8'
  | '9-12'
  | '13-20'
  | '20+'

export type ExperienceFilter = CandidateExperienceLevel

const LEVEL_LABELS: Record<Exclude<CandidateExperienceLevel, ''>, string> = {
  '0-2': '0–2 years',
  '3-5': '3–5 years',
  '6-8': '6–8 years',
  '9-12': '9–12 years',
  '13-20': '13–20 years',
  '20+': '20+ years',
}

/** Midpoint years used for filtering, sorting, and API storage */
const LEVEL_TO_YEARS: Record<Exclude<CandidateExperienceLevel, ''>, number> = {
  '0-2': 1,
  '3-5': 4,
  '6-8': 7,
  '9-12': 10,
  '13-20': 16,
  '20+': 20,
}

const ORDER: Exclude<CandidateExperienceLevel, ''>[] = [
  '0-2',
  '3-5',
  '6-8',
  '9-12',
  '13-20',
  '20+',
]

export const CANDIDATE_EXPERIENCE_FORM_OPTIONS: Array<{
  value: CandidateExperienceLevel
  label: string
}> = [
  { value: '', label: 'Not specified' },
  ...ORDER.map((value) => ({ value, label: LEVEL_LABELS[value] })),
]

export const CANDIDATE_EXPERIENCE_FILTER_OPTIONS: Array<{
  value: ExperienceFilter
  label: string
}> = [
  { value: '', label: 'All experience' },
  ...ORDER.map((value) => ({ value, label: LEVEL_LABELS[value] })),
]

export function experienceLevelToYears(
  level: CandidateExperienceLevel,
): number | undefined {
  if (!level) return undefined
  return LEVEL_TO_YEARS[level]
}

export function yearsToExperienceLevel(years?: number): CandidateExperienceLevel {
  if (years == null || Number.isNaN(years)) return ''
  if (years <= 2) return '0-2'
  if (years <= 5) return '3-5'
  if (years <= 8) return '6-8'
  if (years <= 12) return '9-12'
  if (years <= 20) return '13-20'
  return '20+'
}

export function formatCandidateExperience(years?: number): string {
  const level = yearsToExperienceLevel(years)
  if (!level) return '—'
  return LEVEL_LABELS[level]
}

export function matchesExperienceFilter(
  years: number | undefined,
  filter: ExperienceFilter,
): boolean {
  if (!filter) return true
  const level = yearsToExperienceLevel(years)
  return level === filter
}

export function experienceSortIndex(years?: number): number {
  const level = yearsToExperienceLevel(years)
  if (!level) return -1
  return ORDER.indexOf(level)
}
