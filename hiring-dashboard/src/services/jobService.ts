import { API_ENDPOINTS } from '@/constants'
import type { JobFormValues } from '@/lib/validations/jobSchema'
import type { Job, JobFilters, PaginatedResponse, PaginationParams } from '@/types'
import { mapApiJob, type ApiJob } from './apiMappers'
import { MOCK_JOBS } from './mockData'
import { apiClient } from './api'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const jobService = {
  async getAll(params?: PaginationParams & JobFilters): Promise<PaginatedResponse<Job>> {
    if (USE_MOCK) {
      await delay(400)
      let filtered = [...MOCK_JOBS]
      if (params?.status) filtered = filtered.filter((j) => j.status === params.status)
      if (params?.department)
        filtered = filtered.filter((j) =>
          j.department.toLowerCase().includes(params.department!.toLowerCase()),
        )
      if (params?.search) {
        const q = params.search.toLowerCase()
        filtered = filtered.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.department.toLowerCase().includes(q) ||
            j.location.toLowerCase().includes(q),
        )
      }
      return paginate(filtered, params?.page ?? 1, params?.pageSize ?? 10)
    }
    const { data } = await apiClient.get<{
      data: PaginatedResponse<ApiJob>
    }>(API_ENDPOINTS.JOBS.BASE, { params })
    const page = data.data
    return {
      ...page,
      data: page.data.map(mapApiJob),
    }
  },

  async getById(id: string): Promise<Job> {
    if (USE_MOCK) {
      await delay(300)
      const job = MOCK_JOBS.find((j) => j.id === id)
      if (!job) throw new Error('Job not found')
      return job
    }
    const { data } = await apiClient.get<{ data: ApiJob }>(API_ENDPOINTS.JOBS.BY_ID(id))
    return mapApiJob(data.data)
  },

  async create(input: JobFormValues): Promise<Job> {
    if (USE_MOCK) {
      await delay(400)
      return {
        id: `job-${Date.now()}`,
        title: input.title,
        department: input.department,
        location: input.location,
        experience: input.experience,
        description: input.description,
        status: input.status,
        employmentType: 'full_time',
        requirements: [],
        candidateCount: 0,
        hiringManagerId: 'user-1',
        hiringManagerName: 'Alex Morgan',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
    const { data } = await apiClient.post<{ data: ApiJob }>(API_ENDPOINTS.JOBS.BASE, input)
    return mapApiJob(data.data)
  },

  async update(id: string, input: JobFormValues): Promise<Job> {
    if (USE_MOCK) {
      await delay(300)
      const existing = MOCK_JOBS.find((j) => j.id === id)
      if (!existing) throw new Error('Job not found')
      return {
        ...existing,
        ...input,
        updatedAt: new Date().toISOString(),
      }
    }
    const { data } = await apiClient.put<{ data: ApiJob }>(API_ENDPOINTS.JOBS.BY_ID(id), input)
    return mapApiJob(data.data)
  },

  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      await delay(300)
      return
    }
    await apiClient.delete(API_ENDPOINTS.JOBS.BY_ID(id))
  },
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const start = (page - 1) * pageSize
  const data = items.slice(start, start + pageSize)
  return {
    data,
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
