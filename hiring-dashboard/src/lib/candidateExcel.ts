import * as XLSX from 'xlsx'
import { normalizeCandidateSource, type CandidateSource } from '@/constants/candidateSource'
import { parseSkillsInput, sanitizeSkills } from '@/utils/skills'
import type { PipelineStage } from '@/types'
import { parsePipelineStageLabel } from '@/utils/kanbanStages'
import { PIPELINE_STAGE_OPTIONS } from '@/constants/pipelineStages'

export const PIPELINE_STAGE_IMPORT_HINT = PIPELINE_STAGE_OPTIONS.map((o) => o.label).join(', ')
import type { Job } from '@/types'

/** Column headers for the downloadable template (row 1) */
export const CANDIDATE_EXCEL_HEADERS = [
  'First Name',
  'Last Name',
  'Email',
  'Phone',
  'Job Title',
  'Current Stage',
  'Applied Date',
  'LinkedIn URL',
  'Resume URL',
  'Source',
  'Skills',
] as const

export interface ParsedCandidateImportRow {
  rowNumber: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  jobTitle: string
  jobId?: string
  pipelineStage: PipelineStage
  appliedAt?: string
  linkedinUrl?: string
  resumeUrl?: string
  source?: CandidateSource
  skills: string[]
  errors: string[]
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/[\s-]+/g, '_')
}

const HEADER_MAP: Record<string, keyof Omit<ParsedCandidateImportRow, 'rowNumber' | 'errors' | 'jobId'>> = {
  first_name: 'firstName',
  firstname: 'firstName',
  fname: 'firstName',
  last_name: 'lastName',
  lastname: 'lastName',
  lname: 'lastName',
  email: 'email',
  email_address: 'email',
  phone: 'phone',
  phone_number: 'phone',
  mobile: 'phone',
  job: 'jobTitle',
  job_title: 'jobTitle',
  position: 'jobTitle',
  role: 'jobTitle',
  current_stage: 'pipelineStage',
  stage: 'pipelineStage',
  status: 'pipelineStage',
  pipeline_stage: 'pipelineStage',
  applied_date: 'appliedAt',
  applied: 'appliedAt',
  application_date: 'appliedAt',
  date_applied: 'appliedAt',
  linkedin: 'linkedinUrl',
  linkedin_url: 'linkedinUrl',
  linkedin_profile: 'linkedinUrl',
  resume: 'resumeUrl',
  resume_url: 'resumeUrl',
  resume_link: 'resumeUrl',
  source: 'source',
  application_source: 'source',
  candidate_source: 'source',
  how_did_you_hear: 'source',
  skills: 'skills',
  skill: 'skills',
  skill_set: 'skills',
  skillset: 'skills',
  technical_skills: 'skills',
}

function cellToString(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'number') return String(value)
  return String(value).trim()
}

/** Avoid Excel turning emails into bare numbers (e.g. 1779440379) */
function normalizeEmailCell(value: unknown): string {
  const raw = cellToString(value)
  if (!raw) return ''
  if (/^\d{9,}$/.test(raw)) return ''
  if (/^[\d.]+e[+\-]?\d+$/i.test(raw)) return ''
  return raw
}

function parseExcelDate(value: unknown): string | undefined {
  if (value == null || value === '') return undefined
  if (typeof value === 'number' && value > 0) {
    const utc = Math.round((value - 25569) * 86400 * 1000)
    const d = new Date(utc)
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
  }
  const d = new Date(cellToString(value))
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

function splitFullName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

function resolveJobId(jobTitle: string, jobs: Job[]): string | undefined {
  const trimmed = jobTitle.trim()
  if (!trimmed) return undefined
  const byId = jobs.find((j) => j.id === trimmed)
  if (byId) return byId.id
  const lower = trimmed.toLowerCase()
  const exact = jobs.find((j) => j.title.toLowerCase() === lower)
  if (exact) return exact.id
  const partial = jobs.find(
    (j) =>
      j.title.toLowerCase().includes(lower) || lower.includes(j.title.toLowerCase()),
  )
  return partial?.id
}

function validateRow(
  row: Omit<ParsedCandidateImportRow, 'errors'>,
  jobs: Job[],
): ParsedCandidateImportRow {
  const errors: string[] = []

  if (!row.firstName.trim()) errors.push('First name is required')
  if (!row.lastName.trim()) errors.push('Last name is required')
  if (!row.email.trim()) errors.push('Email is required')
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) errors.push('Invalid email')

  if (!row.jobTitle.trim()) errors.push('Job title is required')
  else if (!resolveJobId(row.jobTitle, jobs)) {
    errors.push(`No matching job for "${row.jobTitle}"`)
  }

  const jobId = row.jobTitle.trim() ? resolveJobId(row.jobTitle, jobs) : undefined

  return {
    ...row,
    jobId,
    errors,
  }
}

export function parseCandidatesExcelFile(file: ArrayBuffer, jobs: Job[]): ParsedCandidateImportRow[] {
  const workbook = XLSX.read(file, { type: 'array', cellDates: false })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) {
    throw new Error('The file has no worksheets')
  }

  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: false,
  })

  if (rows.length === 0) {
    throw new Error('The spreadsheet has no data rows')
  }

  const parsed: ParsedCandidateImportRow[] = []

  rows.forEach((raw, index) => {
    const rowNumber = index + 2
    const draft: Record<string, string> = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      pipelineStage: 'applied',
      appliedAt: '',
      linkedinUrl: '',
      resumeUrl: '',
      source: '',
      skills: '',
    }

    let fullName = ''

    for (const [key, value] of Object.entries(raw)) {
      const norm = normalizeHeader(key)
      const field = HEADER_MAP[norm]
      if (!field) continue

      if (norm === 'full_name' || norm === 'name' || norm === 'candidate_name') {
        fullName = cellToString(value)
        continue
      }

      if (field === 'pipelineStage') {
        draft.pipelineStage = parsePipelineStageLabel(cellToString(value))
      } else if (field === 'appliedAt') {
        draft.appliedAt = parseExcelDate(value) ?? ''
      } else if (field === 'source') {
        draft.source = normalizeCandidateSource(cellToString(value))
      } else if (field === 'skills') {
        draft.skills = cellToString(value)
      } else if (field === 'email') {
        draft.email = normalizeEmailCell(value)
      } else {
        draft[field] = cellToString(value)
      }
    }

    if (fullName) {
      const split = splitFullName(fullName)
      if (!draft.firstName) draft.firstName = split.firstName
      if (!draft.lastName) draft.lastName = split.lastName
    }

    const hasData =
      draft.firstName ||
      draft.lastName ||
      draft.email ||
      draft.jobTitle ||
      fullName
    if (!hasData) return

    const base = {
      rowNumber,
      firstName: draft.firstName,
      lastName: draft.lastName,
      email: draft.email,
      phone: draft.phone || undefined,
      jobTitle: draft.jobTitle,
      pipelineStage: (draft.pipelineStage as PipelineStage) || 'applied',
      appliedAt: draft.appliedAt || undefined,
      linkedinUrl: draft.linkedinUrl || undefined,
      resumeUrl: draft.resumeUrl || undefined,
      source: (draft.source as CandidateSource) || undefined,
      skills: sanitizeSkills(parseSkillsInput(draft.skills)),
    }

    parsed.push(validateRow(base, jobs))
  })

  return parsed
}

export function downloadCandidateImportTemplate(): void {
  const exampleJob = 'Senior Frontend Engineer'
  const stamp = Date.now()
  const ws = XLSX.utils.aoa_to_sheet([
    [...CANDIDATE_EXCEL_HEADERS],
    [
      'Jane',
      'Doe',
      `jane.import.${stamp}@example.com`,
      '+1-555-0100',
      exampleJob,
      'Applied',
      '2026-05-22',
      '',
      '',
      'LinkedIn',
      'React, TypeScript',
    ],
    [
      'John',
      'Smith',
      `john.import.${stamp + 1}@example.com`,
      '',
      exampleJob,
      'Screening',
      '',
      'https://linkedin.com/in/johnsmith',
      '',
      'Referral',
      'Playwright, Jest',
    ],
  ])

  ws['!cols'] = CANDIDATE_EXCEL_HEADERS.map(() => ({ wch: 18 }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Candidates')
  XLSX.writeFile(wb, 'hireflow-candidates-template.xlsx')
}

export function validImportRows(rows: ParsedCandidateImportRow[]): ParsedCandidateImportRow[] {
  return rows.filter((r) => r.errors.length === 0 && r.jobId)
}
