import { useState } from 'react'
import { TabPanel, Tabs, type TabItem } from '@/components/ui/Tabs'
import type { CandidateDetail } from '@/types/candidateDetail'
import { CandidateFeedbackTab } from './CandidateFeedbackTab'
import { CandidateOverviewTab } from './CandidateOverviewTab'
import { CandidateTimelineTab } from './CandidateTimelineTab'
import { cn } from '@/utils'

interface CandidateDetailContentProps {
  candidate: CandidateDetail
}

type TabId = 'overview' | 'feedback' | 'timeline'

export function CandidateDetailContent({ candidate }: CandidateDetailContentProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'feedback', label: 'Feedback', count: candidate.feedback.length },
    { id: 'timeline', label: 'Timeline', count: candidate.timeline.length },
  ]

  return (
    <div className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:shadow-none">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
        className={cn('border-zinc-200 px-4 pt-2 dark:border-zinc-800')}
      />

      <div className="p-5 sm:p-6">
        {activeTab === 'overview' && (
          <TabPanel>
            <CandidateOverviewTab candidate={candidate} />
          </TabPanel>
        )}
        {activeTab === 'feedback' && (
          <TabPanel>
            <CandidateFeedbackTab candidate={candidate} />
          </TabPanel>
        )}
        {activeTab === 'timeline' && (
          <TabPanel>
            <CandidateTimelineTab candidate={candidate} />
          </TabPanel>
        )}
      </div>
    </div>
  )
}
