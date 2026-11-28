import React, { useEffect, useState } from 'react'
import {
  X,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  FlaskConical,
  ScrollText,
} from 'lucide-react'
import { SectionLabel } from './ui.jsx'

function Mcq({ item, index }) {
  const [picked, setPicked] = useState(null)
  const done = picked !== null
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
      <div className="flex gap-2">
        <span className="mt-0.5 font-mono text-[10px] text-lab-violet">Q{index + 1}</span>
        <p className="text-[13px] leading-relaxed text-slate-200">{item.q}</p>
      </div>
      <div className="mt-2.5 space-y-1.5">
        {item.options.map((opt, i) => {
          const isCorrect = i === item.correct
          const isPicked = picked === i
          let cls =
            'border-white/[0.07] bg-white/[0.02] text-slate-300 hover:border-lab-teal/40 hover:bg-white/[0.05]'
          if (done && isCorrect)
            cls = 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200'
          else if (done && isPicked)
            cls = 'border-rose-400/50 bg-rose-400/10 text-rose-200'
          else if (done) cls = 'border-white/[0.05] bg-transparent text-slate-500'
          return (
            <button
              key={i}
              disabled={done}
              onClick={() => setPicked(i)}
              className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[12.5px] transition ${cls}`}
            >
              <span className="font-mono text-[10px] opacity-60">{'ABCD'[i]}</span>
              <span className="flex-1">{opt}</span>
              {done && isCorrect && <CheckCircle2 size={13} />}
              {done && isPicked && !isCorrect && <XCircle size={13} />}
            </button>
          )
        })}
      </div>
      {done && (
        <p className="mt-2 animate-floatUp rounded-lg bg-white/[0.03] px-2.5 py-2 text-[12px] leading-relaxed text-slate-400">
          <span className="mr-1 font-semibold text-lab-teal">පැහැදිලි කිරීම:</span>
          {item.explain}
        </p>
      )}
    </div>
  )
}

export default function StudyDrawer({ target, onClose }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const open = Boolean(target)
  const study = target?.study

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-ink-950/70 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[520px] flex-col border-l border-lab-teal/20 bg-ink-900/95 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        {/* ශීර්ෂය */}
        <div className="relative shrink-0 border-b border-white/[0.08] px-5 py-4">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lab-teal/60 to-transparent" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-lab-teal/80">
                අධ්‍යයන පුවරුව
              </p>
              <h2 className="mt-1 truncate font-serif_si text-[22px] font-bold leading-tight text-white">
                {target?.si}
              </h2>
              {target?.en && (
                <p className="font-mono text-[11px] tracking-wide text-slate-400">{target.en}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 p-1.5 text-slate-400 transition hover:border-white/30 hover:text-white"
              aria-label="වසන්න"
            >
              <X size={16} />
            </button>
          </div>
          {target?.meta?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {target.meta.map((m, i) => (
                <span
                  key={i}
                  className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-[10.5px] text-slate-300"
                >
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* අන්තර්ගතය */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {!study && (
            <p className="text-[13px] text-slate-500">
              මෙම අයිතමය සඳහා අධ්‍යයන සටහන් තවම එකතු කර නැත.
            </p>
          )}

          {study?.overview && (
            <section>
              <SectionLabel icon={BookOpen} en="Overview">හැඳින්වීම</SectionLabel>
              <p className="text-[13.5px] leading-[1.85] text-slate-300">{study.overview}</p>
            </section>
          )}

          {study?.principles?.length > 0 && (
            <section>
              <SectionLabel icon={Lightbulb} en="Principles & mechanisms">මූලික නියම හා යාන්ත්‍රණ</SectionLabel>
              <ul className="space-y-2">
                {study.principles.map((p, i) => (
                  <li key={i} className="flex gap-2 text-[13px] leading-[1.75] text-slate-300">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-lab-teal/70" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {study?.reactions?.length > 0 && (
            <section>
              <SectionLabel icon={FlaskConical} en="Reactions">ප්‍රතික්‍රියා</SectionLabel>
              <div className="space-y-1.5">
                {study.reactions.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12px] text-slate-300">{r.name}</span>
                      <span className="font-mono text-[10px] text-lab-amber">{r.cond}</span>
                    </div>
                    <p className="mt-1 font-mono text-[11.5px] leading-relaxed text-lab-teal/90">
                      {r.eq}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {study?.exam?.length > 0 && (
            <section>
              <SectionLabel icon={AlertTriangle} en="A/L exam traps">
                විභාග වැදගත් කරුණු
              </SectionLabel>
              <div className="space-y-2">
                {study.exam.map((t, i) => (
                  <div
                    key={i}
                    className="flex gap-2 rounded-lg border border-lab-amber/20 bg-lab-amber/[0.05] px-2.5 py-2 text-[12.5px] leading-[1.7] text-amber-100/90"
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-[10px] text-lab-amber/70">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {study?.mcq?.length > 0 && (
            <section>
              <SectionLabel icon={HelpCircle} en="Quick practice MCQs">කෙටි ප්‍රශ්න</SectionLabel>
              <div className="space-y-2.5">
                {study.mcq.map((item, i) => (
                  <Mcq key={i} item={item} index={i} />
                ))}
              </div>
            </section>
          )}

          {target?.footer && (
            <p className="flex items-start gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[11.5px] leading-relaxed text-slate-500">
              <ScrollText size={13} className="mt-0.5 shrink-0" />
              {target.footer}
            </p>
          )}
          <div className="h-4" />
        </div>
      </aside>
    </>
  )
}
