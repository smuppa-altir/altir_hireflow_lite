export const JOB_EXPERIENCE_OPTIONS = [
  { value: '0-1 years', label: '0-1 years (Entry level)' },
  { value: '1-2 years', label: '1-2 years' },
  { value: '2-4 years', label: '2-4 years' },
  { value: '3-5 years', label: '3-5 years' },
  { value: '4+ years', label: '4+ years' },
  { value: '5+ years', label: '5+ years' },
  { value: '6+ years', label: '6+ years' },
  { value: '8+ years', label: '8+ years' },
  { value: '10+ years', label: '10+ years' },
  { value: '12+ years', label: '12+ years' },
  { value: '15+ years', label: '15+ years' },
  { value: '18+ years', label: '18+ years' },
  { value: '20+ years', label: '20+ years' },
] as const

export type JobExperienceLevel = (typeof JOB_EXPERIENCE_OPTIONS)[number]['value']

export const JOB_EXPERIENCE_VALUES = JOB_EXPERIENCE_OPTIONS.map((o) => o.value) as [
  JobExperienceLevel,
  ...JobExperienceLevel[],
]

const LEGACY_EXPERIENCE_MAP: Record<string, JobExperienceLevel> = {
  '3+ years': '3-5 years',
  '3–5 years': '3-5 years',
  '2–4 years': '2-4 years',
  '1–2 years': '1-2 years',
}

/** Maps API/mock free-text values to a dropdown option when editing */
export function normalizeJobExperience(value: string): JobExperienceLevel {
  if ((JOB_EXPERIENCE_VALUES as readonly string[]).includes(value)) {
    return value as JobExperienceLevel
  }
  return LEGACY_EXPERIENCE_MAP[value] ?? '3-5 years'
}
