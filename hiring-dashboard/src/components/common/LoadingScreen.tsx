import { Spinner } from '@/components/ui'

export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
    </div>
  )
}
