import type { RequestStatus } from './types'

const BADGE_BY_STATUS: Record<RequestStatus, string> = {
  PENDING:
    'inline-flex rounded-full border border-amber-300/25 bg-amber-400/10 px-2.5 py-1 text-xs',
  ACCEPTED:
    'inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-xs',
  REJECTED:
    'inline-flex rounded-full border border-rose-400/25 bg-rose-400/10 px-2.5 py-1 text-xs',
  COMPLETED:
    'inline-flex rounded-full border border-white/16 bg-white/[0.08] px-2.5 py-1 text-xs',
}

export function requestStatusBadgeClass(status: RequestStatus): string {
  return BADGE_BY_STATUS[status]
}
