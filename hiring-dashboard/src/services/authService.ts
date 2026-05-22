import { API_ENDPOINTS, STORAGE_KEYS } from '@/constants'
import type { AuthTokens, LoginCredentials, User } from '@/types'
import { getStorageItem } from '@/utils'
import { mapApiUser, type ApiAuthPayload } from './apiMappers'
import { MOCK_USER } from './mockData'
import { apiClient } from './api'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    if (USE_MOCK) {
      await delay(600)
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required')
      }
      return {
        user: MOCK_USER,
        tokens: { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' },
      }
    }
    const { data } = await apiClient.post<{ data: ApiAuthPayload }>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    )
    const payload = data.data
    return {
      user: mapApiUser(payload.user),
      tokens: {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      },
    }
  },

  async getCurrentUser(): Promise<User> {
    if (USE_MOCK) {
      await delay(300)
      return MOCK_USER
    }
    const { data } = await apiClient.get<{ data: ApiAuthPayload['user'] }>(API_ENDPOINTS.AUTH.ME)
    return mapApiUser(data.data)
  },

  async logout(): Promise<void> {
    if (USE_MOCK) {
      await delay(200)
      return
    }
    const refreshToken = getStorageItem(STORAGE_KEYS.REFRESH_TOKEN)
    if (refreshToken) {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken })
    }
  },
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
