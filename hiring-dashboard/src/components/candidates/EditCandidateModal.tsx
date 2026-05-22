import { FileUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { FieldLabel } from '@/components/common'
import { CANDIDATE_SOURCE_FORM_OPTIONS, PIPELINE_STAGE_OPTIONS } from '@/constants'
import type { CandidateSource } from '@/constants/candidateSource'
import {
  CANDIDATE_EXPERIENCE_FORM_OPTIONS,
  yearsToExperienceLevel,
  type CandidateExperienceLevel,
} from '@/constants/candidateExperience'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ShadcnButton } from '@/components/ui/shadcn-button'
import { ShadcnInput } from '@/components/ui/shadcn-input'
import { ShadcnSelect } from '@/components/ui/shadcn-select'
import { getApiErrorMessage, uploadResume } from '@/services'
import type { Candidate, PipelineStage } from '@/types'
import { formatSkillsInput } from '@/utils/skills'
import { hasResumeAttached, isValidHttpUrl, resolveResumeViewUrl } from '@/utils'

export interface CandidateFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  jobId: string
  pipelineStage: PipelineStage
  experienceLevel: CandidateExperienceLevel
  rating: string
  linkedinUrl: string
  resumeUrl: string
  source: CandidateSource
  skillsInput: string
}

const EMPTY_FORM: CandidateFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  jobId: '',
  pipelineStage: 'applied',
  experienceLevel: '',
  rating: '',
  linkedinUrl: '',
  resumeUrl: '',
  source: '',
  skillsInput: '',
}

interface EditCandidateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: Candidate | null
  jobOptions: { value: string; label: string }[]
  onSubmit: (id: string, data: CandidateFormData) => void | Promise<void>
  onCreate: (data: CandidateFormData) => void | Promise<void>
  isSubmitting?: boolean
}

const stageOptions = PIPELINE_STAGE_OPTIONS

export function EditCandidateModal({
  open,
  onOpenChange,
  candidate,
  jobOptions,
  onSubmit,
  onCreate,
  isSubmitting = false,
}: EditCandidateModalProps) {
  const isCreate = candidate === null
  const [form, setForm] = useState<CandidateFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof CandidateFormData, string>>>({})
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeFileLabel, setResumeFileLabel] = useState<string | null>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setResumeFile(null)
    setResumeFileLabel(null)
    if (candidate) {
      setForm({
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone ?? '',
        jobId: candidate.jobId,
        pipelineStage: candidate.pipelineStage,
        experienceLevel: yearsToExperienceLevel(candidate.experienceYears),
        rating: candidate.rating?.toString() ?? '',
        linkedinUrl: candidate.linkedinUrl ?? '',
        resumeUrl: candidate.resumeUrl ?? '',
        source: candidate.source ?? '',
        skillsInput: formatSkillsInput(candidate.skills),
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [open, candidate])

  const update = (field: keyof CandidateFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next: Partial<Record<keyof CandidateFormData, string>> = {}
    if (!form.firstName.trim()) next.firstName = 'First name is required'
    if (!form.lastName.trim()) next.lastName = 'Last name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Invalid email'
    if (!form.jobId) next.jobId = 'Job is required'
    if (form.linkedinUrl.trim() && !isValidHttpUrl(form.linkedinUrl)) {
      next.linkedinUrl = 'Enter a valid URL (https://...)'
    }
    if (form.resumeUrl.trim()) {
      const resume = form.resumeUrl.trim()
      if (!resume.startsWith('/') && !isValidHttpUrl(resume)) {
        next.resumeUrl = 'Enter a valid URL (https://...) or path (/uploads/...)'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setResumeFile(null)
      setResumeFileLabel(null)
      return
    }
    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setErrors((prev) => ({ ...prev, resumeUrl: 'Only PDF files are allowed' }))
      setResumeFile(null)
      setResumeFileLabel(null)
      e.target.value = ''
      return
    }
    setErrors((prev) => ({ ...prev, resumeUrl: undefined }))
    setResumeFile(file)
    setResumeFileLabel(file.name)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    let resumeUrl = form.resumeUrl.trim()
    try {
      if (resumeFile) {
        const uploaded = await uploadResume(resumeFile)
        resumeUrl = uploaded.url
      }
      const payload: CandidateFormData = { ...form, resumeUrl }

      if (isCreate) {
        await onCreate(payload)
      } else if (candidate) {
        await onSubmit(candidate.id, payload)
      }
      onOpenChange(false)
    } catch (err) {
      const message = getApiErrorMessage(err)
      if (resumeFile) {
        setErrors((prev) => ({ ...prev, resumeUrl: message }))
      }
      throw err
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isCreate ? 'Add Candidate' : 'Edit Candidate'}</DialogTitle>
          <DialogDescription>
            {isCreate
              ? 'Add a new person to your hiring pipeline'
              : `Update ${candidate!.firstName} ${candidate!.lastName}'s profile`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel required>First name</FieldLabel>
              <ShadcnInput
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
              )}
            </div>
            <div>
              <FieldLabel required>Last name</FieldLabel>
              <ShadcnInput
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <FieldLabel required>Email</FieldLabel>
            <ShadcnInput
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div>
            <FieldLabel>Phone</FieldLabel>
            <ShadcnInput
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div>
            <FieldLabel>LinkedIn URL</FieldLabel>
            <ShadcnInput
              type="url"
              value={form.linkedinUrl}
              onChange={(e) => update('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/in/username (optional)"
            />
            {errors.linkedinUrl && (
              <p className="mt-1 text-xs text-red-400">{errors.linkedinUrl}</p>
            )}
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
            <FieldLabel>Resume (PDF)</FieldLabel>
            <p className="mb-3 text-xs text-zinc-500">
              Attach a PDF resume. It will be saved and available from View Resume on the
              profile.
            </p>
            <input
              ref={resumeInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={handleResumeFileChange}
            />
            <ShadcnButton
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => resumeInputRef.current?.click()}
            >
              <FileUp className="h-4 w-4" />
              {resumeFileLabel ? 'Change PDF' : 'Attach resume (PDF)'}
            </ShadcnButton>
            {resumeFileLabel && (
              <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                Selected: {resumeFileLabel}
              </p>
            )}
            {hasResumeAttached(form.resumeUrl) && !resumeFile && (
              <p className="mt-2 text-xs text-zinc-500">
                Current file:{' '}
                <a
                  href={resolveResumeViewUrl(form.resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  View existing resume
                </a>
              </p>
            )}
            <div className="mt-3">
              <FieldLabel>Or resume URL</FieldLabel>
              <ShadcnInput
                type="url"
                value={form.resumeUrl}
                onChange={(e) => {
                  update('resumeUrl', e.target.value)
                  if (e.target.value.trim()) {
                    setResumeFile(null)
                    setResumeFileLabel(null)
                    if (resumeInputRef.current) resumeInputRef.current.value = ''
                  }
                }}
                placeholder="https://... (optional if you upload a PDF)"
                disabled={Boolean(resumeFile)}
              />
            </div>
            {errors.resumeUrl && (
              <p className="mt-2 text-xs text-red-400">{errors.resumeUrl}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel required>Job</FieldLabel>
              <ShadcnSelect
                value={form.jobId}
                onChange={(e) => update('jobId', e.target.value)}
              >
                <option value="">Select job</option>
                {jobOptions.map((j) => (
                  <option key={j.value} value={j.value}>
                    {j.label}
                  </option>
                ))}
              </ShadcnSelect>
              {errors.jobId && <p className="mt-1 text-xs text-red-400">{errors.jobId}</p>}
            </div>
            <div>
              <FieldLabel required>Stage</FieldLabel>
              <ShadcnSelect
                value={form.pipelineStage}
                onChange={(e) => update('pipelineStage', e.target.value as PipelineStage)}
              >
                {stageOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </ShadcnSelect>
            </div>
          </div>

          <div>
            <FieldLabel>Skills</FieldLabel>
            <ShadcnInput
              value={form.skillsInput}
              onChange={(e) => update('skillsInput', e.target.value)}
              placeholder="e.g. React, TypeScript, Node.js (comma-separated, optional)"
            />
            <p className="mt-1 text-xs text-zinc-500">Separate multiple skills with commas</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Experience</FieldLabel>
              <ShadcnSelect
                value={form.experienceLevel}
                onChange={(e) =>
                  update('experienceLevel', e.target.value as CandidateExperienceLevel)
                }
              >
                {CANDIDATE_EXPERIENCE_FORM_OPTIONS.map((o) => (
                  <option key={o.value || 'none'} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </ShadcnSelect>
            </div>
            <div>
              <FieldLabel>Source</FieldLabel>
              <ShadcnSelect
                value={form.source}
                onChange={(e) => update('source', e.target.value as CandidateSource)}
              >
                {CANDIDATE_SOURCE_FORM_OPTIONS.map((o) => (
                  <option key={o.value || 'none'} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </ShadcnSelect>
            </div>
          </div>

          {!isCreate && (
            <div>
              <FieldLabel>Rating (0–5)</FieldLabel>
              <ShadcnInput
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={form.rating}
                onChange={(e) => update('rating', e.target.value)}
                placeholder="Optional"
              />
            </div>
          )}

          <DialogFooter className="gap-2 pt-2">
            <ShadcnButton
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </ShadcnButton>
            <ShadcnButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isCreate ? 'Add candidate' : 'Save changes'}
            </ShadcnButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
