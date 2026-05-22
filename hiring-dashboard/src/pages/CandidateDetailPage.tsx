import { ArrowLeft, Pencil, UserX } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { PageHeader } from '@/components/common'
import {
  EditCandidateModal,
  type CandidateFormData,
} from '@/components/candidates/EditCandidateModal'
import { CandidateDetailContent } from '@/components/candidates/detail/CandidateDetailContent'
import { CandidateProfileSidebar } from '@/components/candidates/detail/CandidateProfileSidebar'
import { enrichCandidateDetail } from '@/components/candidates/detail/candidateDetailData'
import type { CandidateDetail } from '@/types/candidateDetail'
import { EmptyState, Spinner } from '@/components/ui'
import { ShadcnButton } from '@/components/ui/shadcn-button'
import { parseSkillsInput } from '@/utils/skills'
import { candidateService, getApiErrorMessage, jobService } from '@/services'
import type { Job } from '@/types'

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [baseCandidate, setBaseCandidate] = useState<Awaited<
    ReturnType<typeof candidateService.getById>
  > | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])

  const loadCandidate = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await candidateService.getById(id)
      setBaseCandidate(data)
    } catch (err) {
      setError(getApiErrorMessage(err))
      setBaseCandidate(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadCandidate()
  }, [loadCandidate])

  useEffect(() => {
    jobService
      .getAll({ pageSize: 100 })
      .then((r) => setJobs(r.data))
      .catch(() => setJobs([]))
  }, [])

  const candidate = useMemo(
    (): CandidateDetail | null =>
      baseCandidate ? enrichCandidateDetail(baseCandidate) : null,
    [baseCandidate],
  )

  const modalJobOptions = jobs.map((j) => ({
    value: j.id,
    label: j.title,
  }))

  const handleEditSubmit = async (_candidateId: string, data: CandidateFormData) => {
    if (!id) return
    setSubmitting(true)
    setError(null)
    try {
      const job = jobs.find((j) => j.id === data.jobId)
      const updated = await candidateService.update(id, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        jobId: data.jobId,
        jobTitle: job?.title,
        pipelineStage: data.pipelineStage,
        linkedinUrl: data.linkedinUrl,
        resumeUrl: data.resumeUrl,
        source: data.source || undefined,
        skills: parseSkillsInput(data.skillsInput),
      })
      setBaseCandidate(updated)
      setEditOpen(false)
    } catch (err) {
      setError(getApiErrorMessage(err))
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  if (!id) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={UserX}
          title="Invalid link"
          description="This candidate URL is missing an ID. Return to the list and open a profile from there."
          action={
            <ShadcnButton variant="outline" asChild>
              <Link to={ROUTES.CANDIDATES}>
                <ArrowLeft className="h-4 w-4" />
                Back to candidates
              </Link>
            </ShadcnButton>
          }
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Link
          to={ROUTES.CANDIDATES}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to candidates
        </Link>
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      </div>
    )
  }

  if (error && !candidate) {
    const isNotFound = error.toLowerCase().includes('not found')

    return (
      <div className="space-y-6">
        <Link
          to={ROUTES.CANDIDATES}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to candidates
        </Link>

        <EmptyState
          icon={UserX}
          title={isNotFound ? 'Candidate not found' : 'Could not load profile'}
          description={
            isNotFound
              ? 'This profile may have been removed, or the link is outdated. Open the candidate again from the Candidates list.'
              : error
          }
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <ShadcnButton asChild>
                <Link to={ROUTES.CANDIDATES}>View all candidates</Link>
              </ShadcnButton>
              <ShadcnButton variant="outline" onClick={() => loadCandidate()}>
                Try again
              </ShadcnButton>
            </div>
          }
        />
      </div>
    )
  }

  if (!candidate) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to={ROUTES.CANDIDATES}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to candidates
        </Link>
        <div className="flex items-center gap-2">
          <ShadcnButton variant="outline" size="sm" asChild>
            <Link to={ROUTES.JOB_DETAIL.replace(':id', candidate.jobId)}>
              View job posting
            </Link>
          </ShadcnButton>
          <ShadcnButton variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
            Edit candidate
          </ShadcnButton>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      )}

      <PageHeader
        title={`${candidate.firstName} ${candidate.lastName}`}
        description={`${candidate.jobTitle}${candidate.location ? ` · ${candidate.location}` : ''}`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
        <CandidateProfileSidebar
          candidate={candidate}
          onAttachResume={() => setEditOpen(true)}
        />
        <CandidateDetailContent candidate={candidate} />
      </div>

      <EditCandidateModal
        open={editOpen}
        onOpenChange={setEditOpen}
        candidate={baseCandidate}
        jobOptions={modalJobOptions}
        onSubmit={handleEditSubmit}
        onCreate={async () => {}}
        isSubmitting={submitting}
      />
    </div>
  )
}
