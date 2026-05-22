import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
  Sidebar,
} from '@/components/navigation/Sidebar'
import { useIsMobile } from '@/hooks'
import { cn } from '@/utils'
import { getStorageItem, setStorageItem } from '@/utils'

const SIDEBAR_COLLAPSED_KEY = 'hireflow_sidebar_collapsed'

export function AppLayout() {
  const isMobile = useIsMobile()
  const [collapsed, setCollapsed] = useState(() => getStorageItem(SIDEBAR_COLLAPSED_KEY) === 'true')
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED

  useEffect(() => {
    setStorageItem(SIDEBAR_COLLAPSED_KEY, String(collapsed))
  }, [collapsed])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const toggleCollapse = useCallback(() => setCollapsed((prev) => !prev), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Desktop — fixed left sidebar */}
      <div
        className="fixed inset-y-0 left-0 z-40 hidden lg:block"
        style={{ width: sidebarWidth }}
      >
        <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} className="h-screen" />
      </div>

      {/* Mobile — overlay drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60"
            onClick={closeMobile}
            aria-hidden
          />
          <div
            className="absolute inset-y-0 left-0 shadow-2xl"
            style={{ width: SIDEBAR_WIDTH_EXPANDED }}
          >
            <Sidebar
              collapsed={false}
              onToggleCollapse={toggleCollapse}
              onNavigate={closeMobile}
              className="h-full"
            />
          </div>
        </div>
      )}

      {/* Main column */}
      <div
        className="flex min-h-screen flex-col transition-[margin-left] duration-300 ease-in-out"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white/95 px-4 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/95 lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20">
              <span className="text-[10px] font-bold text-white">HF</span>
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">HireFlow</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Desktop top bar — collapse control */}
        <header className="sticky top-0 z-20 hidden h-12 shrink-0 items-center border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/80 lg:flex">
          <button
            type="button"
            onClick={toggleCollapse}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-200"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <>
                <PanelLeftOpen className="h-4 w-4" />
                Expand sidebar
              </>
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" />
                Collapse sidebar
              </>
            )}
          </button>
        </header>

        <main className={cn('flex-1 overflow-y-auto')}>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
