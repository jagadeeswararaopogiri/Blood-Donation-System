import axios, { type InternalAxiosRequestConfig } from 'axios'
import { clearAuthStorage } from './authStorage'

function requestHadAuthorization(config: InternalAxiosRequestConfig | undefined): boolean {
  if (!config?.headers) return false
  const h = config.headers
  const auth =
    typeof h.get === 'function'
      ? h.get('Authorization')
      : (h as Record<string, unknown>)['Authorization'] ?? (h as Record<string, unknown>)['authorization']
  return Boolean(auth)
}

function isAuthPublicPath(config: InternalAxiosRequestConfig | undefined): boolean {
  const path = `${config?.baseURL ?? ''}${config?.url ?? ''}`
  return path.includes('/auth/login') || path.includes('/auth/register')
}

/** Default: `/api` — use Vite dev proxy to Spring Boot on :8080 (see vite.config.ts). Override with VITE_API_BASE_URL. */
const baseURL = import.meta.env.VITE_API_BASE_URL?.trim() || '/api'

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

api.interceptors.request.use((config) => {
  const m = config.method?.toLowerCase()
  if (m === 'get' || m === 'head') {
    const h = config.headers
    if (h && typeof h.delete === 'function') {
      h.delete('Content-Type')
    }
  }
  if (isAuthPublicPath(config)) {
    const h = config.headers
    if (h && typeof h.delete === 'function') {
      h.delete('Authorization')
    } else if (h) {
      delete (h as Record<string, unknown>).Authorization
      delete (h as Record<string, unknown>).authorization
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const hadAuth = requestHadAuthorization(err.config)
    if (status === 401 && hadAuth && !isAuthPublicPath(err.config)) {
      clearAuthStorage()
      setAuthToken(null)
      const path = window.location.pathname
      if (path !== '/login' && path !== '/register') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(err)
  },
)
