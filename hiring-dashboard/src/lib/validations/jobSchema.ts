import { z } from 'zod'
import { JOB_EXPERIENCE_VALUES } from '@/constants'

export const jobFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Job title is required')
    .max(120, 'Job title must be 120 characters or less'),
  department: z
    .string()
    .min(1, 'Department is required')
    .max(80, 'Department must be 80 characters or less'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location must be 100 characters or less'),
  experience: z.enum(JOB_EXPERIENCE_VALUES, {
    message: 'Please select an experience level',
  }),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be 2000 characters or less'),
  status: z.enum(['draft', 'open', 'paused', 'closed'], {
    message: 'Please select a valid status',
  }),
})

export type JobFormValues = z.infer<typeof jobFormSchema>

export const jobFormDefaultValues: JobFormValues = {
  title: '',
  department: '',
  location: '',
  experience: '3-5 years',
  description: '',
  status: 'draft',
}
