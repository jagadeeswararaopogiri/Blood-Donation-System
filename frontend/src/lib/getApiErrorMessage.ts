import { isAxiosError } from 'axios'

/**
 * Human-readable message from Axios/ Spring errors.
 * Spring Boot 3 often uses RFC 7807 `detail`; older errors use `message`.
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (!isAxiosError(err)) return fallback

  if (!err.response) {
    if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
      return 'Cannot reach the server. Start the backend on port 8080 (from the project folder: cd backend && .\\mvnw.cmd spring-boot:run), then try again.'
    }
    return err.message || fallback
  }

  const status = err.response.status
  const data = err.response.data

  if (typeof data === 'string' && data.trim()) return data

  if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>
    if (typeof o.message === 'string' && o.message) return o.message
    if (typeof o.detail === 'string' && o.detail) return o.detail
    const errors = o.errors
    if (Array.isArray(errors) && errors.length > 0) {
      const first = errors[0]
      if (first && typeof first === 'object') {
        const f = first as Record<string, unknown>
        if (typeof f.defaultMessage === 'string') return f.defaultMessage
      }
      if (typeof first === 'string') return first
    }
  }

  if (status === 401) return 'Invalid email or password.'
  if (status === 403) return 'You do not have permission for this action.'
  if (status === 404) return 'Not found.'
  if (status === 409) return 'Email already registered.'

  return fallback
}
