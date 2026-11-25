import { useEffect, useState } from 'react'
import { copy, type Lang } from './copy'
import GlassWorkspace, { type WorkspaceCashFlowPeriod, type WorkspaceGoal, type WorkspaceTransaction } from '@/components/ui/adjustable-glass-dashboard'
import { RegistrationCard } from '@/components/ui/liquid-glass-checkout'

// Copy lines still marked [to confirm] are hidden on the page until the owner fills them in copy.ts.
const isSet = (line: string) => !line.includes('[')
const withoutUnset = (line: string) => line.replace(/\s*[^.።]*\[[^\]]*\]\s*$/u, '')

// Owner decision 25 Nov 2026: hide the interest form, its nav link and the hero button until the form
// posts somewhere real. Set to true once it is connected.
const FORM_CONNECTED = false
const navItems = (lang: Lang) => copy[lang].nav.filter((n) => FORM_CONNECTED || n.id !== 'interest')

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`
const STORE_KEY = 'garro-lang'

function readLang(): Lang {
  try {
    const v = localStorage.getItem(STORE_KEY)
    if (v === 'am' || v === 'en') return v
  } catch {
    /* storage blocked: use the default */
  }
  return 'am'
}

export default function App() {
  const [lang, setLang] = useState<Lang>(readLang)
  const [menu, setMenu] = useState(false)
  const t = copy[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.pageTitle
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.metaDescription)
    try {
      localStorage.setItem(STORE_KEY, lang)
    } catch {
      /* ignore */
    }
  }, [lang, t])

  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu])

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-btn bg-gold px-4 py-3 font-semibold text-on-gold focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {t.skip}
      </a>
      <Header lang={lang} setLang={setLang} menu={menu} setMenu={setMenu} />
      <main id="main">
        {Hero()}
        {Problem()}
        {How()}
        {Safety()}
        {DashboardScreen()}
        {FORM_CONNECTED && Interest()}
      </main>
      {Footer()}
    </>
  )

  function Hero() {
    return (
      <section id="top" className="relative flex min-h-svh items-center overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:px-8 lg:pt-44 lg:pb-28">
        <Glow />
        <div className="relative mx-auto w-full max-w-hero">
          <h1 className="max-w-4xl text-[2.25rem] sm:text-6xl lg:text-[4.75rem]">{t.hero.title}</h1>
          <p className="mt-6 max-w-2xl text-base text-white/75 sm:text-xl">{t.hero.sub}</p>
          {FORM_CONNECTED && (
            <a href="#interest" className="btn btn-primary btn-lg mt-10">
              {t.hero.button}
            </a>
          )}
        </div>
      </section>
    )
  }

  function Problem() {
    return (
      <section id="problem" className="flex min-h-[80svh] items-center border-t border-white/5 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-text">
          <h2 className="text-3xl sm:text-5xl">{t.problem.title}</h2>
          <p className="mt-6 max-w-2xl text-base text-white/75 sm:text-xl">{t.problem.sub}</p>
        </div>
      </section>
    )
  }

  function How() {
    const tints = ['#13201e', '#201811', '#121e20', '#191c1a']
    return (
      <section id="how" className="flex min-h-svh items-center border-t border-white/5 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-wide">
          <h2 className="max-w-3xl text-3xl sm:text-5xl">{t.how.title}</h2>
          <p className="mt-5 max-w-2xl text-base text-white/75 sm:text-xl">{t.how.sub}</p>
          <ol className="mt-12 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {t.how.steps.map((s, i) => (
              <li
                key={s.title}
                className="rounded-bento border border-white/10 p-7 transition-transform duration-300 ease-garro hover:-translate-y-1 sm:p-9"
                style={{ background: tints[i] }}
              >
                <span aria-hidden="true" className="font-display text-6xl text-amber">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-2xl">{s.title}</h3>
                <p className="mt-3 text-base text-white/75">{s.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  }

  function Safety() {
    return (
      <section id="safety" className="flex min-h-svh items-center px-4 py-16 sm:px-6 lg:px-8">
        <div
          className="relative mx-auto w-full max-w-wide overflow-hidden rounded-[32px] border p-6 sm:rounded-panel sm:p-12 lg:p-16"
          style={{ background: 'linear-gradient(to bottom right,#1b1408,#110d05,#050706)', borderColor: 'rgba(227,169,75,0.25)' }}
        >
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-1/4 size-96 rounded-3xl bg-teal/15 blur-[100px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-10 size-80 rounded-3xl bg-amber/10 blur-[90px]" />
          <div className="relative max-w-3xl">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl">{t.safety.title}</h2>
            <p className="mt-6 text-base text-white/75 sm:text-xl">{t.safety.sub}</p>
            <ul className="mt-10 grid list-none gap-3 p-0">
              {t.safety.labels.map((l) => (
                <li key={l} className="flex items-start gap-3 rounded-nav border border-white/10 bg-white/5 p-4 text-base text-white/90">
                  <span aria-hidden="true" className="mt-0.5 text-ok">
                    ✓
                  </span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    )
  }

  function DashboardScreen() {
    const w = t.workspace
    const mk = (labels: string[], inc: number[], exp: number[]) => labels.map((label, i) => ({ label, income: inc[i], expenses: exp[i] }))
    // Synthetic sample numbers in birr. Not from any real cooperative.
    const periods: WorkspaceCashFlowPeriod[] = [
      { ...w.periods[0], points: mk(w.week, [21000, 18500, 24000, 19500, 26500, 23000, 20500], [18000, 17000, 20500, 15000, 24000, 19000, 14000]) },
      { ...w.periods[1], points: mk(w.month, [182000, 191000, 205000], [170000, 176000, 150000]) },
      {
        ...w.periods[2],
        points: mk(
          ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          [510, 540, 520, 580, 610, 590, 640, 660, 630, 700, 720, 690].map((n) => n * 1000),
          [480, 500, 505, 540, 570, 560, 600, 610, 600, 650, 670, 640].map((n) => n * 1000),
        ),
      },
    ]
    const statuses: WorkspaceTransaction['status'][] = ['paid', 'paid', 'pending', 'pending', 'failed', 'paid']
    const amounts = [4850, 3920, 5210, 2780, 4100, 3365]
    const transactions: WorkspaceTransaction[] = w.members.map((name, i) => ({
      id: `tx-${i}`,
      name,
      category: w.categories[i % 2],
      date: w.dates[i],
      amount: amounts[i],
      status: statuses[i],
    }))
    const goals: WorkspaceGoal[] = [
      { id: 'paid', name: w.goals[0], saved: 38, target: 52, unit: 'count' },
      { id: 'accounts', name: w.goals[1], saved: 44, target: 52, unit: 'count', color: '#5a9099' },
    ]
    return (
      <section id="dashboard" className="flex min-h-svh items-center border-t border-white/5 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-wide">
          <h2 className="max-w-3xl text-3xl sm:text-5xl">{t.dashboard.title}</h2>
          <p className="mt-5 max-w-2xl text-base text-white/75 sm:text-xl">{t.dashboard.sub}</p>
          <div className="mt-10">
            <GlassWorkspace
              brand={w.brand}
              userName={w.userName}
              balance={184250}
              balanceChange={{ percent: 6.4, label: w.balanceChangeLabel }}
              account={{ name: w.accountName, lastFour: 'XXXX' }}
              periodLabel={w.periodLabel}
              cashFlowPeriods={periods}
              initialPeriodId="month"
              footerNote={w.footerNote}
              savingsNote={w.savingsNote}
              transactions={transactions}
              goals={goals}
              backgroundImage={asset('brand/dairy-dashboard-bg-soft.jpg')}
              currency={w.currency}
              locale={w.locale}
              labels={{ ...w, regionLabel: t.dashboard.alt }}
            />
          </div>
          <p className="mt-4 text-sm text-white/70">{t.dashboard.caption}</p>
        </div>
      </section>
    )
  }

  function Interest() {
    const f = t.footer
    return (
      <section id="interest" className="relative flex min-h-svh items-center overflow-hidden border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
        <Glow />
        <div className="relative mx-auto w-full max-w-text">
          <h2 className="text-3xl sm:text-5xl">{t.interest.title}</h2>
          <p className="mt-5 max-w-2xl text-base text-white/75 sm:text-xl">{t.interest.sub}</p>
          <RegistrationCard
            key={lang}
            className="mt-10"
            labels={{ ...t.interest, fields: t.interest.fields, privacy: withoutUnset(t.interest.privacy) }}
            contactLines={[f.phone, f.email, f.address].filter(isSet)}
          />
        </div>
      </section>
    )
  }

  function Footer() {
    const f = t.footer
    return (
      <footer className="border-t border-white/10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-hero flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-md">
            <span className="inline-block rounded-2xl bg-cream p-4">
              <img src={asset('brand/garro-logo-gold-512.png')} alt={f.logoAlt} width={96} height={86} className="h-auto w-24" />
            </span>
            <p className="mt-4 text-sm text-white/70">{f.line1}</p>
            <p className="mt-1 text-sm text-white/70">{f.status}</p>
          </div>
          <ul className="grid list-none gap-1 p-0 text-sm text-white/70">
            {[f.phone, f.email, f.address].filter(isSet).map((l) => (
              <li key={l}>{l}</li>
            ))}
            <li className="mt-3">{isSet(f.legal) ? f.legal : `${f.logoAlt} © 2026`}</li>
          </ul>
        </div>
      </footer>
    )
  }
}

function Glow() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-1/4 size-96 rounded-3xl bg-teal/15 blur-[100px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-10 size-80 rounded-3xl bg-amber/10 blur-[90px]" />
    </>
  )
}

function Header({
  lang,
  setLang,
  menu,
  setMenu,
}: {
  lang: Lang
  setLang: (l: Lang) => void
  menu: boolean
  setMenu: (b: boolean) => void
}) {
  const t = copy[lang]
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const linkCls = 'inline-flex min-h-11 items-center rounded-btn px-3 text-[15px] font-medium text-white/80 transition-colors duration-150 hover:text-white'
  return (
    <header className="fixed inset-x-0 top-0 z-50 p-3 sm:p-4">
      <div
        className="mx-auto max-w-hero rounded-nav border px-3 shadow-2xl transition-colors duration-300 sm:px-6"
        style={{
          background: scrolled ? 'rgba(12,15,14,0.95)' : 'rgba(12,15,14,0.85)',
          borderColor: scrolled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <div className="flex min-h-14 items-center justify-between gap-2">
          <a href="#top" className="inline-flex min-h-11 items-center gap-2 rounded-btn pe-2">
            <img src={asset('brand/garro-mark-orange-512.png')} alt="" width={32} height={32} className="size-8 object-contain" />
            <span className="font-display text-xl font-semibold text-cream">{t.workspace.brand}</span>
          </a>
          <nav aria-label={t.navLabel} className="hidden items-center md:flex">
            {navItems(lang).map((n) => (
              <a key={n.id} href={`#${n.id}`} className={linkCls}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <div role="group" aria-label={t.langSwitchLabel} className="flex rounded-btn border border-white/10 p-0.5">
              {(['am', 'en'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  lang={l}
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                  className={`min-h-11 min-w-11 rounded-[10px] px-2.5 text-sm font-semibold transition-colors duration-150 ${
                    lang === l ? 'bg-cream text-ink' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {l === 'am' ? 'አማርኛ' : 'English'}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-btn border border-white/10 text-cream md:hidden"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              aria-label={menu ? t.menuClose : t.menuOpen}
              onClick={() => setMenu(!menu)}
            >
              <span aria-hidden="true" className="text-xl leading-none">
                {menu ? '✕' : '☰'}
              </span>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="mobile-menu" aria-label={t.navLabel} className="grid border-t border-white/10 py-2 md:hidden">
            {navItems(lang).map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setMenu(false)} className="inline-flex min-h-12 items-center px-2 text-base font-medium text-white/90">
                {n.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
