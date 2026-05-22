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
import { HIRING_BY_DEPARTMENT_DATA } from './analyticsData'

export function HiringByDepartmentChart() {
  const chart = useChartTheme()

  return (
    <DashboardCard className="h-full min-h-[340px]">
      <DashboardCardHeader
        title="Hiring by Department"
        description="Hires completed and active candidate pool"
      />
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={HIRING_BY_DEPARTMENT_DATA}
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
              dataKey="department"
              width={100}
              tick={{ fill: chart.axis.tick.fill, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={chart.tooltip}
              cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
              formatter={(value, name) => {
                if (name === 'hires') return [`${value ?? 0} hires`, 'Hired']
                return [`${value ?? 0} in pipeline`, 'Candidates']
              }}
            />
            <Bar dataKey="hires" name="hires" radius={[0, 6, 6, 0]} barSize={16}>
              {HIRING_BY_DEPARTMENT_DATA.map((entry) => (
                <Cell key={entry.department} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}
