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
import { DashboardCard, DashboardCardHeader } from '@/components/dashboard/DashboardCard'
import { useChartTheme } from '@/hooks'
import { ANALYTICS_FUNNEL_DATA } from './analyticsData'

export function HiringFunnelAnalyticsChart() {
  const chart = useChartTheme()

  return (
    <DashboardCard className="h-full min-h-[340px]">
      <DashboardCardHeader
        title="Hiring Funnel"
        description="End-to-end candidate volume by pipeline stage"
      />
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ANALYTICS_FUNNEL_DATA}
            layout="vertical"
            margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
          >
            <CartesianGrid {...chart.grid} horizontal={false} />
            <XAxis
              type="number"
              tick={chart.axis.tick}
              axisLine={chart.axis.axisLine}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="stage"
              width={80}
              tick={{ fill: chart.axis.tick.fill, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={chart.tooltip}
              cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
              formatter={(value) => [`${value ?? 0} candidates`, 'Count']}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
              {ANALYTICS_FUNNEL_DATA.map((entry) => (
                <Cell key={entry.stage} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}
