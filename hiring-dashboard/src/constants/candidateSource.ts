/** Application source — optional on create/import */
export type CandidateSource =
  | ''
  | 'referral'
  | 'linkedin'
  | 'naukri'
  | 'indeed'
  | 'company_website'
  | 'job_board'
  | 'agency'
  | 'other'

const SOURCE_LABELS: Record<Exclude<CandidateSource, ''>, string> = {
  referral: 'Referral',
  linkedin: 'LinkedIn',
  naukri: 'Naukri',
  indeed: 'Indeed',
  company_website: 'Company website',
  job_board: 'Job board',
  agency: 'Agency',
  other: 'Other',
}

const SOURCE_ORDER: Exclude<CandidateSource, ''>[] = [
  'referral',
  'linkedin',
  'naukri',
  'indeed',
  'company_website',
  'job_board',
  'agency',
  'other',
]

export const CANDIDATE_SOURCE_FORM_OPTIONS: Array<{
  value: CandidateSource
  label: string
}> = [
  { value: '', label: 'Not specified' },
  ...SOURCE_ORDER.map((value) => ({ value, label: SOURCE_LABELS[value] })),
]

/** Normalize free-text / Excel values to a known source slug */
export function normalizeCandidateSource(raw: string): CandidateSource {
  const key = raw.trim().toLowerCase().replace(/[\s-]+/g, '_')
  if (!key) return ''

  const aliases: Record<string, Exclude<CandidateSource, ''>> = {
    referral: 'referral',
    referal: 'referral',
    referred: 'referral',
    employee_referral: 'referral',
    linkedin: 'linkedin',
    linked_in: 'linkedin',
    naukri: 'naukri',
    naukri_com: 'naukri',
    indeed: 'indeed',
    company_website: 'company_website',
    website: 'company_website',
    careers: 'company_website',
    careers_page: 'company_website',
    company_site: 'company_website',
    job_board: 'job_board',
    jobboard: 'job_board',
    glassdoor: 'job_board',
    monster: 'job_board',
    agency: 'agency',
    recruiter: 'agency',
    staffing: 'agency',
    other: 'other',
    unknown: 'other',
  }

  return aliases[key] ?? ''
}

export function formatCandidateSource(source?: CandidateSource | string): string {
  if (!source) return '—'
  const normalized = normalizeCandidateSource(source) || (source as CandidateSource)
  if (!normalized) return '—'
  return SOURCE_LABELS[normalized as Exclude<CandidateSource, ''>] ?? source
}
