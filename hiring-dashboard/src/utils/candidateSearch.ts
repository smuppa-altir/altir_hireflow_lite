import type { Candidate } from '@/types'

/** Client-side candidate search (name, email, phone, job title) */
export function matchesCandidateSearch(candidate: Candidate, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  const fullName = `${candidate.firstName} ${candidate.lastName}`.trim().toLowerCase()
  const phone = candidate.phone?.toLowerCase() ?? ''

  return (
    fullName.includes(q) ||
    candidate.firstName.toLowerCase().includes(q) ||
    candidate.lastName.toLowerCase().includes(q) ||
    candidate.email.toLowerCase().includes(q) ||
    phone.includes(q) ||
    candidate.jobTitle.toLowerCase().includes(q)
  )
}
