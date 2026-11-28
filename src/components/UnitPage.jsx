import React from 'react'
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  NotebookPen,
  CheckCircle2,
  Compass,
} from 'lucide-react'
import { Panel, SectionLabel, Badge } from './ui.jsx'
import { UNITS } from '../data/syllabus.js'

export default function UnitPage({ unit, onLaunch, onStudy, setUnitId }) {
  const idx = UNITS.findIndex((u) => u.id === unit.id)
  const next = UNITS[(idx + 1) % UNITS.length]

  return (
    <div className="space-y-3">
      <div className="glass relative overflow-hidden p-5 sm:p-6">
        <div className="noise absolute inset-0" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <Badge color="#5eead4">ඒකකය {String(idx + 1).padStart(2, '0')}</Badge>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
              {unit.en}
            </span>
          </div>
          <h1 className="mt-2 font-serif_si text-[30px] font-bold leading-tight text-white sm:text-[36px]">
            {unit.si}
          </h1>
          <p className="mt-2 max-w-3xl text-[13px] leading-[1.9] text-slate-400">{unit.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => onLaunch(unit.mode, unit.tab)}
              className="flex items-center gap-1.5 rounded-lg border border-lab-teal/50 bg-lab-teal/15 px-3 py-2 text-[12.5px] font-medium text-lab-teal transition hover:bg-lab-teal/25"
            >
              <Sparkles size={13} />
              අන්තර්ක්‍රියාකාරී ප්‍රයෝගාලයට යන්න
            </button>
            <button
              onClick={() =>
                onStudy({
                  si: unit.si,
                  en: unit.en,
                  study: {
                    overview: unit.summary,
                    principles: unit.points,
                    exam: [],
                    mcq: [],
                  },
                  meta: [`ඒකකය ${idx + 1}`, `${unit.points.length} ප්‍රධාන කරුණු`],
                })
              }
              className="flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/[0.03] px-3 py-2 text-[12.5px] text-slate-300 transition hover:border-white/25 hover:text-white"
            >
              <NotebookPen size={13} />
              අධ්‍යයන පුවරුව
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
        <Panel title="මූලික කරුණු" subtitle="Key syllabus points" icon={BookOpen}>
          <ul className="space-y-2.5">
            {unit.points.map((p, i) => (
              <li key={i} className="flex gap-2.5">
                <CheckCircle2 size={14} className="mt-[3px] shrink-0 text-lab-teal/70" />
                <p className="text-[12.5px] leading-[1.85] text-slate-300">{p}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-3">
          <Panel title="මෙම ඒකකයේ ප්‍රයෝග" subtitle="Linked simulations" icon={Compass}>
            <button
              onClick={() => onLaunch(unit.mode, unit.tab)}
              className="group flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-left transition hover:border-lab-teal/40"
            >
              <span>
                <span className="block text-[12.5px] text-slate-200">
                  {unit.mode === 'geometry' && 'අණුක ජ්‍යාමිතිය හා මුහුම්කරණය'}
                  {unit.mode === 'periodic' && 'ආවර්තිතා වගුව හා ප්‍රවණතා'}
                  {unit.mode === 'solid' && 'ස්ඵටික දැලිස්'}
                  {unit.mode === 'equilibrium' && 'සමතුලිතතාව · ශක්තිය · අනුමාපනය'}
                  {unit.mode === 'organic' && 'කාබනික සිතියම'}
                </span>
                <span className="mt-0.5 block font-mono text-[10px] text-slate-500">
                  3D / interactive
                </span>
              </span>
              <ArrowRight
                size={14}
                className="shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-lab-teal"
              />
            </button>
          </Panel>

          <Panel title="ඊළඟ ඒකකය" subtitle="Continue studying" pad={false}>
            <button
              onClick={() => setUnitId(next.id)}
              className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition hover:bg-white/[0.03]"
            >
              <span>
                <span className="block text-[12.5px] text-slate-200">{next.si}</span>
                <span className="block font-mono text-[10px] text-slate-500">{next.en}</span>
              </span>
              <ArrowRight size={14} className="shrink-0 text-slate-500" />
            </button>
          </Panel>

          <div className="glass p-3">
            <SectionLabel>ඉගෙනුම් උපදෙස්</SectionLabel>
            <p className="text-[11.5px] leading-relaxed text-slate-500">
              මුලින්ම සිමියුලේෂන් එකෙන් සංකල්පය අත්දැක ගන්න, පසුව "අධ්‍යයන පුවරුව" විවෘත කර විභාග
              උගුල් හා කෙටි ප්‍රශ්නවලට පිළිතුරු දෙන්න. එමඟින් සංකල්පය හා විභාග යෙදුම එකට සම්බන්ධ වේ.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
