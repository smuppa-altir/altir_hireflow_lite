import type { Theme } from '@/utils/theme'

export function getChartTheme(theme: Theme) {
  const isDark = theme === 'dark'
  return {
    tooltip: {
      backgroundColor: isDark ? '#18181b' : '#ffffff',
      border: `1px solid ${isDark ? '#3f3f46' : '#e4e4e7'}`,
      borderRadius: '8px',
      fontSize: '12px',
      color: isDark ? '#fafafa' : '#18181b',
    },
    axis: {
      tick: { fill: isDark ? '#71717a' : '#71717a', fontSize: 11 },
      axisLine: { stroke: isDark ? '#3f3f46' : '#d4d4d8' },
    },
    grid: {
      stroke: isDark ? '#27272a' : '#e4e4e7',
      strokeDasharray: '3 3',
    },
  }
}

/** @deprecated Use getChartTheme(useTheme().theme) */
export const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#18181b',
  border: '1px solid #3f3f46',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#fafafa',
}

export const CHART_AXIS = {
  tick: { fill: '#71717a', fontSize: 11 },
  axisLine: { stroke: '#3f3f46' },
}

export const CHART_GRID = { stroke: '#27272a', strokeDasharray: '3 3' }
