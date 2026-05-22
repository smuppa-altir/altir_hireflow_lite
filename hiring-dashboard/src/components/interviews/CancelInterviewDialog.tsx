import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { Textarea } from '@/components/ui/textarea'
import {
  cancelInterviewSchema,
  type CancelInterviewFormValues,
} from '@/lib/validations/interviewSchema'
import type { Interview } from '@/types/interview'

interface CancelInterviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  interview: Interview | null
  onConfirm: (values: CancelInterviewFormValues) => void | Promise<void>
  isSubmitting?: boolean
}

const defaults: CancelInterviewFormValues = {
  reason: '',
  sendEmailToCandidate: true,
  sendEmailToInterviewer: true,
}

export function CancelInterviewDialog({
  open,
  onOpenChange,
  interview,
  onConfirm,
  isSubmitting,
}: CancelInterviewDialogProps) {
  const form = useForm<CancelInterviewFormValues>({
    resolver: zodResolver(cancelInterviewSchema),
    defaultValues: defaults,
  })

  const handleOpenChange = (next: boolean) => {
    if (!next) form.reset(defaults)
    onOpenChange(next)
  }

  const onSubmit = async (values: CancelInterviewFormValues) => {
    await onConfirm(values)
    form.reset(defaults)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel interview</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this interview
            {interview ? ` with ${interview.candidateName}` : ''}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for cancellation *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Explain why this interview is being cancelled"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
              <FormField
                control={form.control}
                name="sendEmailToCandidate"
                render={({ field }) => (
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-zinc-300 text-indigo-600"
                    />
                    Send email to candidate
                  </label>
                )}
              />
              <FormField
                control={form.control}
                name="sendEmailToInterviewer"
                render={({ field }) => (
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-zinc-300 text-indigo-600"
                    />
                    Send email to interviewer
                  </label>
                )}
              />
            </div>

            <DialogFooter>
              <ShadcnButton type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Keep interview
              </ShadcnButton>
              <ShadcnButton type="submit" variant="destructive" disabled={isSubmitting}>
                {isSubmitting ? 'Cancelling…' : 'Cancel interview'}
              </ShadcnButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
