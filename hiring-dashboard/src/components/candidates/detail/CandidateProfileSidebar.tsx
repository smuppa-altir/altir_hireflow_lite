import { Briefcase, ExternalLink, FileText, Linkedin, Mail, Phone, Upload, UserPlus } from 'lucide-react'
import { formatCandidateSource } from '@/constants/candidateSource'
import { useState } from 'react'
import { CandidateStatusBadge } from '@/components/candidates/CandidateStatusBadge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ShadcnButton } from '@/components/ui/shadcn-button'
import type { CandidateDetail } from '@/types/candidateDetail'
import { cn, getInitials, hasResumeAttached, resolveResumeViewUrl } from '@/utils'

interface CandidateProfileSidebarProps {
  candidate: CandidateDetail
  className?: string
  onAttachResume?: () => void
}

export function CandidateProfileSidebar({
  candidate,
  className,
  onAttachResume,
}: CandidateProfileSidebarProps) {
  const fullName = `${candidate.firstName} ${candidate.lastName}`
  const [noResumeOpen, setNoResumeOpen] = useState(false)
  const hasResume = hasResumeAttached(candidate.resumeUrl)

  const handleViewResume = () => {
    if (hasResume && candidate.resumeUrl) {
      const url = resolveResumeViewUrl(candidate.resumeUrl)
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    setNoResumeOpen(true)
  }

  const handleAttachFromDialog = () => {
    setNoResumeOpen(false)
    onAttachResume?.()
  }

  return (
    <>
      <aside
        className={cn(
          'rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:sticky lg:top-6',
          'dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:shadow-none',
          className,
        )}
      >
        <div className="flex flex-col items-center text-center">
          {candidate.photoUrl ? (
            <img
              src={candidate.photoUrl}
              alt={fullName}
              className="h-28 w-28 rounded-2xl object-cover ring-2 ring-zinc-200 dark:ring-zinc-800"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-3xl font-semibold text-indigo-700 ring-2 ring-indigo-200 dark:from-indigo-500/30 dark:to-violet-600/20 dark:text-indigo-200 dark:ring-indigo-500/20">
              {getInitials(fullName)}
            </div>
          )}

          <h1 className="mt-4 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {fullName}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{candidate.jobTitle}</p>
          {candidate.location && (
            <p className="mt-0.5 text-xs text-zinc-500">{candidate.location}</p>
          )}
          <div className="mt-3">
            <CandidateStatusBadge stage={candidate.pipelineStage} />
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-zinc-200 pt-6 dark:border-zinc-800/80">
          <a
            href={`mailto:${candidate.email}`}
            className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-indigo-300"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <Mail className="h-4 w-4 text-zinc-500" />
            </span>
            <span className="min-w-0 truncate">{candidate.email}</span>
          </a>

          {candidate.phone && (
            <a
              href={`tel:${candidate.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-indigo-300"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <Phone className="h-4 w-4 text-zinc-500" />
              </span>
              <span>{candidate.phone}</span>
            </a>
          )}

          {candidate.linkedinUrl && (
            <a
              href={candidate.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-indigo-300"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0A66C2]/10 dark:bg-[#0A66C2]/20">
                <Linkedin className="h-4 w-4 text-[#0A66C2]" />
              </span>
              <span className="flex items-center gap-1">
                LinkedIn
                <ExternalLink className="h-3 w-3 text-zinc-400" />
              </span>
            </a>
          )}

          {candidate.skills.length > 0 && (
            <div className="flex items-start gap-3 rounded-lg px-2 py-2 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <Briefcase className="h-4 w-4 text-zinc-500" />
              </span>
              <span className="min-w-0">
                <span className="text-xs text-zinc-500">Skills</span>
                <span className="mt-0.5 block leading-snug">
                  {candidate.skills.slice(0, 6).join(' · ')}
                  {candidate.skills.length > 6 ? ` +${candidate.skills.length - 6} more` : ''}
                </span>
              </span>
            </div>
          )}

          {candidate.source && (
            <div className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <UserPlus className="h-4 w-4 text-zinc-500" />
              </span>
              <span>
                <span className="text-xs text-zinc-500">Source</span>
                <span className="block font-medium text-zinc-900 dark:text-zinc-100">
                  {formatCandidateSource(candidate.source)}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-2 border-t border-zinc-200 pt-6 dark:border-zinc-800/80">
          <ShadcnButton
            type="button"
            className="w-full"
            variant={hasResume ? 'outline' : 'default'}
            onClick={handleViewResume}
          >
            <FileText className="h-4 w-4" />
            View Resume
          </ShadcnButton>
          {!hasResume && (
            <p className="text-center text-xs text-zinc-500">
              No resume on file — click to attach one
            </p>
          )}
        </div>

        {candidate.rating != null && (
          <div className="mt-4 rounded-lg bg-zinc-50 px-3 py-2.5 text-center dark:bg-zinc-950/50">
            <p className="text-xs text-zinc-500">Overall rating</p>
            <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">
              {candidate.rating} / 5
            </p>
          </div>
        )}
      </aside>

      <Dialog open={noResumeOpen} onOpenChange={setNoResumeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>No resume attached</DialogTitle>
            <DialogDescription>
              This candidate does not have a resume on file yet. Attach a PDF resume from the
              edit form to enable viewing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <ShadcnButton variant="outline" onClick={() => setNoResumeOpen(false)}>
              Close
            </ShadcnButton>
            {onAttachResume ? (
              <ShadcnButton onClick={handleAttachFromDialog}>
                <Upload className="h-4 w-4" />
                Attach resume
              </ShadcnButton>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
