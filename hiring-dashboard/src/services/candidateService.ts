import { API_ENDPOINTS } from '@/constants'
import type { Candidate, CandidateFilters, PaginatedResponse, PaginationParams } from '@/types'
import { CANDIDATES_MOCK_DATA } from '@/components/candidates/candidatesMockData'
import { mapApiCandidate, type ApiCandidate } from './apiMappers'
import { apiClient, getApiErrorMessage } from './api'
import type { CandidateSource } from '@/constants/candidateSource'
import { matchesCandidateSearch } from '@/utils/candidateSearch'
import { sanitizeSkills } from '@/utils/skills'
import { isValidHttpUrl, normalizeResumeUrl } from '@/utils'
import { pipelineStageToApiStage } from '@/utils/kanbanStages'
import type { PipelineStage } from '@/types/kanban'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const candidateService = {
  async getAll(
    params?: PaginationParams & CandidateFilters,
  ): Promise<PaginatedResponse<Candidate>> {
    if (USE_MOCK) {
      await delay(400)
      let filtered = [...CANDIDATES_MOCK_DATA]
      if (params?.pipelineStage) {
        filtered = filtered.filter((c) => c.pipelineStage === params.pipelineStage)
      }
      if (params?.jobId) filtered = filtered.filter((c) => c.jobId === params.jobId)
      if (params?.search) {
        filtered = filtered.filter((c) => matchesCandidateSearch(c, params.search!))
      }
      return paginate(filtered, params?.page ?? 1, params?.pageSize ?? 10)
    }
    const apiParams = params
      ? {
          page: params.page,
          pageSize: params.pageSize,
          search: params.search,
          jobId: params.jobId,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          ...(params.pipelineStage
            ? { stage: pipelineStageToApiStage(params.pipelineStage) }
            : {}),
        }
      : undefined
    const { data } = await apiClient.get<{
      data: PaginatedResponse<ApiCandidate>
    }>(API_ENDPOINTS.CANDIDATES.BASE, { params: apiParams })
    const page = data.data
    return {
      ...page,
      data: page.data.map(mapApiCandidate),
    }
  },

  async getById(id: string): Promise<Candidate> {
    if (USE_MOCK) {
      await delay(300)
      const candidate = CANDIDATES_MOCK_DATA.find((c) => c.id === id)
      if (!candidate) throw new Error('Candidate not found')
      return candidate
    }
    const { data } = await apiClient.get<{ data: ApiCandidate }>(API_ENDPOINTS.CANDIDATES.BY_ID(id))
    return mapApiCandidate(data.data)
  },

  async create(input: CreateCandidateInput): Promise<Candidate> {
    if (USE_MOCK) {
      await delay(400)
      const mock: Candidate = {
        id: `cand-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email: input.email.trim(),
        phone: input.phone?.trim() || undefined,
        pipelineStage: input.pipelineStage,
        jobId: input.jobId,
        jobTitle: input.jobTitle ?? '—',
        skills: input.skills ?? [],
        linkedinUrl: input.linkedinUrl?.trim(),
        resumeUrl: input.resumeUrl?.trim(),
        experienceYears: input.experienceYears,
        rating: input.rating,
        source: input.source,
        appliedAt: input.appliedDate ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      CANDIDATES_MOCK_DATA.unshift(mock)
      return mock
    }
    const payload = {
      name: `${input.firstName.trim()} ${input.lastName.trim()}`.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || undefined,
      linkedin: input.linkedinUrl?.trim(),
      resumeUrl: buildResumePayloadUrl(input.resumeUrl),
      jobId: input.jobId,
      currentStage: pipelineStageToApiStage(input.pipelineStage),
      ...(input.appliedDate ? { appliedDate: input.appliedDate } : {}),
      ...(input.experienceYears != null ? { experienceYears: input.experienceYears } : {}),
      ...(input.rating != null ? { rating: input.rating } : {}),
      ...(input.source ? { source: input.source } : {}),
      ...(input.skills && sanitizeSkills(input.skills).length > 0
        ? { skills: sanitizeSkills(input.skills) }
        : {}),
    }
    const { data } = await apiClient.post<{ data: ApiCandidate }>(
      API_ENDPOINTS.CANDIDATES.BASE,
      payload,
    )
    return mapApiCandidate(data.data)
  },

  async update(id: string, input: UpdateCandidateInput): Promise<Candidate> {
    if (USE_MOCK) {
      await delay(300)
      const jobTitle = input.jobTitle ?? '—'
      return {
        id,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email: input.email.trim(),
        phone: input.phone?.trim() || undefined,
        pipelineStage: input.pipelineStage,
        jobId: input.jobId,
        jobTitle,
        skills: input.skills ?? [],
        linkedinUrl: input.linkedinUrl?.trim(),
        resumeUrl: input.resumeUrl?.trim(),
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
    const payload = {
      name: `${input.firstName.trim()} ${input.lastName.trim()}`.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || undefined,
      linkedin: input.linkedinUrl?.trim(),
      resumeUrl: buildResumePayloadUrl(input.resumeUrl),
      jobId: input.jobId,
      currentStage: pipelineStageToApiStage(input.pipelineStage),
      ...(input.experienceYears != null ? { experienceYears: input.experienceYears } : {}),
      ...(input.rating != null ? { rating: input.rating } : {}),
      source: input.source || null,
      skills: sanitizeSkills(input.skills ?? []),
    }
    const { data } = await apiClient.put<{ data: ApiCandidate }>(
      API_ENDPOINTS.CANDIDATES.BY_ID(id),
      payload,
    )
    return mapApiCandidate(data.data)
  },

  async bulkCreate(inputs: CreateCandidateInput[]): Promise<BulkCreateResult> {
    const created: Candidate[] = []
    const failed: BulkCreateFailure[] = []

    for (let i = 0; i < inputs.length; i++) {
      try {
        const candidate = await this.create(inputs[i])
        created.push(candidate)
      } catch (err) {
        failed.push({
          index: i,
          rowNumber: (inputs[i] as CreateCandidateInput & { rowNumber?: number }).rowNumber,
          email: inputs[i].email,
          message: getApiErrorMessage(err),
        })
      }
    }

    return { created, failed }
  },

  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      await delay(200)
      return
    }
    await apiClient.delete(API_ENDPOINTS.CANDIDATES.BY_ID(id))
  },

  async updatePipelineStage(id: string, stage: PipelineStage): Promise<Candidate> {
    const apiStage = pipelineStageToApiStage(stage)
    if (USE_MOCK) {
      await delay(300)
      const idx = CANDIDATES_MOCK_DATA.findIndex((c) => c.id === id)
      if (idx === -1) throw new Error('Candidate not found')
      const updated: Candidate = {
        ...CANDIDATES_MOCK_DATA[idx],
        pipelineStage: stage,
        updatedAt: new Date().toISOString(),
      }
      CANDIDATES_MOCK_DATA[idx] = updated
      return updated
    }
    const { data } = await apiClient.patch<{ data: ApiCandidate }>(
      API_ENDPOINTS.CANDIDATES.STAGE(id),
      { stage: apiStage },
    )
    return mapApiCandidate(data.data)
  },
}

export interface UpdateCandidateInput {
  firstName: string
  lastName: string
  email: string
  phone?: string
  jobId: string
  jobTitle?: string
  pipelineStage: PipelineStage
  linkedinUrl?: string
  resumeUrl?: string
  experienceYears?: number
  rating?: number
  source?: CandidateSource
  skills?: string[]
}

export interface CreateCandidateInput {
  firstName: string
  lastName: string
  email: string
  phone?: string
  jobId: string
  jobTitle?: string
  pipelineStage: PipelineStage
  linkedinUrl?: string
  resumeUrl?: string
  appliedDate?: string
  experienceYears?: number
  rating?: number
  source?: CandidateSource
  skills?: string[]
}

export interface BulkCreateFailure {
  index: number
  rowNumber?: number
  email: string
  message: string
}

export interface BulkCreateResult {
  created: Candidate[]
  failed: BulkCreateFailure[]
}

function buildResumePayloadUrl(value?: string): string | undefined {
  const trimmed = value?.trim()
  if (!trimmed) return undefined
  if (trimmed.startsWith('/')) {
    const normalized = normalizeResumeUrl(trimmed)
    return isValidHttpUrl(normalized) ? normalized : undefined
  }
  return isValidHttpUrl(trimmed) ? trimmed : undefined
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
