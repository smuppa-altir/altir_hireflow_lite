import { Clock, Percent, Target, UserCheck } from 'lucide-react'
import { PageHeader } from '@/components/common'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { ANALYTICS_KPI_TRENDS, ANALYTICS_KPIS } from './analyticsData'
import { ConversionRateChart } from './ConversionRateChart'
import { HiringByDepartmentChart } from './HiringByDepartmentChart'
import { HiringFunnelAnalyticsChart } from './HiringFunnelAnalyticsChart'
import { OffersVsHiresChart } from './OffersVsHiresChart'

export function RecruitmentAnalytics() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Recruitment Analytics"
        description="Executive insights into hiring performance and pipeline health"
      />

      {/* Executive KPIs */}
      <section aria-label="Executive metrics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Overall Conversion"
            value={ANALYTICS_KPIS.conversionRate}
            trend={ANALYTICS_KPI_TRENDS.conversionRate.value}
            trendType={ANALYTICS_KPI_TRENDS.conversionRate.type}
            icon={Percent}
            accent="from-indigo-500/20 to-violet-500/10 text-indigo-400"
          />
          <KpiCard
            label="Avg. Time to Hire"
            value={`${ANALYTICS_KPIS.timeToHire} days`}
            trend={ANALYTICS_KPI_TRENDS.timeToHire.value}
            trendType={ANALYTICS_KPI_TRENDS.timeToHire.type}
            icon={Clock}
            accent="from-cyan-500/20 to-blue-500/10 text-cyan-400"
          />
          <KpiCard
            label="Offer Acceptance"
            value={ANALYTICS_KPIS.offerAcceptance}
            trend={ANALYTICS_KPI_TRENDS.offerAcceptance.value}
            trendType={ANALYTICS_KPI_TRENDS.offerAcceptance.type}
            icon={Target}
            accent="from-amber-500/20 to-orange-500/10 text-amber-400"
          />
          <KpiCard
            label="Hires (YTD)"
            value={ANALYTICS_KPIS.hiresYtd}
            trend={ANALYTICS_KPI_TRENDS.hiresYtd.value}
            trendType={ANALYTICS_KPI_TRENDS.hiresYtd.type}
            icon={UserCheck}
            accent="from-emerald-500/20 to-green-500/10 text-emerald-400"
          />
        </div>
      </section>

      {/* Primary charts — funnel + conversion */}
      <section
        aria-label="Pipeline analytics"
        className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-6"
      >
        <HiringFunnelAnalyticsChart />
        <ConversionRateChart />
      </section>

      {/* Secondary charts — offers vs hires + department */}
      <section
        aria-label="Hiring outcomes"
        className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-6"
      >
        <OffersVsHiresChart />
        <HiringByDepartmentChart />
      </section>
    </div>
  )
}
