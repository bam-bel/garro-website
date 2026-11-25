import { useId, useState, type CSSProperties, type ReactNode } from 'react'

// Garro's own glass dashboard. Frosted panels (backdrop-filter) over a background image.
// No chart library: the chart is a small hand-drawn SVG. No network calls.

export interface WorkspaceTransaction {
  id: string
  name: string
  category: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
}

export interface WorkspaceGoal {
  id: string
  name: string
  saved: number
  target: number
  color?: string
  /** 'count' shows plain numbers (for example members); default shows money. */
  unit?: 'currency' | 'count'
}

export interface WorkspaceCashFlowPeriod {
  id: string
  label: string
  description: string
  points: { label: string; income: number; expenses: number }[]
}

export interface GlassSettings {
  /** blur radius in px */
  blur?: number
  /** panel fill opacity, 0 to 1 */
  opacity?: number
  /** backdrop saturation in percent */
  saturation?: number
  /** border colour */
  edge?: string
  /** panel tint as "r,g,b" */
  tint?: string
}

export interface WorkspaceLabels {
  balanceTitle: string
  periodSwitchLabel: string
  cashFlowTitle: string
  income: string
  expenses: string
  transactionsTitle: string
  goalsTitle: string
  sampleBadge: string
  statusPaid: string
  statusPending: string
  statusFailed: string
  /** accessible name of the whole dashboard */
  regionLabel: string
}

const defaultLabels: WorkspaceLabels = {
  balanceTitle: 'Balance',
  periodSwitchLabel: 'Time range',
  cashFlowTitle: 'Cash flow',
  income: 'Income',
  expenses: 'Expenses',
  transactionsTitle: 'Recent activity',
  goalsTitle: 'Goals',
  sampleBadge: 'Sample data',
  statusPaid: 'Paid',
  statusPending: 'Pending',
  statusFailed: 'Failed',
  regionLabel: 'Dashboard',
}

export interface GlassWorkspaceProps {
  brand: ReactNode
  userName: string
  balance: number
  balanceChange: { percent: number; label: string }
  account: { name: string; lastFour: string }
  periodLabel: string
  cashFlowPeriods: WorkspaceCashFlowPeriod[]
  initialPeriodId?: string
  footerNote?: string
  savingsNote?: string
  transactions: WorkspaceTransaction[]
  goals: WorkspaceGoal[]
  backgroundImage?: string
  glass?: GlassSettings
  style?: CSSProperties
  labels?: Partial<WorkspaceLabels>
  /** text added after every amount, for example "birr" or "ETB" */
  currency?: string
  /** number format locale, for example "am-ET" */
  locale?: string
}

const GOLD = '#e3a94b'
const TEAL = '#5a9099'

export default function GlassWorkspace({
  brand,
  userName,
  balance,
  balanceChange,
  account,
  periodLabel,
  cashFlowPeriods,
  initialPeriodId,
  footerNote,
  savingsNote,
  transactions,
  goals,
  backgroundImage,
  glass,
  style,
  labels,
  currency = '',
  locale,
}: GlassWorkspaceProps) {
  const L = { ...defaultLabels, ...labels }
  const g = { blur: 22, opacity: 0.42, saturation: 140, edge: 'rgba(255,255,255,0.14)', tint: '12,15,14', ...glass }
  const [periodId, setPeriodId] = useState(initialPeriodId ?? cashFlowPeriods[0]?.id)
  const period = cashFlowPeriods.find((p) => p.id === periodId) ?? cashFlowPeriods[0]
  const tabsId = useId()

  const num = (n: number) => n.toLocaleString(locale, { maximumFractionDigits: 0 })
  const money = (n: number) => (currency ? `${num(n)} ${currency}` : num(n))

  const panel: CSSProperties = {
    background: `rgba(${g.tint},${g.opacity})`,
    backdropFilter: `blur(${g.blur}px) saturate(${g.saturation}%)`,
    WebkitBackdropFilter: `blur(${g.blur}px) saturate(${g.saturation}%)`,
    border: `1px solid ${g.edge}`,
    boxShadow: '0 20px 40px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
  }

  const statusText = { paid: L.statusPaid, pending: L.statusPending, failed: L.statusFailed }
  const statusColor = { paid: '#34d399', pending: GOLD, failed: '#e8705f' }
  const statusMark = { paid: '✓', pending: '…', failed: '!' }

  const rootStyle: CSSProperties = {
    backgroundColor: '#0c0f0e',
    backgroundImage: backgroundImage
      ? `linear-gradient(180deg, rgba(5,7,6,0.55), rgba(5,7,6,0.8)), url("${backgroundImage}")`
      : 'radial-gradient(circle at 20% 0%, rgba(90,144,153,0.35), transparent 55%), radial-gradient(circle at 90% 100%, rgba(212,147,58,0.3), transparent 50%), linear-gradient(160deg,#101a18,#0a0f0e)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    ...style,
  }

  return (
    <div
      role="group"
      aria-label={L.regionLabel}
      className="relative grid gap-4 overflow-hidden rounded-[32px] p-3 text-white sm:p-5 lg:grid-cols-[230px_1fr] lg:rounded-panel lg:p-6"
      style={rootStyle}
    >
      {/* rail: stacked top bar on phones, left rail from 1024px */}
      <aside className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] p-4 lg:flex-col lg:items-stretch lg:justify-start lg:gap-6 lg:p-5" style={panel}>
        <div className="font-display text-xl font-semibold text-cream">{brand}</div>
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold font-display font-semibold text-on-gold">
            {Array.from(userName)[0]}
          </span>
          <span className="text-sm text-white/85">{userName}</span>
        </div>
        <div className="text-sm text-white/70 lg:mt-auto">
          <div>{account.name}</div>
          <div className="mt-0.5 tracking-widest" dir="ltr">
            •••• {account.lastFour}
          </div>
        </div>
      </aside>

      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        {/* main figure */}
        <section className="rounded-[24px] p-5 sm:p-6 md:col-span-2" style={panel} aria-labelledby={`${tabsId}-bal`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 id={`${tabsId}-bal`} className="text-base font-semibold text-white/85 sm:text-lg">
              {L.balanceTitle}
            </h3>
            <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-cream">{periodLabel}</span>
          </div>
          <p className="mt-3 font-display text-[2rem] leading-tight font-semibold text-cream sm:text-5xl">{money(balance)}</p>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/75">
            <span className="rounded-md px-2 py-0.5 font-semibold" style={{ background: 'rgba(52,211,153,0.16)', color: '#34d399' }} dir="ltr">
              {balanceChange.percent >= 0 ? '+' : '−'}
              {Math.abs(balanceChange.percent)}%
            </span>
            <span>{balanceChange.label}</span>
          </p>
        </section>

        {/* chart */}
        <section className="rounded-[24px] p-5 sm:p-6 md:col-span-2" style={panel} aria-labelledby={`${tabsId}-cf`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 id={`${tabsId}-cf`} className="text-base font-semibold text-white/85 sm:text-lg">
              {L.cashFlowTitle}
            </h3>
            <div role="group" aria-label={L.periodSwitchLabel} className="flex gap-1 rounded-xl bg-black/30 p-1">
              {cashFlowPeriods.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={p.id === period?.id}
                  onClick={() => setPeriodId(p.id)}
                  className={`min-h-11 min-w-16 rounded-lg px-3 text-sm font-semibold transition-colors duration-200 ${
                    p.id === period?.id ? 'bg-cream text-ink' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {period && <Chart period={period} labels={L} money={money} />}
        </section>

        {/* rows */}
        <section className="rounded-[24px] p-5 sm:p-6" style={panel} aria-labelledby={`${tabsId}-tx`}>
          <h3 id={`${tabsId}-tx`} className="text-base font-semibold text-white/85 sm:text-lg">
            {L.transactionsTitle}
          </h3>
          <ul className="mt-3 divide-y divide-white/10">
            {transactions.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{t.name}</p>
                  <p className="truncate text-xs text-white/65">
                    {t.category} · {t.date}
                  </p>
                </div>
                <div className="shrink-0 text-end">
                  <p className="text-sm font-semibold text-cream">{money(t.amount)}</p>
                  <p className="text-xs font-semibold" style={{ color: statusColor[t.status] }}>
                    <span aria-hidden="true">{statusMark[t.status]} </span>
                    {statusText[t.status]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* progress bars */}
        <section className="flex flex-col rounded-[24px] p-5 sm:p-6" style={panel} aria-labelledby={`${tabsId}-goals`}>
          <h3 id={`${tabsId}-goals`} className="text-base font-semibold text-white/85 sm:text-lg">
            {L.goalsTitle}
          </h3>
          <ul className="mt-4 grid gap-5">
            {goals.map((goal) => {
              const pct = goal.target > 0 ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0
              const fmt = goal.unit === 'count' ? num : money
              return (
                <li key={goal.id}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-white/90">{goal.name}</span>
                    <span className="shrink-0 font-semibold text-cream" dir="ltr">
                      {fmt(goal.saved)} / {fmt(goal.target)}
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={goal.name}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pct}
                    aria-valuetext={`${pct}%`}
                    className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/15"
                  >
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: goal.color ?? GOLD, transition: 'width 300ms cubic-bezier(0.4,0,0.2,1)' }} />
                  </div>
                </li>
              )
            })}
          </ul>
          {savingsNote && <p className="mt-5 text-sm text-white/70">{savingsNote}</p>}
        </section>

        <p className="flex flex-wrap items-center gap-2 text-xs text-white/75 md:col-span-2">
          <span className="rounded-md bg-gold px-2 py-0.5 font-semibold text-on-gold">{L.sampleBadge}</span>
          {footerNote && <span>{footerNote}</span>}
        </p>
      </div>
    </div>
  )
}

function Chart({
  period,
  labels,
  money,
}: {
  period: WorkspaceCashFlowPeriod
  labels: WorkspaceLabels
  money: (n: number) => string
}) {
  const pts = period.points
  const W = 300
  const H = 120
  const max = Math.max(1, ...pts.flatMap((p) => [p.income, p.expenses]))
  const slot = W / Math.max(1, pts.length)
  const barW = Math.min(14, slot / 2.6)
  const y = (v: number) => H - (v / max) * (H - 6)

  return (
    <div className="mt-4">
      <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/80">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2.5 rounded-sm" style={{ background: GOLD }} />
          {labels.income}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2.5 rounded-sm" style={{ background: TEAL }} />
          {labels.expenses}
        </span>
        <span className="text-white/65">{period.description}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`${labels.cashFlowTitle}: ${period.description}`}>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1="0" x2={W} y1={H - f * (H - 6)} y2={H - f * (H - 6)} stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
        ))}
        {pts.map((p, i) => {
          const cx = slot * i + slot / 2
          return (
            <g key={p.label + i}>
              <rect x={cx - barW - 1} y={y(p.income)} width={barW} height={H - y(p.income)} rx="2.5" fill={GOLD} />
              <rect x={cx + 1} y={y(p.expenses)} width={barW} height={H - y(p.expenses)} rx="2.5" fill={TEAL} />
            </g>
          )
        })}
      </svg>
      <div className="mt-1 flex" aria-hidden="true">
        {pts.map((p, i) => (
          <span key={p.label + i} className="min-w-0 flex-1 truncate text-center text-[11px] text-white/75 sm:text-xs">
            {p.label}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>{labels.cashFlowTitle}</caption>
        <thead>
          <tr>
            <th scope="col">{period.description}</th>
            <th scope="col">{labels.income}</th>
            <th scope="col">{labels.expenses}</th>
          </tr>
        </thead>
        <tbody>
          {pts.map((p, i) => (
            <tr key={p.label + i}>
              <th scope="row">{p.label}</th>
              <td>{money(p.income)}</td>
              <td>{money(p.expenses)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
