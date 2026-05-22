export type JobStatus = 'draft' | 'open' | 'paused' | 'closed'

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'internship'

export interface Job {
  id: string
  title: string
  department: string
  location: string
  experience: string
  status: JobStatus
  employmentType: EmploymentType
  salaryMin?: number
  salaryMax?: number
  description: string
  requirements: string[]
  candidateCount: number
  hiringManagerId: string
  hiringManagerName: string
  createdAt: string
  updatedAt: string
}

export interface JobFilters {
  status?: JobStatus
  department?: string
  search?: string
}
