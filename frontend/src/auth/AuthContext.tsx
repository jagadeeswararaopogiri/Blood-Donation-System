import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, setAuthToken } from '../lib/api'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, clearAuthStorage } from '../lib/authStorage'
import type { AuthResponse, Role, UserDto } from '../lib/types'

type AuthState = {
  token: string | null
  user: UserDto | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  selectRole: (role: Role) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

function readStoredUser(): UserDto | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as UserDto
  } catch {
    localStorage.removeItem(AUTH_USER_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY))
  const [user, setUser] = useState<UserDto | null>(readStoredUser)

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      async login(email, password) {
        const res = await api.post<AuthResponse>('/auth/login', {
          email: email.trim().toLowerCase(),
          password,
        })
        setToken(res.data.token)
        setUser(res.data.user)
        localStorage.setItem(AUTH_TOKEN_KEY, res.data.token)
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.data.user))
      },
      async register(name, email, password) {
        const res = await api.post<AuthResponse>('/auth/register', {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        })
        setToken(res.data.token)
        setUser(res.data.user)
        localStorage.setItem(AUTH_TOKEN_KEY, res.data.token)
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.data.user))
      },
      async selectRole(role) {
        const res = await api.patch<UserDto>('/auth/role', { role })
        setUser(res.data)
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.data))
      },
      logout() {
        setToken(null)
        setUser(null)
        clearAuthStorage()
        setAuthToken(null)
      },
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
