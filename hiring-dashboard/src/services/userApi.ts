import { API_ENDPOINTS } from '@/constants'
import type { Interviewer } from '@/types/interview'
import { apiClient } from './api'

export interface CreateStaffPayload {
  name: string
  email: string
  role?: 'interviewer' | 'recruiter' | 'hiring_manager'
  password?: string
}

export interface CreateStaffResult extends Interviewer {
  temporaryPassword?: string
}

export const userApi = {
  async getStaff(): Promise<Interviewer[]> {
    const { data } = await apiClient.get<{ data: Interviewer[] }>(API_ENDPOINTS.USERS.STAFF)
    return data.data
  },

  async createStaff(payload: CreateStaffPayload): Promise<CreateStaffResult> {
    const { data } = await apiClient.post<{ data: CreateStaffResult }>(
      API_ENDPOINTS.USERS.STAFF,
      payload,
    )
    return data.data
  },
}
