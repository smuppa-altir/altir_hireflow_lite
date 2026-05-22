import { API_ENDPOINTS } from '@/constants'
import type {
  CancelInterviewPayload,
  CreateInterviewPayload,
  Interview,
  InterviewFilters,
  InterviewScheduleResult,
  RescheduleInterviewPayload,
} from '@/types/interview'
import type { Interviewer } from '@/types/interview'
import type { PaginatedResponse, PaginationParams } from '@/types'
import { mapApiInterview, type ApiInterview } from './apiMappers'
import { CANDIDATES_MOCK_DATA } from '@/components/candidates/candidatesMockData'
import { MOCK_INTERVIEWS } from './mockData'
import { apiClient } from './api'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let mockStore = [...MOCK_INTERVIEWS]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const start = (page - 1) * pageSize
  const data = items.slice(start, start + pageSize)
  return {
    data,
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize) || 1,
  }
}

function filterMock(items: Interview[], params?: PaginationParams & InterviewFilters) {
  let filtered = [...items]
  if (params?.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter(
      (i) =>
        i.candidateName.toLowerCase().includes(q) ||
        i.jobTitle.toLowerCase().includes(q) ||
        i.interviewerName.toLowerCase().includes(q),
    )
  }
  if (params?.status) filtered = filtered.filter((i) => i.status === params.status)
  if (params?.round) filtered = filtered.filter((i) => i.round === params.round)
  if (params?.interviewerId) {
    filtered = filtered.filter((i) => i.interviewerId === params.interviewerId)
  }
  if (params?.dateFrom) {
    const from = new Date(params.dateFrom).getTime()
    filtered = filtered.filter((i) => new Date(i.scheduledAt).getTime() >= from)
  }
  if (params?.dateTo) {
    const to = new Date(params.dateTo).getTime()
    filtered = filtered.filter((i) => new Date(i.scheduledAt).getTime() <= to)
  }
  return filtered.sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  )
}

function mockFromPayload(payload: CreateInterviewPayload, existing?: Interview): Interview {
  const id = existing?.id ?? `int-${Date.now()}`
  const cand = CANDIDATES_MOCK_DATA.find((c) => c.id === payload.candidateId)
  const candidateName = cand
    ? `${cand.firstName} ${cand.lastName}`.trim()
    : (existing?.candidateName ?? 'Candidate')
  return {
    id,
    candidateId: payload.candidateId,
    candidateName,
    candidateEmail: cand?.email ?? existing?.candidateEmail ?? 'candidate@example.com',
    jobId: cand?.jobId ?? existing?.jobId ?? '',
    jobTitle: cand?.jobTitle ?? existing?.jobTitle ?? 'Role',
    interviewerId: payload.interviewer ?? existing?.interviewerId ?? 'user-2',
    interviewerName: payload.interviewerName ?? existing?.interviewerName ?? 'Interviewer',
    interviewerEmail: payload.interviewerEmail ?? existing?.interviewerEmail ?? 'interviewer@hireflow.io',
    round: payload.round,
    status: existing?.status ?? 'scheduled',
    scheduledAt: payload.date,
    durationMinutes: payload.durationMinutes,
    meetingType: payload.meetingType,
    meetingLink: payload.meetingLink,
    location: payload.location,
    notes: payload.notes,
    candidateInstructions: payload.candidateInstructions,
    cancelReason: existing?.cancelReason,
    updatedAt: new Date().toISOString(),
  }
}

export const interviewApi = {
  async getInterviews(
    params?: PaginationParams & InterviewFilters,
  ): Promise<PaginatedResponse<Interview>> {
    if (USE_MOCK) {
      await delay(350)
      const filtered = filterMock(mockStore, params)
      return paginate(filtered, params?.page ?? 1, params?.pageSize ?? 20)
    }
    const { data } = await apiClient.get<{ data: PaginatedResponse<ApiInterview> }>(
      API_ENDPOINTS.INTERVIEWS.BASE,
      {
        params: {
          page: params?.page,
          pageSize: params?.pageSize,
          search: params?.search,
          status: params?.status,
          round: params?.round,
          interviewer: params?.interviewerId,
          dateFrom: params?.dateFrom,
          dateTo: params?.dateTo,
        },
      },
    )
    const page = data.data
    return { ...page, data: page.data.map(mapApiInterview) }
  },

  async getInterviewById(id: string): Promise<Interview> {
    if (USE_MOCK) {
      await delay(200)
      const found = mockStore.find((i) => i.id === id)
      if (!found) throw new Error('Interview not found')
      return found
    }
    const { data } = await apiClient.get<{ data: ApiInterview }>(
      API_ENDPOINTS.INTERVIEWS.BY_ID(id),
    )
    return mapApiInterview(data.data)
  },

  async createInterview(payload: CreateInterviewPayload): Promise<InterviewScheduleResult> {
    if (USE_MOCK) {
      await delay(400)
      const created = mockFromPayload(payload)
      mockStore = [created, ...mockStore]
      return { ...created, emailNotifications: { results: [] } }
    }
    const { data } = await apiClient.post<{
      data: ApiInterview & {
        emailNotifications?: InterviewScheduleResult['emailNotifications']
      }
    }>(API_ENDPOINTS.INTERVIEWS.BASE, payload)
    return {
      ...mapApiInterview(data.data),
      emailNotifications: data.data.emailNotifications,
    }
  },

  async updateInterview(id: string, payload: Partial<CreateInterviewPayload>): Promise<Interview> {
    if (USE_MOCK) {
      await delay(300)
      const idx = mockStore.findIndex((i) => i.id === id)
      if (idx === -1) throw new Error('Interview not found')
      const updated = mockFromPayload({ ...mockStore[idx], ...payload } as CreateInterviewPayload, mockStore[idx])
      mockStore[idx] = updated
      return updated
    }
    const { data } = await apiClient.put<{ data: ApiInterview }>(
      API_ENDPOINTS.INTERVIEWS.BY_ID(id),
      payload,
    )
    return mapApiInterview(data.data)
  },

  async rescheduleInterview(id: string, payload: RescheduleInterviewPayload): Promise<Interview> {
    if (USE_MOCK) {
      await delay(300)
      const idx = mockStore.findIndex((i) => i.id === id)
      if (idx === -1) throw new Error('Interview not found')
      const updated: Interview = {
        ...mockStore[idx],
        scheduledAt: payload.date,
        durationMinutes: payload.durationMinutes ?? mockStore[idx].durationMinutes,
        interviewerName: payload.interviewerName ?? mockStore[idx].interviewerName,
        interviewerEmail: payload.interviewerEmail ?? mockStore[idx].interviewerEmail,
        meetingType: payload.meetingType ?? mockStore[idx].meetingType,
        meetingLink: payload.meetingLink,
        location: payload.location,
        status: 'scheduled',
      }
      mockStore[idx] = updated
      return updated
    }
    const { data } = await apiClient.patch<{ data: ApiInterview }>(
      API_ENDPOINTS.INTERVIEWS.RESCHEDULE(id),
      payload,
    )
    return mapApiInterview(data.data)
  },

  async cancelInterview(id: string, payload: CancelInterviewPayload): Promise<Interview> {
    if (USE_MOCK) {
      await delay(300)
      const idx = mockStore.findIndex((i) => i.id === id)
      if (idx === -1) throw new Error('Interview not found')
      mockStore[idx] = {
        ...mockStore[idx],
        status: 'cancelled',
        cancelReason: payload.reason,
      }
      return mockStore[idx]
    }
    const { data } = await apiClient.patch<{ data: ApiInterview }>(
      API_ENDPOINTS.INTERVIEWS.CANCEL(id),
      payload,
    )
    return mapApiInterview(data.data)
  },

  async markInterviewCompleted(id: string): Promise<Interview> {
    if (USE_MOCK) {
      await delay(250)
      const idx = mockStore.findIndex((i) => i.id === id)
      if (idx === -1) throw new Error('Interview not found')
      mockStore[idx] = { ...mockStore[idx], status: 'completed' }
      return mockStore[idx]
    }
    const { data } = await apiClient.patch<{ data: ApiInterview }>(
      API_ENDPOINTS.INTERVIEWS.COMPLETE(id),
    )
    return mapApiInterview(data.data)
  },

  async getStaffInterviewers(): Promise<Interviewer[]> {
    if (USE_MOCK) {
      await delay(150)
      return [
        { id: 'user-1', name: 'Alex Morgan', email: 'admin@hireflow.io', role: 'admin' },
        { id: 'user-2', name: 'Jordan Lee', email: 'recruiter@hireflow.io', role: 'recruiter' },
        { id: 'user-3', name: 'Sam Patel', email: 'interviewer@hireflow.io', role: 'interviewer' },
      ]
    }
    const { data } = await apiClient.get<{
      data: { id: string; name: string; email: string; role: string }[]
    }>(API_ENDPOINTS.USERS.STAFF)
    return data.data
  },
}
