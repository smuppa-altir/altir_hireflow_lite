import { useCallback, useEffect, useRef, useState } from 'react'

interface UseAsyncState<T> {
  data: T | null
  error: string | null
  isLoading: boolean
}

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: unknown[] = [],
  immediate = true,
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
  })
  const mountedRef = useRef(true)

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const data = await asyncFn()
      if (mountedRef.current) {
        setState({ data, error: null, isLoading: false })
      }
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      if (mountedRef.current) {
        setState({ data: null, error: message, isLoading: false })
      }
      throw err
    }
  }, [asyncFn])

  useEffect(() => {
    mountedRef.current = true
    if (immediate) {
      execute().catch(() => undefined)
    }
    return () => {
      mountedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { ...state, refetch: execute }
}
