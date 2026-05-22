import { Briefcase, FileText, Layers, StickyNote, UserPlus } from 'lucide-react'
import { CandidateStatusBadge } from '@/components/candidates/CandidateStatusBadge'
import { formatCandidateSource } from '@/constants/candidateSource'
import type { CandidateDetail } from '@/types/candidateDetail'
import { formatDate } from '@/utils'

interface CandidateOverviewTabProps {
  candidate: CandidateDetail
}

const sectionClass =
  'rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/40 dark:shadow-none'

export function CandidateOverviewTab({ candidate }: CandidateOverviewTabProps) {
  return (
    <div className="space-y-6">
      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Current Stage
            </h3>
          </div>
          <CandidateStatusBadge stage={candidate.pipelineStage} />
        </div>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Applied for{' '}
          <span className="font-medium text-zinc-900 dark:text-zinc-200">{candidate.jobTitle}</span>{' '}
          on {formatDate(candidate.appliedAt)}. Last updated {formatDate(candidate.updatedAt)}.
        </p>
      </section>

      {candidate.source && (
        <section className={sectionClass}>
          <div className="mb-3 flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Application source
            </h3>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This candidate applied via{' '}
            <span className="font-medium text-zinc-900 dark:text-zinc-200">
              {formatCandidateSource(candidate.source)}
            </span>
            .
          </p>
        </section>
      )}

      <section className={sectionClass}>
        <div className="mb-4 flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Skills</h3>
        </div>
        {candidate.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-700 dark:border-zinc-700/80 dark:bg-zinc-800/50 dark:text-zinc-200"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No skills listed</p>
        )}
      </section>

      <section className={sectionClass}>
        <div className="mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Experience</h3>
        </div>
        {candidate.experienceYears != null && (
          <p className="mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-300">
            {candidate.experienceYears}+ years professional experience
          </p>
        )}
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {candidate.experienceSummary}
        </p>
      </section>

      <section className={sectionClass}>
        <div className="mb-3 flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Notes</h3>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {candidate.notes ?? 'No notes added yet.'}
        </p>
      </section>
    </div>
  )
}
