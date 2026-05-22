import { useMemo } from 'react'
import { getChartTheme } from '@/components/analytics/chartTheme'
import { useTheme } from './useTheme'

export function useChartTheme() {
  const { theme } = useTheme()
  return useMemo(() => getChartTheme(theme), [theme])
}
