import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DashboardCard, DashboardCardHeader } from '@/components/dashboard/DashboardCard'
import { useChartTheme } from '@/hooks'
import { CONVERSION_RATE_DATA } from './analyticsData'

export function ConversionRateChart() {
  const chart = useChartTheme()

  return (
    <DashboardCard className="h-full min-h-[340px]">
      <DashboardCardHeader
        title="Conversion Rate"
        description="Stage-to-stage retention from applied baseline"
      />
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={CONVERSION_RATE_DATA}
            margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
          >
            <CartesianGrid {...chart.grid} vertical={false} />
            <XAxis
              dataKey="stage"
              tick={{ fill: chart.axis.tick.fill, fontSize: 10 }}
              axisLine={chart.axis.axisLine}
              tickLine={false}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={56}
            />
            <YAxis
              tick={chart.axis.tick}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={chart.tooltip}
              formatter={(value, _name, props) => {
                const payload = props.payload as { candidates?: number }
                return [
                  `${value ?? 0}% (${payload?.candidates ?? 0} candidates)`,
                  'Conversion',
                ]
              }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#818cf8"
              strokeWidth={2.5}
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#a5b4fc', stroke: '#6366f1', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}
