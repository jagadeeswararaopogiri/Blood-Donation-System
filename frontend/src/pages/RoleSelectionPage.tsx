import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { Role } from '../lib/types'
import { getApiErrorMessage } from '../lib/getApiErrorMessage'
import { alertBox, btnGhost, btnPrimary, card, centerPage, h1, muted, rowFlex } from '../lib/uiClassNames'

export default function RoleSelectionPage() {
  const { selectRole } = useAuth()
  const nav = useNavigate()
  const [loading, setLoading] = useState<Role | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSelect(role: Role) {
    setError(null)
    setLoading(role)
    try {
      await selectRole(role)
      nav(role === 'DONOR' ? '/donor' : '/receiver', { replace: true })
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to set role'))
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className={centerPage}>
      <div className={card}>
        <h1 className={h1}>Select Active Role</h1>
        <p className={muted}>Choose your active role. You can switch anytime from dashboard.</p>

        {error && <div className={alertBox}>{error}</div>}

        <div className={`${rowFlex} mt-4`}>
          <button className={btnPrimary} disabled={loading !== null} onClick={() => handleSelect('DONOR')}>
            {loading === 'DONOR' ? 'Switching…' : 'Continue as Donor'}
          </button>
          <button className={btnGhost} disabled={loading !== null} onClick={() => handleSelect('RECEIVER')}>
            {loading === 'RECEIVER' ? 'Switching…' : 'Continue as Receiver'}
          </button>
        </div>
      </div>
    </div>
  )
}
