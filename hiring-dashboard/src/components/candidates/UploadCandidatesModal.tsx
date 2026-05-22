import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ShadcnButton } from '@/components/ui/shadcn-button'
import { PIPELINE_STAGE_LABELS, formatCandidateSource } from '@/constants'
import { PIPELINE_STAGE_IMPORT_HINT } from '@/lib/candidateExcel'
import {
  CANDIDATE_EXCEL_HEADERS,
  downloadCandidateImportTemplate,
  parseCandidatesExcelFile,
  validImportRows,
  type ParsedCandidateImportRow,
} from '@/lib/candidateExcel'
import {
  candidateService,
  getApiErrorMessage,
  type BulkCreateResult,
  type CreateCandidateInput,
} from '@/services'
import type { Job } from '@/types'
import { cn } from '@/utils'

interface UploadCandidatesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jobs: Job[]
  onImported: (result: BulkCreateResult) => void
}

type Step = 'upload' | 'preview' | 'done'

export function UploadCandidatesModal({
  open,
  onOpenChange,
  jobs,
  onImported,
}: UploadCandidatesModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('upload')
  const [rows, setRows] = useState<ParsedCandidateImportRow[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importResult, setImportResult] = useState<BulkCreateResult | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const reset = useCallback(() => {
    setStep('upload')
    setRows([])
    setFileName(null)
    setParseError(null)
    setImporting(false)
    setImportError(null)
    setImportResult(null)
    setIsDragging(false)
  }, [])

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  const processFile = async (file: File) => {
    setParseError(null)
    if (jobs.length === 0) {
      setParseError('No jobs available. Create a job before importing candidates.')
      return
    }
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['xlsx', 'xls', 'csv'].includes(ext ?? '')) {
      setParseError('Please upload an Excel file (.xlsx, .xls) or CSV')
      return
    }

    try {
      const buffer = await file.arrayBuffer()
      const parsed = parseCandidatesExcelFile(buffer, jobs)
      if (parsed.length === 0) {
        setParseError('No candidate rows found in the file')
        return
      }
      setRows(parsed)
      setFileName(file.name)
      setStep('preview')
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Failed to read file')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) void processFile(file)
  }

  const validRows = validImportRows(rows)
  const invalidCount = rows.length - validRows.length

  const handleImport = async () => {
    if (validRows.length === 0) return
    setImporting(true)
    setImportError(null)

    const inputs: (CreateCandidateInput & { rowNumber: number })[] = validRows.map((r) => ({
      rowNumber: r.rowNumber,
      firstName: r.firstName.trim(),
      lastName: r.lastName.trim(),
      email: r.email.trim(),
      phone: r.phone,
      jobId: r.jobId!,
      jobTitle: jobs.find((j) => j.id === r.jobId)?.title ?? r.jobTitle,
      pipelineStage: r.pipelineStage,
      linkedinUrl: r.linkedinUrl,
      resumeUrl: r.resumeUrl,
      appliedDate: r.appliedAt,
      source: r.source,
      skills: r.skills,
    }))

    try {
      const result = await candidateService.bulkCreate(inputs)
      setImportResult(result)
      onImported(result)
      setStep('done')
    } catch (err) {
      setImportError(getApiErrorMessage(err))
    } finally {
      setImporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <div className="border-b border-zinc-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-6 py-5 dark:border-zinc-800 dark:from-indigo-950/40 dark:via-zinc-900 dark:to-violet-950/30">
          <DialogHeader className="space-y-1 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg">Import candidates from Excel</DialogTitle>
                <DialogDescription className="text-zinc-600 dark:text-zinc-400">
                  Upload a spreadsheet with your candidate pipeline data
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {(['upload', 'preview', 'done'] as Step[]).map((s, i) => (
              <span
                key={s}
                className={cn(
                  'rounded-full px-3 py-1 font-medium capitalize',
                  step === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/80 text-zinc-500 ring-1 ring-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-400 dark:ring-zinc-700',
                )}
              >
                {i + 1}. {s === 'upload' ? 'Upload' : s === 'preview' ? 'Review' : 'Complete'}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'upload' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/5">
                <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
                  Required columns
                </p>
                <p className="mt-1 text-xs text-indigo-700/90 dark:text-indigo-300/80">
                  {CANDIDATE_EXCEL_HEADERS.join(' · ')}
                </p>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium">Job Title</span> must match an existing job in
                  HireFlow. <span className="font-medium">Current Stage</span> accepts:{' '}
                  {PIPELINE_STAGE_IMPORT_HINT}.
                </p>
              </div>

              <ShadcnButton
                type="button"
                variant="outline"
                className="w-full border-dashed border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-500/30 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
                onClick={downloadCandidateImportTemplate}
              >
                <Download className="h-4 w-4" />
                Download Excel template
              </ShadcnButton>

              <div
                role="button"
                tabIndex={0}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 transition-all',
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-500/10'
                    : 'border-zinc-300 bg-zinc-50/50 hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-zinc-600 dark:bg-zinc-900/50 dark:hover:border-indigo-500',
                )}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/20">
                  <Upload className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Drop your Excel file here
                </p>
                <p className="mt-1 text-xs text-zinc-500">or click to browse · .xlsx, .xls, .csv</p>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void processFile(file)
                  e.target.value = ''
                }}
              />

              {parseError && (
                <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {parseError}
                </p>
              )}
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{fileName}</span>
                  {' · '}
                  {rows.length} row{rows.length !== 1 ? 's' : ''}
                </p>
                <div className="flex gap-2 text-xs">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400">
                    {validRows.length} ready
                  </span>
                  {invalidCount > 0 && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-400">
                      {invalidCount} need fixes
                    </span>
                  )}
                </div>
              </div>

              <div className="max-h-[320px] overflow-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full min-w-[640px] text-left text-xs">
                  <thead className="sticky top-0 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    <tr>
                      <th className="px-3 py-2 font-medium">Row</th>
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">Email</th>
                      <th className="px-3 py-2 font-medium">Job</th>
                      <th className="px-3 py-2 font-medium">Stage</th>
                      <th className="px-3 py-2 font-medium">Source</th>
                      <th className="px-3 py-2 font-medium">Skills</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {rows.map((row) => (
                      <tr
                        key={row.rowNumber}
                        className={cn(
                          row.errors.length > 0
                            ? 'bg-amber-50/50 dark:bg-amber-500/5'
                            : 'bg-white dark:bg-zinc-900/50',
                        )}
                      >
                        <td className="px-3 py-2 text-zinc-500">{row.rowNumber}</td>
                        <td className="px-3 py-2 font-medium text-zinc-900 dark:text-zinc-100">
                          {row.firstName} {row.lastName}
                        </td>
                        <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">{row.email}</td>
                        <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                          {row.jobTitle || '—'}
                        </td>
                        <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                          {PIPELINE_STAGE_LABELS[row.pipelineStage]}
                        </td>
                        <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                          {row.source ? formatCandidateSource(row.source) : '—'}
                        </td>
                        <td className="max-w-[140px] truncate px-3 py-2 text-zinc-600 dark:text-zinc-400">
                          {row.skills.length > 0 ? row.skills.join(', ') : '—'}
                        </td>
                        <td className="px-3 py-2">
                          {row.errors.length === 0 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              OK
                            </span>
                          ) : (
                            <span
                              className="text-amber-700 dark:text-amber-400"
                              title={row.errors.join('; ')}
                            >
                              {row.errors[0]}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {importError && (
                <p className="text-sm text-red-600 dark:text-red-400">{importError}</p>
              )}
            </div>
          )}

          {step === 'done' && importResult && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Import complete
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {importResult.created.length} candidate
                  {importResult.created.length !== 1 ? 's' : ''} added
                  {importResult.failed.length > 0 &&
                    ` · ${importResult.failed.length} skipped`}
                </p>
              </div>

              {importResult.failed.length > 0 && (
                <ul className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                  {importResult.failed.map((f) => (
                    <li key={`${f.index}-${f.email}`} className="flex gap-2">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>
                        Row {f.rowNumber ?? validRows[f.index]?.rowNumber ?? f.index + 2}:{' '}
                        <span className="font-medium">{f.email}</span> — {f.message}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 border-t border-zinc-200 bg-zinc-50/80 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          {step === 'upload' && (
            <ShadcnButton type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </ShadcnButton>
          )}
          {step === 'preview' && (
            <>
              <ShadcnButton
                type="button"
                variant="outline"
                onClick={() => {
                  setStep('upload')
                  setRows([])
                  setFileName(null)
                }}
                disabled={importing}
              >
                <X className="h-4 w-4" />
                Change file
              </ShadcnButton>
              <ShadcnButton
                type="button"
                onClick={handleImport}
                disabled={importing || validRows.length === 0}
                className="bg-indigo-600 hover:bg-indigo-500"
              >
                {importing && <Loader2 className="h-4 w-4 animate-spin" />}
                Import {validRows.length} candidate{validRows.length !== 1 ? 's' : ''}
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
