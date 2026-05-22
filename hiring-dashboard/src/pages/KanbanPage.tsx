import { PageHeader } from '@/components/common'
import { KanbanBoard } from '@/components/kanban'

export function KanbanPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Kanban Board"
        description="Drag candidates through your hiring pipeline stages"
      />
      <KanbanBoard />
    </div>
  )
}
