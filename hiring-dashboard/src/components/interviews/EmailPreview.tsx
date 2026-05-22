import { useMemo, useState } from 'react'
import { TabPanel, Tabs } from '@/components/ui'
import type { Interview } from '@/types/interview'
import {
  buildCandidateEmailPreview,
  buildInterviewerEmailPreview,
} from '@/utils/interviewEmailTemplates'

interface EmailPreviewProps {
  interview: Pick<
    Interview,
    | 'candidateName'
    | 'jobTitle'
    | 'round'
    | 'scheduledAt'
    | 'durationMinutes'
    | 'meetingType'
    | 'meetingLink'
    | 'location'
    | 'interviewerName'
    | 'candidateInstructions'
    | 'notes'
  >
}

export function EmailPreview({ interview }: EmailPreviewProps) {
  const [tab, setTab] = useState('candidate')
  const candidateEmail = useMemo(() => buildCandidateEmailPreview(interview), [interview])
  const interviewerEmail = useMemo(() => buildInterviewerEmailPreview(interview), [interview])

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/40">
      <Tabs
        className="px-3 pt-3"
        tabs={[
          { id: 'candidate', label: 'Candidate Email' },
          { id: 'interviewer', label: 'Interviewer Email' },
        ]}
        activeTab={tab}
        onChange={setTab}
      />
      <TabPanel className="px-4 pb-4">
        {tab === 'candidate' ? (
          <EmailBlock subject={candidateEmail.subject} body={candidateEmail.body} />
        ) : (
          <EmailBlock subject={interviewerEmail.subject} body={interviewerEmail.body} />
        )}
      </TabPanel>
    </div>
  )
}

function EmailBlock({ subject, body }: { subject: string; body: string }) {
  return (
    <div className="space-y-3 text-sm">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Subject</p>
        <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{subject}</p>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Body</p>
        <pre className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white p-3 font-sans text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          {body}
        </pre>
      </div>
    </div>
  )
}
