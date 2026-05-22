import { FileSpreadsheet, FileText, Plus, Users } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PIPELINE_STAGE_OPTIONS, ROUTES } from '@/constants'
import { PageHeader, SearchBar } from '@/components/common'
import { CandidateTable } from '@/components/candidates/CandidateTable'
import { CANDIDATES_MOCK_DATA } from '@/components/candidates/candidatesMockData'
import {
  CANDIDATE_EXPERIENCE_FILTER_OPTIONS,
  experienceLevelToYears,
  matchesExperienceFilter,
  type ExperienceFilter,
} from '@/constants/candidateExperience'
import {
  EditCandidateModal,
  type CandidateFormData,
} from '@/components/candidates/EditCandidateModal'
import { ImportFromResumeModal } from '@/components/candidates/ImportFromResumeModal'
import { UploadCandidatesModal } from '@/components/candidates/UploadCandidatesModal'
import { JOBS_MOCK_DATA } from '@/components/jobs/jobsMockData'
import { Button, EmptyState, Select, Spinner } from '@/components/ui'
import { useDebounce } from '@/hooks'
import { candidateService, getApiErrorMessage, jobService } from '@/services'
import type { Candidate, PipelineStage, Job } from '@/types'
import { matchesCandidateSearch } from '@/utils/candidateSearch'
import { parseSkillsInput } from '@/utils/skills'
import {
  sortCandidates,
  type CandidateSortKey,
  type SortDirection,
} from '@/utils/candidateSort'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const PAGE_SIZE = 10

export function CandidatesPage() {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState<Candidate[]>(
    USE_MOCK ? CANDIDATES_MOCK_DATA : [],
  )
  const [apiLoading, setApiLoading] = useState(!USE_MOCK)
  const [apiError, setApiError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<PipelineStage | ''>('')
  const [jobFilter, setJobFilter] = useState('')
  const [experienceFilter, setExperienceFilter] = useState<ExperienceFilter>('')
  const [page, setPage] = useState(1)
  const [editOpen, setEditOpen] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  const [jobs, setJobs] = useState<Job[]>(USE_MOCK ? JOBS_MOCK_DATA : [])
  const [submitting, setSubmitting] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [resumeImportOpen, setResumeImportOpen] = useState(false)
  const [sortKey, setSortKey] = useState<CandidateSortKey>('appliedAt')
  const [sortDir, setSortDir] = useState<SortDirection>('desc')

  const debouncedSearch = useDebounce(search, 300)

  const handleSort = useCallback((key: CandidateSortKey) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        return prev
      }
      setSortDir('asc')
      return key
    })
    setPage(1)
  }, [])

  useEffect(() => {
    if (USE_MOCK) return
    jobService
      .getAll({ pageSize: 100 })
      .then((result) => setJobs(result.data))
      .catch(() => setJobs([]))
  }, [])

  const loadCandidates = useCallback(async () => {
    if (USE_MOCK) return
    setApiLoading(true)
    setApiError(null)
    const searchQuery = debouncedSearch.trim()
    try {
      const result = await candidateService.getAll({
        pageSize: 100,
        search: searchQuery || undefined,
        jobId: jobFilter || undefined,
        pipelineStage: stageFilter || undefined,
      })
      setCandidates(result.data)
    } catch (err) {
      setApiError(getApiErrorMessage(err))
    } finally {
      setApiLoading(false)
    }
  }, [debouncedSearch, jobFilter, stageFilter])

  useEffect(() => {
    void loadCandidates()
  }, [loadCandidates])

  useEffect(() => {
    if (USE_MOCK) return
    const onFocus = () => void loadCandidates()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [loadCandidates])

  const filteredCandidates = useMemo(() => {
    let result = [...candidates]

    if (USE_MOCK) {
      if (stageFilter) {
        result = result.filter((c) => c.pipelineStage === stageFilter)
      }
      if (jobFilter) {
        result = result.filter((c) => c.jobId === jobFilter)
      }
      if (debouncedSearch.trim()) {
        result = result.filter((c) => matchesCandidateSearch(c, debouncedSearch))
      }
    }

    if (experienceFilter) {
      result = result.filter((c) =>
        matchesExperienceFilter(c.experienceYears, experienceFilter),
      )
    }

    return sortCandidates(result, sortKey, sortDir)
  }, [candidates, stageFilter, jobFilter, experienceFilter, debouncedSearch, sortKey, sortDir])

  const total = filteredCandidates.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredCandidates.slice(start, start + PAGE_SIZE)
  }, [filteredCandidates, currentPage])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const resetPage = useCallback(() => setPage(1), [])

  const stageOptions = [
    { value: '', label: 'All stages' },
    ...PIPELINE_STAGE_OPTIONS,
  ]

  const jobOptions = [
    { value: '', label: 'All jobs' },
    ...jobs.map((j) => ({ value: j.id, label: j.title })),
  ]

  const modalJobOptions = jobs.map((j) => ({ value: j.id, label: j.title }))

  const handleView = (candidate: Candidate) => {
    navigate(ROUTES.CANDIDATE_DETAIL.replace(':id', candidate.id))
  }

  const handleAdd = () => {
    setEditingCandidate(null)
    setEditOpen(true)
  }

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate)
    setEditOpen(true)
  }

  const handleCreate = async (data: CandidateFormData) => {
    const job = jobs.find((j) => j.id === data.jobId)
    setSubmitting(true)
    setApiError(null)
    try {
      const created = await candidateService.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        jobId: data.jobId,
        jobTitle: job?.title,
        pipelineStage: data.pipelineStage,
        linkedinUrl: data.linkedinUrl,
        resumeUrl: data.resumeUrl,
        experienceYears: experienceLevelToYears(data.experienceLevel),
        rating: data.rating ? Number(data.rating) : undefined,
        source: data.source || undefined,
        skills: parseSkillsInput(data.skillsInput),
      })
      setPage(1)
      if (USE_MOCK) {
        setCandidates((prev) => [created, ...prev])
      } else {
        await loadCandidates()
      }
      navigate(ROUTES.CANDIDATE_DETAIL.replace(':id', created.id))
    } catch (err) {
      setApiError(getApiErrorMessage(err))
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSubmit = async (id: string, data: CandidateFormData) => {
    const job = jobs.find((j) => j.id === data.jobId)
    setSubmitting(true)
    setApiError(null)
    try {
      const experienceYears = experienceLevelToYears(data.experienceLevel)
      const rating = data.rating ? Number(data.rating) : undefined
      await candidateService.update(id, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        jobId: data.jobId,
        jobTitle: job?.title,
        pipelineStage: data.pipelineStage,
        linkedinUrl: data.linkedinUrl,
        resumeUrl: data.resumeUrl,
        experienceYears,
        rating,
        source: data.source || undefined,
        skills: parseSkillsInput(data.skillsInput),
      })
      await loadCandidates()
    } catch (err) {
      setApiError(getApiErrorMessage(err))
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (candidate: Candidate) => {
    const name = `${candidate.firstName} ${candidate.lastName}`
    if (!window.confirm(`Delete ${name}? This action cannot be undone.`)) return
    setApiError(null)
    try {
      await candidateService.delete(candidate.id)
      if (paginatedCandidates.length === 1 && currentPage > 1) {
        setPage(currentPage - 1)
      }
      await loadCandidates()
    } catch (err) {
      setApiError(getApiErrorMessage(err))
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidates"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setResumeImportOpen(true)}
              disabled={jobs.length === 0}
              title={jobs.length === 0 ? 'Create a job before importing candidates' : undefined}
            >
              <FileText className="h-4 w-4" />
              Import from resume
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setUploadOpen(true)}
              disabled={jobs.length === 0}
              title={jobs.length === 0 ? 'Create a job before importing candidates' : undefined}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Import Excel
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-500"
              onClick={handleAdd}
              disabled={jobs.length === 0}
              title={jobs.length === 0 ? 'Create a job before adding candidates' : undefined}
            >
              <Plus className="h-4 w-4" />
              Add candidate
            </Button>
          </div>
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

      <div className="flex flex-col gap-3">
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name, email, phone, or job..."
          className="flex-1"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select
            options={stageOptions}
            value={stageFilter}
            onChange={(e) => {
              setStageFilter(e.target.value as PipelineStage | '')
              resetPage()
            }}
          />
          <Select
            options={jobOptions}
            value={jobFilter}
            onChange={(e) => {
              setJobFilter(e.target.value)
              resetPage()
            }}
          />
          <Select
            options={[...CANDIDATE_EXPERIENCE_FILTER_OPTIONS]}
            value={experienceFilter}
            onChange={(e) => {
              setExperienceFilter(e.target.value as ExperienceFilter)
              resetPage()
            }}
          />
        </div>
      </div>

      {total === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <CandidateTable
          candidates={paginatedCandidates}
          page={currentPage}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          emptyMessage="No candidates match your filters"
        />
      )}

      <EditCandidateModal
        open={editOpen}
        onOpenChange={(open) => {
          if (!open) setEditingCandidate(null)
          setEditOpen(open)
        }}
        candidate={editingCandidate}
        jobOptions={modalJobOptions}
        onSubmit={handleEditSubmit}
        onCreate={handleCreate}
        isSubmitting={submitting}
      />

      <UploadCandidatesModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        jobs={jobs}
        onImported={(result) => {
          setPage(1)
          if (result.created.length > 0) {
            void loadCandidates()
          } else if (result.failed.length > 0) {
            setApiError(
              `No candidates were imported. ${result.failed.length} row(s) failed — see details in the import dialog.`,
            )
          }
        }}
      />

      <ImportFromResumeModal
        open={resumeImportOpen}
        onOpenChange={setResumeImportOpen}
        jobs={jobs}
        onImported={() => {
          setPage(1)
          void loadCandidates()
        }}
      />
    </div>
  )
}
