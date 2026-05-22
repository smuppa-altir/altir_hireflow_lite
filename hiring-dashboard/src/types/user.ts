export type UserRole = 'admin' | 'recruiter' | 'hiring_manager' | 'interviewer' | 'viewer'

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  role: UserRole
  department?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
