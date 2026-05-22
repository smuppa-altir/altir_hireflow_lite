import {
  Bar,
  CartesianGrid,
  Legend,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DashboardCard, DashboardCardHeader } from '@/components/dashboard/DashboardCard'
import { useChartTheme } from '@/hooks'
import { OFFERS_VS_HIRES_DATA } from './analyticsData'

export function OffersVsHiresChart() {
  const chart = useChartTheme()

  return (
    <DashboardCard className="h-full min-h-[340px]">
      <DashboardCardHeader
        title="Offers vs Hires"
        description="Monthly offer volume compared to accepted hires"
      />
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={OFFERS_VS_HIRES_DATA}
            margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
          >
            <CartesianGrid {...chart.grid} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: chart.axis.tick.fill, fontSize: 11 }}
              axisLine={chart.axis.axisLine}
              tickLine={false}
            />
            <YAxis tick={chart.axis.tick} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={chart.tooltip} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value) => (
                <span className="text-zinc-600 dark:text-zinc-400">{value}</span>
              )}
            />
            <Bar
              dataKey="offers"
              name="Offers Extended"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
              barSize={28}
            />
            <Bar
              dataKey="hires"
              name="Hires"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              barSize={28}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}
