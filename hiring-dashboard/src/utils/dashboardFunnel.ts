import { PIPELINE_STAGE_LABELS } from '@/constants/pipelineStages'
import type { PipelineStage } from '@/types/kanban'
import type { FunnelStageItem } from '@/services/dashboardService'

export interface StagePieSlice {
  name: string
  value: number
  color: string
}

const PIE_COLORS: Record<PipelineStage, string> = {
  applied: '#3b82f6',
  screening: '#f59e0b',
  technical_interview: '#8b5cf6',
  manager_round: '#6366f1',
  hr_round: '#06b6d4',
  offer: '#10b981',
  hired: '#22c55e',
  rejected: '#ef4444',
}

const API_TO_PIPELINE: Record<string, PipelineStage> = {
  applied: 'applied',
  screening: 'screening',
  technical: 'technical_interview',
  manager_round: 'manager_round',
  hr_round: 'hr_round',
  offer: 'offer',
  hired: 'hired',
  rejected: 'rejected',
}

/** Map API funnel rows to pie slices using the same stages as Kanban / list view */
export function funnelToPieData(rows: FunnelStageItem[]): StagePieSlice[] {
  const counts = new Map<PipelineStage, number>()

  for (const row of rows) {
    const key = row.stage.toLowerCase().replace(/-/g, '_')
    const stage = API_TO_PIPELINE[key]
    if (!stage) continue
    counts.set(stage, (counts.get(stage) ?? 0) + row.count)
  }

  return [...counts.entries()]
    .filter(([, value]) => value > 0)
    .map(([stage, value]) => ({
      name: PIPELINE_STAGE_LABELS[stage],
      value,
      color: PIE_COLORS[stage],
    }))
}
