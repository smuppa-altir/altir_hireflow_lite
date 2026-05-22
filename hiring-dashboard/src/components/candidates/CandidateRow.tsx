import { ChevronRight, Mail, MapPin, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { Avatar } from '@/components/ui'
import type { Candidate } from '@/types'
import { formatRelativeTime } from '@/utils'
import { CandidateStatusBadge } from './CandidateStatusBadge'

interface CandidateRowProps {
  candidate: Candidate
}

export function CandidateRow({ candidate }: CandidateRowProps) {
  const fullName = `${candidate.firstName} ${candidate.lastName}`

  return (
    <Link
      to={ROUTES.CANDIDATE_DETAIL.replace(':id', candidate.id)}
      className="group flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <Avatar name={fullName} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-zinc-900 dark:text-zinc-100">{fullName}</span>
          <CandidateStatusBadge stage={candidate.pipelineStage} />
        </div>
        <p className="mt-0.5 truncate text-sm text-zinc-500">{candidate.jobTitle}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {candidate.email}
          </span>
          {candidate.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {candidate.location}
            </span>
          )}
          {candidate.rating && (
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="h-3 w-3 fill-current" />
              {candidate.rating}
            </span>
          )}
        </div>
      </div>
      <div className="hidden shrink-0 text-right sm:block">
        <p className="text-xs text-zinc-400">Applied</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          {formatRelativeTime(candidate.appliedAt)}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-500" />
    </Link>
  )
}
