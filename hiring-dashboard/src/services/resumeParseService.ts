import { getApiOrigin } from '@/utils'
import { apiClient } from './api'
import { uploadResume } from './uploadService'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export interface ParsedResumeFields {
  firstName: string
  lastName: string
  email: string
  phone: string
  linkedinUrl: string
  experienceYears?: number
  skills: string[]
}

export interface ResumeParseResult {
  url: string
  path: string
  originalName: string
  parsed: ParsedResumeFields
  warnings: string[]
}

function parseNameFromFilename(filename: string): { firstName: string; lastName: string } {
  const base = filename.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').trim()
  const parts = base.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: '', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

/** Upload a PDF resume and parse candidate fields from its content */
export async function parseResumeFile(file: File): Promise<ResumeParseResult> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500))
    const upload = await uploadResume(file)
    const fromName = parseNameFromFilename(file.name)
    return {
      url: upload.url,
      path: upload.path,
      originalName: upload.originalName,
      parsed: {
        ...fromName,
        email: '',
        phone: '',
        linkedinUrl: '',
        skills: [],
      },
      warnings: [
        'Mock mode: limited parsing from filename only. Connect the API for full PDF extraction.',
        'Email was not detected — enter it before importing.',
      ],
    }
  }

  const formData = new FormData()
  formData.append('resume', file)

  const { data } = await apiClient.post<{ data: ResumeParseResult }>(
    '/upload/resume/parse',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data.data
}

export function buildResumeUrlFromPath(path: string): string {
  if (path.startsWith('http')) return path
  return `${getApiOrigin()}${path}`
}
