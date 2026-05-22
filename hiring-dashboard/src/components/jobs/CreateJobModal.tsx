import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import {
  JOB_EXPERIENCE_OPTIONS,
  JOB_STATUS_LABELS,
  normalizeJobExperience,
} from '@/constants'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ShadcnButton } from '@/components/ui/shadcn-button'
import { ShadcnInput } from '@/components/ui/shadcn-input'
import { ShadcnSelect } from '@/components/ui/shadcn-select'
import { Textarea } from '@/components/ui/textarea'
import {
  jobFormDefaultValues,
  jobFormSchema,
  type JobFormValues,
} from '@/lib/validations/jobSchema'
import type { Job } from '@/types'

export type { JobFormValues as JobFormData }

export interface CreateJobModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: JobFormValues) => void | Promise<void>
  job?: Job | null
  isSubmitting?: boolean
}

const statusOptions = Object.entries(JOB_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}))

export function CreateJobModal({
  open,
  onOpenChange,
  onSubmit,
  job,
  isSubmitting = false,
}: CreateJobModalProps) {
  const isEdit = !!job

  const experienceOptions = useMemo(() => {
    const options = [...JOB_EXPERIENCE_OPTIONS]
    if (job?.experience && !options.some((o) => o.value === job.experience)) {
      return [{ value: job.experience, label: job.experience }, ...options]
    }
    return options
  }, [job?.experience])

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: jobFormDefaultValues,
    mode: 'onBlur',
  })

  useEffect(() => {
    if (open) {
      if (job) {
        form.reset({
          title: job.title,
          department: job.department,
          location: job.location,
          experience: normalizeJobExperience(job.experience),
          description: job.description,
          status: job.status,
        })
      } else {
        form.reset(jobFormDefaultValues)
      }
    }
  }, [open, job, form])

  const handleSubmit = async (values: JobFormValues) => {
    try {
      await onSubmit(values)
      onOpenChange(false)
      form.reset(jobFormDefaultValues)
    } catch {
      // Parent sets apiError; keep modal open on failure
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset(job ? undefined : jobFormDefaultValues)
      form.clearErrors()
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Job' : 'Create Job'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the job posting details below.'
              : 'Fill in the details to add a new position to your hiring pipeline.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Job Title</FormLabel>
                  <FormControl>
                    <ShadcnInput placeholder="e.g. Senior Frontend Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Department</FormLabel>
                    <FormControl>
                      <ShadcnInput placeholder="e.g. Engineering" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Location</FormLabel>
                    <FormControl>
                      <ShadcnInput placeholder="e.g. Remote, San Francisco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Experience</FormLabel>
                    <FormControl>
                      <ShadcnSelect {...field}>
                        {experienceOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </ShadcnSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Status</FormLabel>
                    <FormControl>
                      <ShadcnSelect {...field}>
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </ShadcnSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Role overview, responsibilities, and team context..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-2 sm:gap-0">
              <ShadcnButton
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </ShadcnButton>
              <ShadcnButton type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting
                  ? 'Saving…'
                  : isEdit
                    ? 'Save changes'
                    : 'Create job'}
              </ShadcnButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

/** @deprecated Use `open` / `onOpenChange` props instead */
export function CreateJobModalLegacy({
  isOpen,
  onClose,
  onSubmit,
  job,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: JobFormValues) => void
  job?: Job | null
}) {
  return (
    <CreateJobModal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      onSubmit={onSubmit}
      job={job}
    />
  )
}
