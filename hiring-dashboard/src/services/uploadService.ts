import { getApiOrigin } from '@/utils'
import { apiClient } from './api'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export interface ResumeUploadResult {
  url: string
  path: string
  originalName: string
}

/** Upload a PDF resume; returns the public URL to store on the candidate */
export async function uploadResume(file: File): Promise<ResumeUploadResult> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400))
    const path = `/uploads/resumes/mock-${Date.now()}.pdf`
    return {
      path,
      url: `${getApiOrigin()}${path}`,
      originalName: file.name,
    }
  }

  const formData = new FormData()
  formData.append('resume', file)

  const { data } = await apiClient.post<{ data: ResumeUploadResult }>(
    '/upload/resume',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
  return data.data
}
