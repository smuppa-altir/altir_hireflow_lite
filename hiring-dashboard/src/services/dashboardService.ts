import { API_ENDPOINTS } from '@/constants'
import { MOCK_DASHBOARD_STATS } from './mockData'
import { apiClient } from './api'

export interface DashboardStats {
  openJobs: number
  totalCandidates: number
  offers: number
  hired: number
}

export interface FunnelStageItem {
  stage: string
  count: number
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

/** API stats shape from GET /dashboard/stats */
interface ApiDashboardStats {
  openJobs: number
  totalCandidates: number
  offers: number
  hired: number
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    if (USE_MOCK) {
      await delay(400)
      const m = MOCK_DASHBOARD_STATS
      return {
        openJobs: m.openJobs,
        totalCandidates: m.totalCandidates,
        offers: m.offersPending,
        hired: m.hiredThisMonth,
      }
    }
    const { data } = await apiClient.get<{ data: ApiDashboardStats }>(
      API_ENDPOINTS.DASHBOARD.STATS,
    )
    return data.data
  },

  async getFunnel(): Promise<FunnelStageItem[]> {
    if (USE_MOCK) {
      await delay(300)
      return [
        { stage: 'applied', count: 48 },
        { stage: 'screening', count: 32 },
        { stage: 'offer', count: 8 },
        { stage: 'hired', count: 5 },
      ]
    }
    const { data } = await apiClient.get<{ data: FunnelStageItem[] }>(
      API_ENDPOINTS.DASHBOARD.FUNNEL,
    )
    return data.data
  },
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
