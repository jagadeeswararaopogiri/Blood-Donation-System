import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getApiErrorMessage } from '../lib/getApiErrorMessage'
import {
  alertBox,
  btnPrimary,
  card,
  centerPage,
  fieldControl,
  fieldLabel,
  fieldRoot,
  footerText,
  formGrid,
  h1,
  muted,
} from '../lib/uiClassNames'

export default function LoginPage() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className={centerPage}>
      <div className={card}>
        <h1 className={h1}>Login</h1>
        <p className={muted}>Access your donor/receiver dashboard.</p>

        <form
          className={formGrid}
          onSubmit={async (e) => {
            e.preventDefault()
            setError(null)
            setLoading(true)
            try {
              await login(email, password)
              nav('/')
            } catch (err: unknown) {
              setError(getApiErrorMessage(err, 'Login failed'))
            } finally {
              setLoading(false)
            }
          }}
        >
          <label className={fieldRoot}>
            <span className={fieldLabel}>Email</span>
            <input className={fieldControl} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>

          <label className={fieldRoot}>
            <span className={fieldLabel}>Password</span>
            <input className={fieldControl} value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </label>

          {error && <div className={alertBox}>{error}</div>}

          <button className={btnPrimary} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>

          <div className={footerText}>
            Don’t have an account? <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
