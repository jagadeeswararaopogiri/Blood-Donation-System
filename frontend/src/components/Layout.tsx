import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { btnGhost } from '../lib/uiClassNames'

export default function Layout() {
  const { user, logout, selectRole } = useAuth()
  const nav = useNavigate()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-white/12 bg-[rgba(11,16,32,0.55)] px-[18px] py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div
            className="h-[34px] w-[34px] shrink-0 rounded-xl bg-gradient-to-br from-[#ff3b6b] to-[#ffb86b] shadow-[0_12px_24px_rgba(255,59,107,0.25)]"
            aria-hidden
          />
          <div>
            <div className="font-bold tracking-wide">Blood Donation</div>
            <div className="text-xs text-white/65">React + Spring Boot + MySQL</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          {user && (
            <div className="flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 px-2.5 py-2" title={user.email}>
              <span className="font-semibold">{user.name}</span>
              <select
                className="rounded-full border border-white/12 bg-white/5 px-2 py-1 text-xs text-white"
                value={user.role ?? ''}
                onChange={async (e) => {
                  const nextRole = e.target.value as 'DONOR' | 'RECEIVER'
                  await selectRole(nextRole)
                  nav(nextRole === 'DONOR' ? '/donor' : '/receiver')
                }}
              >
                <option value="DONOR">DONOR</option>
                <option value="RECEIVER">RECEIVER</option>
              </select>
            </div>
          )}
          <button
            className={btnGhost}
            onClick={() => {
              logout()
              nav('/login')
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="box-border flex w-full flex-1 flex-col items-center px-[18px] py-[18px]">
        <main className="box-border w-full max-w-[1100px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
