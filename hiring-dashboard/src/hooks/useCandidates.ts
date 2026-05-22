import { useCallback, useEffect, useState } from 'react'
import { candidateService } from '@/services'
import type { Candidate, CandidateFilters, PaginatedResponse } from '@/types'
import { useDebounce } from './useDebounce'

export function useCandidates(filters?: CandidateFilters) {
  const [data, setData] = useState<PaginatedResponse<Candidate> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearch = useDebounce(filters?.search ?? '', 300)

  const fetchCandidates = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await candidateService.getAll({
        ...filters,
        search: debouncedSearch || undefined,
      })
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load candidates')
    } finally {
      setIsLoading(false)
    }
  }, [filters?.pipelineStage, filters?.jobId, debouncedSearch])

  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])

  return { data, isLoading, error, refetch: fetchCandidates }
}
