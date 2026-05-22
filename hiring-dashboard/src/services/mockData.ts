import { JOBS_MOCK_DATA } from '@/components/jobs/jobsMockData'
import type { Interview, User } from '@/types'

export const MOCK_JOBS = JOBS_MOCK_DATA

export const MOCK_USER: User = {
  id: 'user-1',
  email: 'admin@hireflow.io',
  name: 'Alex Morgan',
  role: 'admin',
}

export const MOCK_DASHBOARD_STATS = {
  openJobs: 12,
  totalCandidates: 248,
  interviewsThisWeek: 8,
  offersPending: 8,
  hiredThisMonth: 34,
  avgTimeToHire: 28,
}

export const MOCK_INTERVIEWS: Interview[] = [
  {
    id: 'int-1',
    candidateId: 'cand-1',
    candidateName: 'Maya Chen',
    candidateEmail: 'maya.chen@email.com',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Engineer',
    interviewerId: 'user-2',
    interviewerName: 'Jordan Lee',
    interviewerEmail: 'recruiter@hireflow.io',
    round: 'technical',
    status: 'scheduled',
    scheduledAt: '2026-05-22T15:00:00.000Z',
    durationMinutes: 60,
    meetingType: 'virtual',
    meetingLink: 'https://meet.example.com/maya-chen-tech',
    notes: 'Focus on React system design.',
    candidateInstructions: 'Please join 5 minutes early and have your IDE ready.',
  },
  {
    id: 'int-2',
    candidateId: 'cand-2',
    candidateName: 'David Okonkwo',
    candidateEmail: 'david.o@email.com',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Engineer',
    interviewerId: 'user-2',
    interviewerName: 'Jordan Lee',
    interviewerEmail: 'recruiter@hireflow.io',
    round: 'screening',
    status: 'scheduled',
    scheduledAt: '2026-05-23T17:00:00.000Z',
    durationMinutes: 30,
    meetingType: 'virtual',
    meetingLink: 'https://meet.example.com/david-screen',
  },
  {
    id: 'int-3',
    candidateId: 'cand-3',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma@email.com',
    jobId: 'job-2',
    jobTitle: 'Product Designer',
    interviewerId: 'user-3',
    interviewerName: 'Sam Patel',
    interviewerEmail: 'interviewer@hireflow.io',
    round: 'final',
    status: 'completed',
    scheduledAt: '2026-05-17T14:00:00.000Z',
    durationMinutes: 90,
    meetingType: 'in_person',
    location: 'HQ — Conference Room B',
    notes: 'Strong portfolio review. Recommended for offer.',
  },
]
