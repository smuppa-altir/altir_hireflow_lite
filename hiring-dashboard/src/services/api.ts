import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_ENDPOINTS, STORAGE_KEYS } from '@/constants'
import type { ApiError } from '@/types'
import { getStorageItem, removeStorageItem } from '@/utils'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN)
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN)
      removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

interface ApiErrorBody {
  message?: string
  success?: boolean
  errors?: Array<{ message?: string }>
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined
    if (body?.message) return body.message
    if (body?.errors?.length) return body.errors.map((e) => e.message).filter(Boolean).join(', ')
    return error.message ?? 'An unexpected error occurred'
  }
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred'
}

export { API_ENDPOINTS }
