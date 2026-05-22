import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BarChart3,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Columns3,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { Avatar } from '@/components/ui'
import { useAuth } from '@/hooks'
import { cn } from '@/utils'

export const SIDEBAR_WIDTH_EXPANDED = 260
export const SIDEBAR_WIDTH_COLLAPSED = 72

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

const navItems: NavItem[] = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: ROUTES.JOBS, label: 'Jobs', icon: Briefcase },
  { to: ROUTES.CANDIDATES, label: 'Candidates', icon: Users },
  { to: ROUTES.KANBAN, label: 'Kanban Board', icon: Columns3, end: true },
  { to: ROUTES.INTERVIEWS, label: 'Interviews', icon: Calendar, end: true },
  { to: ROUTES.FEEDBACK, label: 'Feedback', icon: MessageSquare, end: true },
  { to: ROUTES.REPORTS, label: 'Reports', icon: BarChart3, end: true },
  { to: ROUTES.ACTIVITY_LOG, label: 'Activity Log', icon: Activity, end: true },
  { to: ROUTES.SETTINGS, label: 'Settings', icon: Settings, end: true },
]

export interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  onNavigate?: () => void
  className?: string
}

export function Sidebar({ collapsed, onToggleCollapse, onNavigate, className }: SidebarProps) {
  const { user, logout } = useAuth()

  return (
    <aside
      style={{
        width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
      }}
      className={cn(
        'flex h-full flex-col border-r border-zinc-200 bg-white text-zinc-600',
        'dark:border-zinc-800/80 dark:bg-zinc-950 dark:text-zinc-300',
        'transition-[width] duration-300 ease-in-out',
        className,
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-zinc-200 dark:border-zinc-800/80',
          collapsed ? 'justify-center px-2' : 'gap-3 px-4',
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
          <span className="text-xs font-bold text-white">HF</span>
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
              HireFlow
            </p>
            <p className="truncate text-[11px] text-zinc-500">Recruitment</p>
          </div>
        )}
        {!collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-200"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="flex justify-center border-b border-zinc-200 py-2 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-200"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <nav
        className={cn(
          'flex-1 space-y-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-thin',
          collapsed ? 'px-2' : 'px-3',
        )}
        aria-label="Main navigation"
      >
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            Menu
          </p>
        )}
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center rounded-lg text-sm font-medium transition-all duration-200',
                collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-500/15 dark:text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    className={cn(
                      'absolute rounded-full bg-indigo-500',
                      collapsed
                        ? 'bottom-1 left-1/2 h-1 w-1 -translate-x-1/2'
                        : 'left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full',
                    )}
                  />
                )}
                <Icon
                  className={cn(
                    'h-[18px] w-[18px] shrink-0 transition-colors',
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300',
                  )}
                />
                {!collapsed && <span className="truncate">{label}</span>}
                {isActive && !collapsed && (
                  <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div
          className={cn(
            'shrink-0 border-t border-zinc-200 p-3 dark:border-zinc-800/80',
            collapsed && 'flex flex-col items-center gap-2',
          )}
        >
          <div
            className={cn(
              'flex items-center rounded-lg bg-zinc-50 dark:bg-zinc-900/50',
              collapsed ? 'justify-center p-2' : 'gap-3 p-2',
            )}
          >
            <Avatar name={user.name} src={user.avatarUrl} size="sm" />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {user.name}
                </p>
                <p className="truncate text-xs text-zinc-500">{user.email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                type="button"
                onClick={() => logout()}
                className="shrink-0 rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
          {collapsed && (
            <button
              type="button"
              onClick={() => logout()}
              title="Sign out"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </aside>
  )
}
