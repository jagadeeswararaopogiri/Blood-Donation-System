import { useEffect, useMemo, useState } from 'react'
import { isAxiosError } from 'axios'
import { api } from '../../lib/api'
import { getApiErrorMessage } from '../../lib/getApiErrorMessage'
import type { BloodGroup, DonorProfileDto, RequestDto } from '../../lib/types'
import { BLOOD_GROUPS } from '../../lib/constants'
import { requestStatusBadgeClass } from '../../lib/requestStatusBadge'
import {
  alertBox,
  btnGhost,
  btnPrimary,
  btnSmall,
  card,
  fieldControl,
  fieldLabel,
  fieldRoot,
  grid2,
  h2,
  h3,
  muted,
  pageHeader,
  rowFlex,
  stack,
  tableRowBody,
  tableRowHead,
  tableWrap,
} from '../../lib/uiClassNames'

type ProfileForm = {
  bloodGroup: BloodGroup
  location: string
  phone: string
  availability: boolean
}

export default function DonorDashboard() {
  const [profile, setProfile] = useState<DonorProfileDto | null>(null)
  const [incoming, setIncoming] = useState<RequestDto[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  /** Blocks double-clicks while a request action is in flight */
  const [requestActionPending, setRequestActionPending] = useState(false)

  const [form, setForm] = useState<ProfileForm>({
    bloodGroup: 'O_POS',
    location: '',
    phone: '',
    availability: true,
  })

  const formValid = useMemo(() => form.location.trim().length > 0 && form.phone.trim().length > 0, [form.location, form.phone])

  async function refresh() {
    setError(null)
    try {
      const [incomingRes] = await Promise.all([api.get<RequestDto[]>('/requests/incoming')])
      setIncoming(incomingRes.data)
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to load requests'))
    }
  }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const profileRes = await api.get<DonorProfileDto>('/donors/me')
        setProfile(profileRes.data)
        setForm({
          bloodGroup: profileRes.data.bloodGroup,
          location: profileRes.data.location,
          phone: profileRes.data.phone,
          availability: profileRes.data.availability,
        })
      } catch (err: unknown) {
        if (!isAxiosError(err) || err.response?.status !== 404) {
          setError(getApiErrorMessage(err, 'Failed to load profile'))
        }
      } finally {
        setLoading(false)
      }
      await refresh()
    })()
  }, [])

  async function saveProfile() {
    setSaving(true)
    setError(null)
    try {
      const res = await api.put<DonorProfileDto>('/donors/me', {
        bloodGroup: form.bloodGroup,
        location: form.location,
        phone: form.phone,
        availability: form.availability,
      })
      setProfile(res.data)
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to save profile'))
    } finally {
      setSaving(false)
    }
  }

  async function act(id: number, action: 'accept' | 'reject' | 'complete') {
    setError(null)
    setRequestActionPending(true)
    try {
      await api.patch(`/requests/${id}/${action}`, {})
      await refresh()
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Action failed'))
    } finally {
      setRequestActionPending(false)
    }
  }

  return (
    <div className={stack}>
      <div className={pageHeader}>
        <div>
          <h2 className={h2}>Donor Dashboard</h2>
          <p className={muted}>Maintain your availability and respond to requests.</p>
        </div>
      </div>

      {error && <div className={`${alertBox} box-border w-full max-w-[640px]`}>{error}</div>}

      <section className={card}>
        <h3 className={h3}>My donor profile</h3>
        {loading ? (
          <p className={muted}>Loading…</p>
        ) : (
          <div className={grid2}>
            <label className={fieldRoot}>
              <span className={fieldLabel}>Blood group</span>
              <select
                className={fieldControl}
                value={form.bloodGroup}
                onChange={(e) => setForm((f) => ({ ...f, bloodGroup: e.target.value as BloodGroup }))}
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg.value} value={bg.value}>
                    {bg.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={fieldRoot}>
              <span className={fieldLabel}>Location</span>
              <input
                className={fieldControl}
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Chennai"
              />
            </label>
            <label className={fieldRoot}>
              <span className={fieldLabel}>Phone</span>
              <input
                className={fieldControl}
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="e.g. 9876543210"
              />
            </label>
            <label className={fieldRoot}>
              <span className={fieldLabel}>Availability</span>
              <select
                className={fieldControl}
                value={form.availability ? 'YES' : 'NO'}
                onChange={(e) => setForm((f) => ({ ...f, availability: e.target.value === 'YES' }))}
              >
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </label>

            <div className={`${rowFlex} col-span-full max-md:col-span-1`}>
              <button type="button" className={btnPrimary} disabled={!formValid || saving} onClick={saveProfile}>
                {saving ? 'Saving…' : profile ? 'Update profile' : 'Save profile'}
              </button>
              {profile?.lastDonationDate && <span className={muted}>Last donation: {profile.lastDonationDate}</span>}
            </div>
          </div>
        )}
      </section>

      <section className={card}>
        <h3 className={h3}>Incoming requests</h3>
        {incoming.length === 0 ? (
          <p className={muted}>No requests yet.</p>
        ) : (
          <div className={tableWrap}>
            <div className={tableRowHead}>
              <div>Receiver</div>
              <div>Status</div>
              <div>Requested</div>
              <div>Action</div>
            </div>
            {incoming.map((r) => (
              <div className={tableRowBody} key={r.id}>
                <div>
                  <div className="font-semibold">{r.receiverName}</div>
                  {r.note && <div className={`${muted} text-xs`}>{r.note}</div>}
                </div>
                <div>
                  <span className={requestStatusBadgeClass(r.status)}>{r.status}</span>
                </div>
                <div className={`${muted} text-xs`}>{new Date(r.requestedAt).toLocaleString()}</div>
                <div className={rowFlex}>
                  {r.status === 'PENDING' && (
                    <>
                      <button
                        type="button"
                        className={`${btnPrimary} ${btnSmall}`}
                        disabled={requestActionPending}
                        onClick={() => act(r.id, 'accept')}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className={`${btnGhost} ${btnSmall}`}
                        disabled={requestActionPending}
                        onClick={() => act(r.id, 'reject')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {r.status === 'ACCEPTED' && (
                    <button
                      type="button"
                      className={`${btnPrimary} ${btnSmall}`}
                      disabled={requestActionPending}
                      onClick={() => act(r.id, 'complete')}
                    >
                      Mark Completed
                    </button>
                  )}
                  {(r.status === 'REJECTED' || r.status === 'COMPLETED') && <span className={`${muted} text-xs`}>—</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
