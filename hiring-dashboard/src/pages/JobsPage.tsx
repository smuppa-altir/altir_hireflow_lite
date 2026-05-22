import { Briefcase, Plus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { JOB_STATUS_LABELS } from '@/constants'
import { PageHeader, SearchBar } from '@/components/common'
import { CreateJobModal, type JobFormData } from '@/components/jobs/CreateJobModal'
import { JobTable } from '@/components/jobs/JobTable'
import { JOBS_MOCK_DATA } from '@/components/jobs/jobsMockData'
import { Button, EmptyState, Select, Spinner } from '@/components/ui'
import { useDebounce } from '@/hooks'
import { jobService, getApiErrorMessage } from '@/services'
import type { Job, JobStatus } from '@/types'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const PAGE_SIZE = 5

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(USE_MOCK ? JOBS_MOCK_DATA : [])
  const [apiLoading, setApiLoading] = useState(!USE_MOCK)
  const [apiError, setApiError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<JobStatus | ''>('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  const debouncedSearch = useDebounce(search, 300)

  const loadJobs = useCallback(() => {
    if (USE_MOCK) return
    setApiLoading(true)
    setApiError(null)
    jobService
      .getAll({ pageSize: 100 })
      .then((result) => setJobs(result.data))
      .catch((err) => setApiError(getApiErrorMessage(err)))
      .finally(() => setApiLoading(false))
  }, [])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  const filteredJobs = useMemo(() => {
    let result = [...jobs]

    if (statusFilter) {
      result = result.filter((j) => j.status === statusFilter)
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.department.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.experience.toLowerCase().includes(q),
      )
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [jobs, statusFilter, debouncedSearch])

  const total = filteredJobs.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredJobs.slice(start, start + PAGE_SIZE)
  }, [filteredJobs, currentPage])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const handleStatusChange = useCallback((value: JobStatus | '') => {
    setStatusFilter(value)
    setPage(1)
  }, [])

  const openCreateModal = () => {
    setEditingJob(null)
    setModalOpen(true)
  }

  const openEditModal = (job: Job) => {
    setEditingJob(job)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingJob(null)
  }

  const handleSubmit = async (data: JobFormData) => {
    setSubmitting(true)
    setApiError(null)
    try {
      if (editingJob) {
        const updated = await jobService.update(editingJob.id, data)
        setJobs((prev) => prev.map((j) => (j.id === editingJob.id ? updated : j)))
      } else {
        const created = await jobService.create(data)
        setJobs((prev) => [created, ...prev])
        setPage(1)
        setStatusFilter('')
      }
    } catch (err) {
      setApiError(getApiErrorMessage(err))
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (job: Job) => {
    const confirmed = window.confirm(
      `Delete "${job.title}"? This action cannot be undone.`,
    )
    if (!confirmed) return
    setApiError(null)
    try {
      await jobService.delete(job.id)
      setJobs((prev) => prev.filter((j) => j.id !== job.id))
      if (paginatedJobs.length === 1 && currentPage > 1) {
        setPage(currentPage - 1)
      }
    } catch (err) {
      setApiError(getApiErrorMessage(err))
    }
  }

  const statusOptions = [
    { value: '', label: 'All statuses' },
    ...Object.entries(JOB_STATUS_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        actions={
          <Button
            size="sm"
            onClick={openCreateModal}
            className="bg-indigo-600 hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            Create Job
          </Button>
        }
      />

      {apiError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {apiError}
        </p>
      )}

      {apiLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by title, department, location..."
          className="flex-1"
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value as JobStatus | '')}
          className="sm:w-48"
        />
      </div>

      {!apiLoading && total === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description="Try adjusting filters or create a new job posting"
          action={
            <Button onClick={openCreateModal} className="bg-indigo-600 hover:bg-indigo-500">
              <Plus className="h-4 w-4" />
              Create Job
            </Button>
          }
        />
      ) : (
        !apiLoading && (
          <JobTable
            jobs={paginatedJobs}
            page={currentPage}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
            onEdit={openEditModal}
            onDelete={handleDelete}
            emptyMessage="No jobs match your search"
          />
        )
      )}

      <CreateJobModal
        open={modalOpen}
        onOpenChange={(open) => !open && closeModal()}
        onSubmit={handleSubmit}
        job={editingJob}
        isSubmitting={submitting}
      />
    </div>
  )
}
