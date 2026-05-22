import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { Button, Input } from '@/components/ui'
import { useAuth } from '@/hooks'

export function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.DASHBOARD

  const [email, setEmail] = useState('alex@hireflow.io')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (authLoading) return null
  if (isAuthenticated) return <Navigate to={from} replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Welcome back
      </h1>
      <p className="mt-1 text-sm text-zinc-500">Sign in to your HireFlow account</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          label="Email"
          labelRequired
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          labelRequired
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-zinc-400">
        Demo: use any email and password to sign in
      </p>
    </div>
  )
}
