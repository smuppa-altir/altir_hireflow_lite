import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useCallback, useEffect, useState } from 'react'
import { useChartTheme } from '@/hooks'
import { DashboardCard, DashboardCardHeader } from './DashboardCard'
import { CANDIDATE_STAGE_DATA } from './dashboardData'
import { Spinner } from '@/components/ui'
import { dashboardService } from '@/services'
import { funnelToPieData } from '@/utils/dashboardFunnel'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export function CandidateStagePieChart() {
  const chart = useChartTheme()
  const [data, setData] = useState(CANDIDATE_STAGE_DATA)
  const [loading, setLoading] = useState(!USE_MOCK)

  const loadFunnel = useCallback(() => {
    if (USE_MOCK) return
    setLoading(true)
    dashboardService
      .getFunnel()
      .then((rows) => {
        const pie = funnelToPieData(rows)
        setData(pie.length > 0 ? pie : CANDIDATE_STAGE_DATA)
      })
      .catch(() => setData(CANDIDATE_STAGE_DATA))
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

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <DashboardCard className="h-full min-h-[320px]">
      <DashboardCardHeader
        title="Candidates by Stage"
        description={`${total} total in pipeline`}
      />
      {loading ? (
        <div className="flex h-[260px] items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="h-[260px] w-full sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={chart.tooltip}
                formatter={(value, name) => {
                  const n = Number(value ?? 0)
                  const pct = total > 0 ? Math.round((n / total) * 100) : 0
                  return [`${n} (${pct}%)`, String(name)]
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{value}</span>
                )}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardCard>
  )
}
