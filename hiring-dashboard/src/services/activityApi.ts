import { API_ENDPOINTS } from '@/constants'
import type { PaginatedResponse, PaginationParams } from '@/types'
import type { ActivityActionType } from '@/types/activityLog'
import type { ApiActivityLog } from '@/utils/activityFormat'
import { mapLogFilterToApiAction } from './activityMappers'
import { apiClient } from './api'

export interface ActivityListParams extends PaginationParams {
  action?: ActivityActionType | ''
  dateFrom?: string
  dateTo?: string
}

export const activityApi = {
  async list(params?: ActivityListParams): Promise<PaginatedResponse<ApiActivityLog>> {
    const apiParams: Record<string, string | number> = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
    }
    if (params?.search?.trim()) apiParams.search = params.search.trim()
    if (params?.action) apiParams.action = mapLogFilterToApiAction(params.action)

    const { data } = await apiClient.get<{ data: PaginatedResponse<ApiActivityLog> }>(
      API_ENDPOINTS.ACTIVITY.BASE,
      { params: apiParams },
    )
    return data.data
  },

  async getRecent(limit = 6): Promise<ApiActivityLog[]> {
    const result = await this.list({ page: 1, pageSize: limit })
    return result.data
  },
}
