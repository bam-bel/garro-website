import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'

// Garro's own "liquid glass" card and a registration card built on it.
// There is no backend: submit validates, then shows a confirmation that nothing was sent.
// No fetch, no analytics, no storage, no third-party scripts.

export function LiquidGlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative isolate overflow-hidden rounded-bento ${className}`}>
      {/* frosted body */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04) 45%, rgba(227,169,75,0.08))',
          backdropFilter: 'blur(28px) saturate(160%)',
          WebkitBackdropFilter: 'blur(28px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.16)',
          borderRadius: 'inherit',
          boxShadow:
            '0 30px 60px -24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(255,255,255,0.05), inset 0 0 40px rgba(255,255,255,0.03)',
        }}
      />
      {/* soft highlight, top left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-16 -z-10 size-72 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(237,217,181,0.22), transparent 65%)', filter: 'blur(8px)' }}
      />
      {children}
    </div>
  )
}

export interface RegistrationLabels {
  fields: { coop: string; contact: string; phone: string; region: string; members: string }
  button: string
  privacy: string
  errorRequired: string
  errorPhone: string
  errorMembers: string
  /** shown above the button while the form has no backend */
  notice?: string
  doneTitle: string
  doneBody: string
  again: string
}

type FieldKey = keyof RegistrationLabels['fields']
const order: FieldKey[] = ['coop', 'contact', 'phone', 'region', 'members']

export function RegistrationCard({
  labels,
  contactLines,
  className = '',
}: {
  labels: RegistrationLabels
  /** contact lines shown after submit (from the copy file) */
  contactLines: string[]
  className?: string
}) {
  const uid = useId()
  const [values, setValues] = useState<Record<FieldKey, string>>({ coop: '', contact: '', phone: '', region: '', members: '' })
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({})
  const [done, setDone] = useState(false)
  const doneRef = useRef<HTMLDivElement>(null)

  function validate(v: Record<FieldKey, string>) {
    const e: Partial<Record<FieldKey, string>> = {}
    for (const k of order) if (!v[k].trim()) e[k] = labels.errorRequired
    const phone = v.phone.replace(/[\s-]/g, '')
    if (!e.phone && !/^\+?\d{7,15}$/.test(phone)) e.phone = labels.errorPhone
    if (!e.members && !/^\d{1,7}$/.test(v.members.trim())) e.members = labels.errorMembers
    return e
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e = validate(values)
    setErrors(e)
    const first = order.find((k) => e[k])
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus()
      return
    }
    // Nothing is sent or stored. Clear the typed values so personal data does not linger in memory.
    setValues({ coop: '', contact: '', phone: '', region: '', members: '' })
    setDone(true)
    setTimeout(() => doneRef.current?.focus(), 0)
  }

  const inputType: Record<FieldKey, { type: string; mode?: 'tel' | 'numeric'; auto?: string }> = {
    coop: { type: 'text', auto: 'organization' },
    contact: { type: 'text', auto: 'name' },
    phone: { type: 'tel', mode: 'tel', auto: 'tel' },
    region: { type: 'text' },
    members: { type: 'text', mode: 'numeric' },
  }

  return (
    <LiquidGlassCard className={`p-6 sm:p-9 ${className}`}>
      {done ? (
        <div ref={doneRef} tabIndex={-1} role="status" className="grid gap-4 py-4 outline-none">
          <h3 className="text-2xl text-cream sm:text-3xl">{labels.doneTitle}</h3>
          <p className="text-white/85">{labels.doneBody}</p>
          <ul className="grid gap-1 text-cream">
            {contactLines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <button type="button" className="btn mt-2 w-fit border border-cream/25 text-cream hover:bg-cream/10" onClick={() => setDone(false)}>
            {labels.again}
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="grid gap-4">
          {order.map((k) => {
            const id = `${uid}-${k}`
            const err = errors[k]
            return (
              <div key={k} className="grid gap-1.5">
                <label htmlFor={id} className="text-sm font-semibold text-cream">
                  {labels.fields[k]}
                </label>
                <input
                  id={id}
                  name={k}
                  type={inputType[k].type}
                  inputMode={inputType[k].mode}
                  autoComplete={inputType[k].auto ?? 'off'}
                  required
                  aria-required="true"
                  aria-invalid={err ? true : undefined}
                  aria-describedby={err ? `${id}-err` : undefined}
                  value={values[k]}
                  onChange={(e) => setValues((s) => ({ ...s, [k]: e.target.value }))}
                  className="h-14 w-full rounded-btn border bg-black/30 px-4 text-base text-white placeholder:text-white/50"
                  style={{ borderColor: err ? '#e8705f' : 'rgba(255,255,255,0.2)', transition: 'border-color 150ms cubic-bezier(0.4,0,0.2,1)' }}
                />
                {err && (
                  <p id={`${id}-err`} className="text-sm text-err">
                    {err}
                  </p>
                )}
              </div>
            )
          })}
          {labels.notice ? (
            <p className="rounded-xl border border-white/15 px-4 py-3 text-sm text-amber">{labels.notice}</p>
          ) : null}
          <button type="submit" className="btn btn-primary btn-lg mt-2 w-full">
            {labels.button}
          </button>
          <p className="text-sm text-white/70">{labels.privacy}</p>
        </form>
      )}
    </LiquidGlassCard>
  )
}
