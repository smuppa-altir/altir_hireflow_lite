import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-zinc-900 p-12 lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            HF
          </div>
          <span className="text-lg font-semibold text-white">HireFlow</span>
        </div>
        <div>
          <blockquote className="text-2xl font-medium leading-relaxed text-zinc-100">
            &ldquo;The best way to predict the future is to find right talent at right time for right work.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-zinc-400">— HireFlow Team</p>
        </div>
        <p className="text-xs text-zinc-500">© 2026 HireFlow. All rights reserved.</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            HF
          </div>
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">HireFlow</span>
        </div>
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
