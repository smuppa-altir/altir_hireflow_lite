import { useCallback, useEffect, useState } from 'react'
import { jobService } from '@/services'
import type { Job, JobFilters, PaginatedResponse } from '@/types'
import { useDebounce } from './useDebounce'

export function useJobs(filters?: JobFilters) {
  const [data, setData] = useState<PaginatedResponse<Job> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearch = useDebounce(filters?.search ?? '', 300)

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await jobService.getAll({
        ...filters,
        search: debouncedSearch || undefined,
      })
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }, [filters?.status, filters?.department, debouncedSearch])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  return { data, isLoading, error, refetch: fetchJobs }
}
