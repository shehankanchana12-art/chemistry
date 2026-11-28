import React, { createContext, useContext, useState } from 'react'

/* ---------------- භාෂා ප්‍රසංගය ---------------- */
const LangCtx = createContext({ showEn: true, setShowEn: () => {} })
export const useLang = () => useContext(LangCtx)
export function LangProvider({ children }) {
  const [showEn, setShowEn] = useState(true)
  return <LangCtx.Provider value={{ showEn, setShowEn }}>{children}</LangCtx.Provider>
}

/**
 * ද්විභාෂා පදයක්. Sinhala ප්‍රධාන, English උපසිරැසි (toggle කළ හැක).
 * Hover කිරීමෙන් සෑම විටම tooltip එකක් ලෙස English පෙනේ.
 */
export function Term({ si, en, className = '', block = true, mono = false }) {
  const { showEn } = useLang()
  return (
    <span
      className={`group/term relative inline ${block ? '' : 'inline-block'} ${className}`}
      title={en ? `${si} — ${en}` : si}
    >
      <span>{si}</span>
      {showEn && en && (
        <span className={`en-term ml-1.5 whitespace-nowrap ${mono ? 'uppercase' : ''}`}>
          {en}
        </span>
      )}
    </span>
  )
}

export function ShowEn({ children }) {
  const { showEn } = useLang()
  return showEn ? children : null
}

/* ---------------- පොදු UI ---------------- */
export function Panel({ title, subtitle, icon: Icon, right, children, className = '', pad = true }) {
  const { showEn } = useLang()
  return (
    <div className={`glass ${className}`}>
      {(title || right) && (
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {Icon && <Icon size={15} className="shrink-0 text-lab-teal" />}
              <h3 className="truncate font-serif_si text-[15px] font-semibold text-slate-100">
                {title}
              </h3>
            </div>
            {subtitle && showEn && (
              <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-wider text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
          {right}
        </div>
      )}
      <div className={pad ? 'p-4' : ''}>{children}</div>
    </div>
  )
}

export function Chip({ children, active, onClick, tone = 'teal', className = '', title }) {
  const tones = {
    teal: active
      ? 'border-lab-teal/60 bg-lab-teal/15 text-lab-teal shadow-glow'
      : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white',
    violet: active
      ? 'border-lab-violet/60 bg-lab-violet/15 text-lab-violet'
      : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white',
    plain: active
      ? 'border-white/30 bg-white/10 text-white'
      : 'border-white/10 bg-transparent text-slate-400 hover:text-slate-200',
  }
  return (
    <button
      onClick={onClick}
      title={title}
      className={`rounded-lg border px-2.5 py-1.5 text-[12.5px] leading-tight transition-all duration-150 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  )
}

export function Toggle({ label, checked, onChange, hint }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-left transition hover:border-white/20"
      title={hint}
    >
      <span className="text-[12.5px] text-slate-300">{label}</span>
      <span
        className={`relative h-4 w-8 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-lab-teal/80' : 'bg-slate-600/70'
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-ink-950 transition-all ${
            checked ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  )
}

export function Slider({ label, value, min, max, step = 1, unit = '', onChange, format }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[12.5px] text-slate-400">{label}</span>
        <span className="si-num font-mono text-[12.5px] font-semibold text-lab-teal">
          {format ? format(value) : value}
          <span className="ml-0.5 text-[10px] text-slate-500">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

export function Stat({ label, value, sub, tone = 'teal' }) {
  const c = { teal: 'text-lab-teal', violet: 'text-lab-violet', amber: 'text-lab-amber', rose: 'text-lab-rose', slate: 'text-slate-200' }[tone]
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
      <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-slate-500">{label}</div>
      <div className={`si-num mt-0.5 font-mono text-[19px] font-semibold leading-tight ${c}`}>{value}</div>
      {sub && <div className="mt-0.5 text-[10.5px] leading-tight text-slate-500">{sub}</div>}
    </div>
  )
}

export function Badge({ children, color = '#5eead4', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${className}`}
      style={{ color, borderColor: `${color}44`, background: `${color}14` }}
    >
      {children}
    </span>
  )
}

export function SectionLabel({ children, en, icon: Icon }) {
  const { showEn } = useLang()
  return (
    <div className="mb-2 flex flex-wrap items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
      {Icon && <Icon size={11} />}
      {children}
      {en && showEn && (
        <span className="text-slate-600 normal-case tracking-normal">· {en}</span>
      )}
    </div>
  )
}

export function Empty({ children }) {
  return (
    <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-2 text-center text-[12px] text-slate-500">
      {children}
    </div>
  )
}
