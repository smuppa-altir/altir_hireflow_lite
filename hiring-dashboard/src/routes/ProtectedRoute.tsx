import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { LoadingScreen } from '@/components/common'
import { useAuth } from '@/hooks'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}
