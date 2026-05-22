import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useCallback, useEffect, useState } from 'react'
import { DashboardCard, DashboardCardHeader } from './DashboardCard'
import { HIRING_FUNNEL_DATA } from './dashboardData'
import { Spinner } from '@/components/ui'
import { useChartTheme } from '@/hooks'
import { dashboardService } from '@/services'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const STAGE_LABELS: Record<string, string> = {
  applied: 'Applied',
  screening: 'Screening',
  technical: 'Technical',
  manager_round: 'Manager',
  hr_round: 'HR Round',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
}

const STAGE_COLORS: Record<string, string> = {
  applied: '#6366f1',
  screening: '#8b5cf6',
  technical: '#a78bfa',
  manager_round: '#818cf8',
  hr_round: '#22d3ee',
  offer: '#f59e0b',
  hired: '#22c55e',
  rejected: '#ef4444',
}

export function HiringFunnelChart() {
  const chart = useChartTheme()
  const [data, setData] = useState(HIRING_FUNNEL_DATA)
  const [loading, setLoading] = useState(!USE_MOCK)

  const loadFunnel = useCallback(() => {
    if (USE_MOCK) return
    setLoading(true)
    dashboardService
      .getFunnel()
      .then((rows) => {
        const chartData = rows
          .filter((r) => r.stage !== 'rejected')
          .map((r) => ({
            stage: STAGE_LABELS[r.stage] ?? r.stage,
            count: r.count,
            fill: STAGE_COLORS[r.stage] ?? '#6366f1',
          }))
        setData(chartData.length > 0 ? chartData : HIRING_FUNNEL_DATA)
      })
      .catch(() => setData(HIRING_FUNNEL_DATA))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadFunnel()
  }, [loadFunnel])

  useEffect(() => {
    if (USE_MOCK) return
    const onFocus = () => loadFunnel()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [loadFunnel])

  return (
    <DashboardCard className="h-full min-h-[320px]">
      <DashboardCardHeader
        title="Hiring Funnel"
        description="Candidate progression through pipeline stages"
      />
      {loading ? (
        <div className="flex h-[260px] items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="h-[260px] w-full sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
            >
            <CartesianGrid
              strokeDasharray={chart.grid.strokeDasharray}
              stroke={chart.grid.stroke}
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={chart.axis.tick}
              axisLine={chart.axis.axisLine}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="stage"
              width={72}
              tick={{ fill: chart.axis.tick.fill, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={chart.tooltip}
                cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                formatter={(value) => [`${value ?? 0} candidates`, 'Count']}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
                {data.map((entry) => (
                  <Cell key={entry.stage} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardCard>
  )
}
