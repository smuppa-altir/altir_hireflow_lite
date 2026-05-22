import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { STORAGE_KEYS } from '@/constants'
import { authService } from '@/services'
import type { LoginCredentials, User } from '@/types'
import { getStorageItem, removeStorageItem, setStorageItem } from '@/utils'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (!token) {
      setIsLoading(false)
      return
    }
    authService
      .getCurrentUser()
      .then(setUser)
      .catch(() => removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { user: loggedInUser, tokens } = await authService.login(credentials)
    setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken)
    if (tokens.refreshToken) {
      setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken)
    }
    setUser(loggedInUser)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN)
    removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
