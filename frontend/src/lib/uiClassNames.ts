/** Shared Tailwind class strings for auth + dashboard UI */

export const card =
  'w-full max-w-[640px] rounded-[18px] border border-white/12 bg-white/5 p-[18px] shadow-[0_18px_40px_rgba(0,0,0,0.35)]'

export const centerPage = 'grid min-h-screen place-items-center p-[18px]'

export const fieldRoot = 'grid gap-1.5 text-sm'

export const fieldLabel = 'text-white/65'

export const fieldControl =
  'rounded-xl border border-white/12 bg-[rgba(11,16,32,0.55)] px-3 py-2.5 text-white focus:outline focus:outline-2 focus:outline-[rgba(255,59,107,0.35)] focus:outline-offset-2'

export const btnPrimary =
  'cursor-pointer rounded-xl border border-white/12 bg-gradient-to-br from-[rgba(255,59,107,0.9)] to-[rgba(255,184,107,0.85)] px-3 py-2.5 font-bold text-[#120815] disabled:cursor-not-allowed disabled:opacity-60'

export const btnGhost =
  'cursor-pointer rounded-xl border border-white/12 bg-white/5 px-3 py-2.5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60'

export const btnSmall = 'px-2.5 py-2 text-sm rounded-[10px]'

export const alertBox =
  'rounded-[14px] border border-rose-400/35 bg-rose-500/10 px-3 py-2.5 text-white/90'

export const successBox =
  'rounded-[14px] border border-emerald-400/35 bg-emerald-500/10 px-3 py-2.5 text-white/90'

export const formGrid = 'mt-3.5 grid gap-3'

export const muted = 'text-white/65'

export const footerText = 'text-sm text-white/65'

export const stack = 'grid w-full justify-items-center gap-3.5'

export const pageHeader =
  'box-border flex w-full max-w-[640px] items-end justify-between'

export const rowFlex = 'flex items-center gap-2.5'

export const grid2 = 'grid grid-cols-2 gap-3 max-md:grid-cols-1'

export const h1 = 'mb-2 text-3xl'

export const h2 = 'text-2xl'

export const h3 = 'mb-3 text-base font-normal'

export const tableWrap = 'grid w-full overflow-hidden rounded-[14px] border border-white/12'

const donorCols = 'grid grid-cols-[1.2fr_0.7fr_0.9fr_1fr] gap-3 p-3 items-center'

export const tableRowHead = `${donorCols} border-t-0 bg-white/[0.04] text-xs uppercase tracking-wide text-white/65`

export const tableRowBody = `${donorCols} border-t border-white/12 bg-white/[0.03]`

const receiverDonorColsBase =
  'grid grid-cols-[1.2fr_0.6fr_0.9fr_0.9fr_0.7fr] gap-3 p-3 items-center'

export const receiverTableRowHead = `${receiverDonorColsBase} border-t-0 bg-white/[0.04] text-xs uppercase tracking-wide text-white/65`

export const receiverTableRowBody = `${receiverDonorColsBase} border-t border-white/12 bg-white/[0.03]`
