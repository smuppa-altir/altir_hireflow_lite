import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
  X,
} from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { FieldLabel } from '@/components/common'
import { CANDIDATE_SOURCE_FORM_OPTIONS, PIPELINE_STAGE_OPTIONS } from '@/constants'
import type { CandidateSource } from '@/constants/candidateSource'
import {
  CANDIDATE_EXPERIENCE_FORM_OPTIONS,
  experienceLevelToYears,
  formatCandidateExperience,
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
import { formatSkillsInput, parseSkillsInput, sanitizeSkills } from '@/utils/skills'
import { candidateService, getApiErrorMessage, parseResumeFile, type ParsedResumeFields } from '@/services'
import type { PipelineStage, Job } from '@/types'
import { cn } from '@/utils'

interface ImportFromResumeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jobs: Job[]
  onImported: () => void
}

type Step = 'upload' | 'review' | 'done'

interface ReviewForm extends Omit<ParsedResumeFields, 'skills'> {
  jobId: string
  pipelineStage: PipelineStage
  experienceLevel: CandidateExperienceLevel
  resumeUrl: string
  source: CandidateSource
  skillsInput: string
}

const EMPTY_REVIEW: ReviewForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  linkedinUrl: '',
  jobId: '',
  pipelineStage: 'applied',
  experienceLevel: '',
  resumeUrl: '',
  source: '',
  skillsInput: '',
}

const stageOptions = PIPELINE_STAGE_OPTIONS

export function ImportFromResumeModal({
  open,
  onOpenChange,
  jobs,
  onImported,
}: ImportFromResumeModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('upload')
  const [fileName, setFileName] = useState<string | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const [form, setForm] = useState<ReviewForm>(EMPTY_REVIEW)
  const [errors, setErrors] = useState<Partial<Record<keyof ReviewForm, string>>>({})
  const [parseError, setParseError] = useState<string | null>(null)
  const [parsing, setParsing] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const reset = useCallback(() => {
    setStep('upload')
    setFileName(null)
    setWarnings([])
    setForm(EMPTY_REVIEW)
    setErrors({})
    setParseError(null)
    setParsing(false)
    setImporting(false)
    setImportError(null)
    setIsDragging(false)
  }, [])

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  const applyParsedToForm = (parsed: ParsedResumeFields, resumeUrl: string) => {
    setForm({
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      email: parsed.email,
      phone: parsed.phone,
      linkedinUrl: parsed.linkedinUrl,
      jobId: jobs.length === 1 ? jobs[0].id : '',
      pipelineStage: 'applied',
      experienceLevel: yearsToExperienceLevel(parsed.experienceYears),
      resumeUrl,
      source: '',
      skillsInput: formatSkillsInput(sanitizeSkills(parsed.skills ?? [])),
    })
  }

  const processFile = async (file: File) => {
    setParseError(null)
    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setParseError('Please upload a PDF resume')
      return
    }

    setParsing(true)
    try {
      const result = await parseResumeFile(file)
      setFileName(file.name)
      setWarnings(result.warnings)
      applyParsedToForm(result.parsed, result.url)
      setStep('review')
    } catch (err) {
      setParseError(getApiErrorMessage(err))
    } finally {
      setParsing(false)
    }
  }

  const update = <K extends keyof ReviewForm>(field: K, value: ReviewForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next: Partial<Record<keyof ReviewForm, string>> = {}
    if (!form.firstName.trim()) next.firstName = 'First name is required'
    if (!form.lastName.trim()) next.lastName = 'Last name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Invalid email'
    if (!form.jobId) next.jobId = 'Select a job'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleImport = async () => {
    if (!validate()) return
    setImporting(true)
    setImportError(null)
    const job = jobs.find((j) => j.id === form.jobId)
    try {
      await candidateService.create({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        jobId: form.jobId,
        jobTitle: job?.title,
        pipelineStage: form.pipelineStage,
        linkedinUrl: form.linkedinUrl.trim() || undefined,
        resumeUrl: form.resumeUrl,
        experienceYears: experienceLevelToYears(form.experienceLevel),
        source: form.source || undefined,
        skills: parseSkillsInput(form.skillsInput),
      })
      onImported()
      setStep('done')
    } catch (err) {
      setImportError(getApiErrorMessage(err))
    } finally {
      setImporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        <div className="border-b border-zinc-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-6 py-5 dark:border-zinc-800 dark:from-violet-950/40 dark:via-zinc-900 dark:to-indigo-950/30">
          <DialogHeader className="space-y-1 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/25">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg">Import from resume</DialogTitle>
                <DialogDescription className="text-zinc-600 dark:text-zinc-400">
                  Upload a PDF — we extract candidate details automatically
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {(['upload', 'review', 'done'] as Step[]).map((s, i) => (
              <span
                key={s}
                className={cn(
                  'rounded-full px-3 py-1 font-medium capitalize',
                  step === s
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/80 text-zinc-500 ring-1 ring-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-400 dark:ring-zinc-700',
                )}
              >
                {i + 1}. {s === 'upload' ? 'Upload' : s === 'review' ? 'Review' : 'Done'}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'upload' && (
            <div className="space-y-4">
              <div
                role="button"
                tabIndex={0}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  const file = e.dataTransfer.files[0]
                  if (file) void processFile(file)
                }}
                onClick={() => !parsing && inputRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 transition-all',
                  parsing && 'pointer-events-none opacity-60',
                  isDragging
                    ? 'border-violet-500 bg-violet-50/80 dark:bg-violet-500/10'
                    : 'border-zinc-300 bg-zinc-50/50 hover:border-violet-400 hover:bg-violet-50/30 dark:border-zinc-600 dark:bg-zinc-900/50',
                )}
              >
                {parsing ? (
                  <Loader2 className="mb-4 h-10 w-10 animate-spin text-violet-600" />
                ) : (
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-500/20">
                    <Upload className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                  </div>
                )}
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {parsing ? 'Parsing resume…' : 'Drop PDF resume here'}
                </p>
                <p className="mt-1 text-xs text-zinc-500">or click to browse · PDF only</p>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void processFile(file)
                  e.target.value = ''
                }}
              />

              <p className="text-xs text-zinc-500">
                Extracts name, email, phone, LinkedIn, and experience when present in the
                document.
              </p>

              {parseError && (
                <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {parseError}
                </p>
              )}
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Parsed from <span className="font-medium text-zinc-900 dark:text-zinc-100">{fileName}</span>
                {form.experienceLevel && (
                  <>
                    {' '}
                    · Experience detected:{' '}
                    <span className="font-medium">
                      {formatCandidateExperience(
                        experienceLevelToYears(form.experienceLevel),
                      )}
                    </span>
                  </>
                )}
              </p>

              {warnings.length > 0 && (
                <ul className="space-y-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                  {warnings.map((w) => (
                    <li key={w} className="flex gap-2">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {w}
                    </li>
                  ))}
                </ul>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel required>First name</FieldLabel>
                  <ShadcnInput
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <FieldLabel required>Last name</FieldLabel>
                  <ShadcnInput
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
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
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel>Phone</FieldLabel>
                  <ShadcnInput
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel>LinkedIn</FieldLabel>
                  <ShadcnInput
                    value={form.linkedinUrl}
                    onChange={(e) => update('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel required>Job</FieldLabel>
                  <ShadcnSelect
                    value={form.jobId}
                    onChange={(e) => update('jobId', e.target.value)}
                  >
                    <option value="">Select job</option>
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title}
                      </option>
                    ))}
                  </ShadcnSelect>
                  {errors.jobId && <p className="mt-1 text-xs text-red-500">{errors.jobId}</p>}
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
                  placeholder="e.g. React, TypeScript (comma-separated, optional)"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Auto-filled from resume when detected — edit as needed
                </p>
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

              {importError && (
                <p className="text-sm text-red-600 dark:text-red-400">{importError}</p>
              )}
            </div>
          )}

          {step === 'done' && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Candidate added
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {form.firstName} {form.lastName} is now in your candidates list with the
                resume attached.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 border-t border-zinc-200 bg-zinc-50/80 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          {step === 'upload' && (
            <ShadcnButton type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </ShadcnButton>
          )}
          {step === 'review' && (
            <>
              <ShadcnButton
                type="button"
                variant="outline"
                onClick={() => {
                  setStep('upload')
                  setFileName(null)
                  setForm(EMPTY_REVIEW)
                }}
                disabled={importing}
              >
                <X className="h-4 w-4" />
                Change file
              </ShadcnButton>
              <ShadcnButton
                type="button"
                onClick={handleImport}
                disabled={importing}
                className="bg-violet-600 hover:bg-violet-500"
              >
                {importing && <Loader2 className="h-4 w-4 animate-spin" />}
                Add to candidates
              </ShadcnButton>
            </>
          )}
          {step === 'done' && (
            <ShadcnButton type="button" onClick={() => handleOpenChange(false)}>
              Done
            </ShadcnButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
