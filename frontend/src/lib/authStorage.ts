/** Keys and helpers shared by AuthContext and API interceptors (avoid circular imports). */

export const AUTH_TOKEN_KEY = 'bd_token'
export const AUTH_USER_KEY = 'bd_user'

export function clearAuthStorage() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}
