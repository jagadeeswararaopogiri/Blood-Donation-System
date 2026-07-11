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

export default function RegisterPage() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className={centerPage}>
      <div className={card}>
        <h1 className={h1}>Register</h1>
        <p className={muted}>Create your account. You can choose role after login.</p>

        <form
          className={formGrid}
          onSubmit={async (e) => {
            e.preventDefault()
            setError(null)
            setLoading(true)
            try {
              await register(name, email, password)
              nav('/')
            } catch (err: unknown) {
              setError(getApiErrorMessage(err, 'Registration failed'))
            } finally {
              setLoading(false)
            }
          }}
        >
          <label className={fieldRoot}>
            <span className={fieldLabel}>Name</span>
            <input className={fieldControl} value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label className={fieldRoot}>
            <span className={fieldLabel}>Email</span>
            <input className={fieldControl} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>

          <label className={fieldRoot}>
            <span className={fieldLabel}>Password (min 6)</span>
            <input
              className={fieldControl}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              minLength={6}
              required
            />
          </label>

          {error && <div className={alertBox}>{error}</div>}

          <button className={btnPrimary} type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </button>

          <div className={footerText}>
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
