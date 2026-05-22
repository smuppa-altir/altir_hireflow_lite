import { ArrowLeft, Briefcase, MapPin, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { JOB_STATUS_COLORS, JOB_STATUS_LABELS, ROUTES } from '@/constants'
import { PageHeader } from '@/components/common'
import { Badge, Card, Spinner } from '@/components/ui'
import { useAsync } from '@/hooks'
import { jobService } from '@/services'
import { cn, formatDate, formatRelativeTime, formatSalaryRange } from '@/utils'

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: job, isLoading, error } = useAsync(() => jobService.getById(id!), [id], !!id)

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="text-center">
        <p className="text-red-600">{error ?? 'Job not found'}</p>
        <Link to={ROUTES.JOBS} className="mt-4 inline-block text-sm text-brand-600">
          Back to jobs
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        to={ROUTES.JOBS}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <PageHeader
        title={job.title}
        description={`${job.department} · ${job.location}`}
        actions={
          <Badge className={cn(JOB_STATUS_COLORS[job.status])}>
            {JOB_STATUS_LABELS[job.status]}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-zinc-400" />
          <div>
            <p className="text-xs text-zinc-500">Location</p>
            <p className="text-sm font-medium">{job.location}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-zinc-400" />
          <div>
            <p className="text-xs text-zinc-500">Salary</p>
            <p className="text-sm font-medium">
              {formatSalaryRange(job.salaryMin, job.salaryMax)}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <Users className="h-5 w-5 text-zinc-400" />
          <div>
            <p className="text-xs text-zinc-500">Candidates</p>
            <p className="text-sm font-medium">{job.candidateCount}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Description</h3>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {job.description}
          </p>
          <h3 className="mb-3 mt-6 text-sm font-semibold">Requirements</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            {job.requirements.map((req) => (
              <li key={req}>{req}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-semibold">Details</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-zinc-500">Hiring manager</dt>
              <dd className="mt-0.5 font-medium">{job.hiringManagerName}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Experience</dt>
              <dd className="mt-0.5">{job.experience}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Employment type</dt>
              <dd className="mt-0.5 capitalize">{job.employmentType.replace('_', ' ')}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Created</dt>
              <dd className="mt-0.5">{formatDate(job.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Updated</dt>
              <dd className="mt-0.5">{formatRelativeTime(job.updatedAt)}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  )
}
