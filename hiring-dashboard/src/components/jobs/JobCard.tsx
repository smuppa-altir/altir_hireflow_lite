import { Briefcase, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { JOB_STATUS_COLORS, JOB_STATUS_LABELS, ROUTES } from '@/constants'
import { Badge } from '@/components/ui'
import type { Job } from '@/types'
import { cn, formatRelativeTime, formatSalaryRange } from '@/utils'

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link
      to={ROUTES.JOB_DETAIL.replace(':id', job.id)}
      className="group block rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-zinc-900 group-hover:text-brand-600 dark:text-zinc-100 dark:group-hover:text-brand-400">
            {job.title}
          </h3>
          <p className="mt-0.5 text-sm text-zinc-500">{job.department}</p>
        </div>
        <Badge className={cn(JOB_STATUS_COLORS[job.status])}>
          {JOB_STATUS_LABELS[job.status]}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-500">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5" />
          {formatSalaryRange(job.salaryMin, job.salaryMax)}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {job.candidateCount} candidates
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
        {job.description}
      </p>

      <p className="mt-3 text-xs text-zinc-400">
        Updated {formatRelativeTime(job.updatedAt)}
      </p>
    </Link>
  )
}
