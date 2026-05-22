import { PIPELINE_STAGE_ORDER } from '@/constants'
import { experienceSortIndex } from '@/constants/candidateExperience'
import type { Candidate } from '@/types'

export type CandidateSortKey =
  | 'name'
  | 'email'
  | 'appliedAt'
  | 'jobTitle'
  | 'pipelineStage'
  | 'experienceYears'
  | 'rating'

export type SortDirection = 'asc' | 'desc'

function compareStrings(a: string, b: string, dir: SortDirection): number {
  const cmp = a.localeCompare(b, undefined, { sensitivity: 'base' })
  return dir === 'asc' ? cmp : -cmp
}

function compareNumbers(
  a: number | undefined,
  b: number | undefined,
  dir: SortDirection,
  emptyLast = true,
): number {
  const aMissing = a == null
  const bMissing = b == null
  if (aMissing && bMissing) return 0
  if (aMissing) return emptyLast ? 1 : -1
  if (bMissing) return emptyLast ? -1 : 1
  const cmp = a - b
  return dir === 'asc' ? cmp : -cmp
}

export function sortCandidates(
  candidates: Candidate[],
  sortKey: CandidateSortKey,
  sortDir: SortDirection,
): Candidate[] {
  const sorted = [...candidates]
  sorted.sort((a, b) => {
    switch (sortKey) {
      case 'name': {
        const aName = `${a.firstName} ${a.lastName}`.trim()
        const bName = `${b.firstName} ${b.lastName}`.trim()
        return compareStrings(aName, bName, sortDir)
      }
      case 'email':
        return compareStrings(a.email, b.email, sortDir)
      case 'appliedAt': {
        const cmp =
          new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime()
        return sortDir === 'asc' ? cmp : -cmp
      }
      case 'jobTitle':
        return compareStrings(a.jobTitle, b.jobTitle, sortDir)
      case 'pipelineStage': {
        const aIdx = PIPELINE_STAGE_ORDER.indexOf(a.pipelineStage)
        const bIdx = PIPELINE_STAGE_ORDER.indexOf(b.pipelineStage)
        const cmp = aIdx - bIdx
        return sortDir === 'asc' ? cmp : -cmp
      }
      case 'experienceYears': {
        const cmp =
          experienceSortIndex(a.experienceYears) -
          experienceSortIndex(b.experienceYears)
        if (cmp !== 0) return sortDir === 'asc' ? cmp : -cmp
        return compareNumbers(a.experienceYears, b.experienceYears, sortDir)
      }
      case 'rating':
        return compareNumbers(a.rating, b.rating, sortDir)
      default:
        return 0
    }
  })
  return sorted
}

export function getSortAriaLabel(
  key: CandidateSortKey,
  sortKey: CandidateSortKey,
  sortDir: SortDirection,
): string {
  const labels: Record<CandidateSortKey, string> = {
    name: 'Name',
    email: 'Email',
    appliedAt: 'Applied date',
    jobTitle: 'Job',
    pipelineStage: 'Current stage',
    experienceYears: 'Experience',
    rating: 'Rating',
  }
  if (sortKey !== key) return `Sort by ${labels[key]}`
  return `Sorted by ${labels[key]}, ${sortDir === 'asc' ? 'ascending' : 'descending'}. Click to reverse`
}
