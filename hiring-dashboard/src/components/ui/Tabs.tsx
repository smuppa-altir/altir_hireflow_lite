import type { ReactNode } from 'react'
import { cn } from '@/utils'

export interface TabItem {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        'flex gap-1 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800',
        className,
      )}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative flex shrink-0 items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300',
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-xs',
                activeTab === tab.id
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
              )}
            >
              {tab.count}
            </span>
          )}
          {activeTab === tab.id && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-indigo-500" />
          )}
        </button>
      ))}
    </div>
  )
}

export function TabPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('pt-4', className)}>{children}</div>
}
