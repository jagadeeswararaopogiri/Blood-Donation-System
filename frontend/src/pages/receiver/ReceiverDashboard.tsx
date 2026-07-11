import { useEffect, useMemo, useState } from 'react'
import { api } from '../../lib/api'
import { getApiErrorMessage } from '../../lib/getApiErrorMessage'
import type { BloodGroup, DonorProfileDto, RequestDto } from '../../lib/types'
import { BLOOD_GROUPS } from '../../lib/constants'
import { requestStatusBadgeClass } from '../../lib/requestStatusBadge'
import {
  alertBox,
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
  receiverTableRowBody,
  receiverTableRowHead,
  rowFlex,
  stack,
  successBox,
  tableRowBody,
  tableRowHead,
  tableWrap,
} from '../../lib/uiClassNames'

export default function ReceiverDashboard() {
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('')
  const [location, setLocation] = useState('')
  const [donors, setDonors] = useState<DonorProfileDto[]>([])
  const [outgoing, setOutgoing] = useState<RequestDto[]>([])
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [requestingDonorId, setRequestingDonorId] = useState<number | null>(null)

  const canSearch = useMemo(() => bloodGroup !== '' || location.trim().length > 0, [bloodGroup, location])

  async function loadOutgoing() {
    const res = await api.get<RequestDto[]>('/requests/outgoing')
    setOutgoing(res.data)
  }

  useEffect(() => {
    ;(async () => {
      try {
        await loadOutgoing()
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, 'Failed to load your requests'))
      }
    })()
  }, [])

  async function search() {
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const res = await api.get<DonorProfileDto[]>('/donors', {
        params: {
          bloodGroup: bloodGroup || undefined,
          location: location || undefined,
        },
      })
      setDonors(res.data)
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Search failed'))
    } finally {
      setLoading(false)
    }
  }

  async function requestBlood(donorUserId: number) {
    setError(null)
    setSuccess(null)
    setRequestingDonorId(donorUserId)
    try {
      await api.post('/requests', { donorUserId, note: note.trim() || undefined })
      await loadOutgoing()
      setSuccess('Request sent successfully.')
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Request failed'))
    } finally {
      setRequestingDonorId(null)
    }
  }

  return (
    <div className={stack}>
      <div className={pageHeader}>
        <div>
          <h2 className={h2}>Receiver Dashboard</h2>
          <p className={muted}>Search donors and send blood requests.</p>
        </div>
      </div>

      {error && <div className={`${alertBox} box-border w-full max-w-[640px]`}>{error}</div>}
      {success && <div className={`${successBox} box-border w-full max-w-[640px]`}>{success}</div>}

      <section className={card}>
        <h3 className={h3}>Search donors</h3>
        <div className={grid2}>
          <label className={fieldRoot}>
            <span className={fieldLabel}>Blood group</span>
            <select className={fieldControl} value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value as BloodGroup | '')}>
              <option value="">Any</option>
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Chennai"
            />
          </label>

          <label className={`${fieldRoot} col-span-full max-md:col-span-1`}>
            <span className={fieldLabel}>Request note (optional)</span>
            <input
              className={fieldControl}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Need O+ urgently for surgery"
            />
          </label>

          <div className={`${rowFlex} col-span-full max-md:col-span-1`}>
            <button type="button" className={btnPrimary} disabled={!canSearch || loading} onClick={search}>
              {loading ? 'Searching…' : 'Search'}
            </button>
          </div>
        </div>

        <div className="h-3" />

        {donors.length === 0 ? (
          <p className={muted}>No results yet.</p>
        ) : (
          <div className={tableWrap}>
            <div className={receiverTableRowHead}>
              <div>Donor</div>
              <div>Blood</div>
              <div>Location</div>
              <div>Phone</div>
              <div>Action</div>
            </div>
            {donors.map((d) => (
              <div className={receiverTableRowBody} key={d.userId}>
                <div className="font-semibold">{d.name}</div>
                <div>{BLOOD_GROUPS.find((x) => x.value === d.bloodGroup)?.label ?? d.bloodGroup}</div>
                <div>{d.location}</div>
                <div className="font-mono text-sm">{d.phone}</div>
                <div>
                  <button
                    type="button"
                    className={`${btnPrimary} ${btnSmall}`}
                    disabled={requestingDonorId !== null}
                    onClick={() => requestBlood(d.userId)}
                  >
                    {requestingDonorId === d.userId ? 'Sending…' : 'Request Blood'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={card}>
        <h3 className={h3}>My requests</h3>
        {outgoing.length === 0 ? (
          <p className={muted}>No requests yet.</p>
        ) : (
          <div className={tableWrap}>
            <div className={tableRowHead}>
              <div>Donor</div>
              <div>Status</div>
              <div>Requested</div>
              <div>Note</div>
            </div>
            {outgoing.map((r) => (
              <div className={tableRowBody} key={r.id}>
                <div className="font-semibold">{r.donorName}</div>
                <div>
                  <span className={requestStatusBadgeClass(r.status)}>{r.status}</span>
                </div>
                <div className={`${muted} text-xs`}>{new Date(r.requestedAt).toLocaleString()}</div>
                <div className={`${muted} text-xs`}>{r.note ?? '—'}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
