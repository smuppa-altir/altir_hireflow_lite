import { PIPELINE_STAGE_COLORS, PIPELINE_STAGE_LABELS } from '@/constants'
import { Badge } from '@/components/ui'
import type { PipelineStage } from '@/types'
import { cn } from '@/utils'

export function CandidateStatusBadge({ stage }: { stage: PipelineStage }) {
  return (
    <Badge className={cn(PIPELINE_STAGE_COLORS[stage])} dot>
      {PIPELINE_STAGE_LABELS[stage]}
    </Badge>
  )
}
