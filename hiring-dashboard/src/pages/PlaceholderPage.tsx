import type { LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/common'
import { Card } from '@/components/ui'

interface PlaceholderPageProps {
  title: string
  description: string
  icon: LucideIcon
}

export function PlaceholderPage({ title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <Card className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800">
          <Icon className="h-7 w-7 text-zinc-400" />
        </div>
        <p className="text-sm text-zinc-500">This section is ready for implementation.</p>
      </Card>
    </div>
  )
}
