import React, { useState } from 'react'
import { Split, RotateCcw, Tag, Box, ChevronRight, Layers, Hash, Percent } from 'lucide-react'
import Scene3D from '../components/Scene3D.jsx'
import { Panel, Stat, SectionLabel, Badge, Toggle } from '../components/ui.jsx'
import { CRYSTALS } from '../data/crystals.js'

export default function SolidMode({ onStudy }) {
  const [id, setId] = useState('fcc')
  const [explode, setExplode] = useState(0)
  const [labels, setLabels] = useState(false)
  const [cell, setCell] = useState(true)
  const [spin, setSpin] = useState(true)

  const c = CRYSTALS.find((x) => x.id === id)

  return (
    <div className="grid gap-3 xl:grid-cols-[212px_minmax(0,1fr)_270px]">
      <div className="glass self-start overflow-hidden">
        <div className="border-b border-white/[0.06] px-3 py-2.5">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-500">
            දැලිස් 6 · Lattices
          </p>
        </div>
        <div className="space-y-1 p-1.5">
          {CRYSTALS.map((cr) => {
            const active = cr.id === id
            return (
              <button
                key={cr.id}
                onClick={() => {
                  setId(cr.id)
                  setExplode(0)
                }}
                className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-all ${
                  active
                    ? 'border-lab-violet/40 bg-lab-violet/[0.08]'
                    : 'border-transparent hover:border-white/10 hover:bg-white/[0.03]'
                }`}
              >
                <Box
                  size={14}
                  className={active ? 'shrink-0 text-lab-violet' : 'shrink-0 text-slate-600'}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] text-slate-200">{cr.si}</span>
                  <span className="block truncate font-mono text-[9.5px] text-slate-500">
                    {cr.en}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
        <div className="border-t border-white/[0.06] px-3 py-2 text-[10px] leading-relaxed text-slate-500">
          ඒකක කොටුව කොටස් වෙන් කර අයන/පරමාණු ස්ථානගත වන ආකාරය බලන්න.
        </div>
      </div>

      <div className="glass relative min-h-[430px] overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif_si text-[22px] font-bold leading-none text-white">
                {c.si}
              </span>
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-lab-violet/80">
              {c.en}
            </p>
          </div>
          <div className="hidden gap-1.5 sm:flex">
            <Badge color="#a78bfa">CN {c.coordination}</Badge>
            <Badge color="#5eead4">{c.packing}%</Badge>
          </div>
        </div>

        <div className="h-[430px] w-full">
          <Scene3D
            atoms={c.atoms}
            bonds={c.bonds}
            explode={explode}
            showLabels={labels}
            cell={cell}
            autoRotate={spin}
            camera={[4.4, 3.6, 5.6]}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/[0.07] bg-ink-950/70 px-3 py-2.5 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setExplode(explode > 0.5 ? 0 : 1)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition ${
                explode > 0.5
                  ? 'border-lab-violet/60 bg-lab-violet/20 text-lab-violet'
                  : 'border-lab-violet/40 bg-lab-violet/10 text-lab-violet hover:bg-lab-violet/20'
              }`}
            >
              <Split size={13} />
              කොටස් වෙන් කරන්න
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explode}
              onChange={(e) => setExplode(Number(e.target.value))}
              className="min-w-[100px] flex-1"
              aria-label="කොටස් වෙන් කිරීම"
            />
            <div className="flex gap-1">
              {[
                { on: cell, set: setCell, icon: Box, t: 'ඒකක කොටු දාර' },
                { on: labels, set: setLabels, icon: Tag, t: 'මූලද්‍රව්‍ය ලේබල' },
                { on: spin, set: setSpin, icon: RotateCcw, t: 'භ්‍රමණය' },
              ].map((b, i) => (
                <button
                  key={i}
                  onClick={() => b.set(!b.on)}
                  title={b.t}
                  className={`rounded-lg border p-1.5 transition ${
                    b.on
                      ? 'border-lab-violet/50 bg-lab-violet/15 text-lab-violet'
                      : 'border-white/10 bg-white/[0.03] text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <b.icon size={13} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Panel title="දැලිස් දත්ත" subtitle="Unit cell data" pad={false}>
          <div className="grid grid-cols-2 gap-1.5 p-2.5">
            <Stat label="සම්බන්ධතා අංකය" value={c.coordination} tone="violet" />
            <Stat label="ඇසුරුම් %" value={`${c.packing}%`} tone="teal" />
            <Stat label="ඒකක කොටුවේ" value={c.perCell} sub="සූත්‍ර ඒකක" tone="slate" />
            <Stat label="වර්ගය" value={c.id.toUpperCase()} tone="amber" />
          </div>
          <div className="border-t border-white/[0.06] px-3 py-2.5">
            <SectionLabel icon={Layers}>උදාහරණ</SectionLabel>
            <p className="text-[12px] text-slate-300">{c.example}</p>
          </div>
          <div className="border-t border-white/[0.06] px-3 py-2.5">
            <SectionLabel icon={Percent}>ඇසුරුම් තීව්‍රතාව</SectionLabel>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-lab-violet to-lab-teal transition-all duration-500"
                style={{ width: `${c.packing}%` }}
              />
            </div>
            <p className="mt-1.5 font-mono text-[10px] text-slate-500">
              SC 52.4 · BCC 68.0 · FCC/HCP 74.0 · දියමන්ති ≈34
            </p>
          </div>
        </Panel>

        <button
          onClick={() =>
            onStudy({
              si: c.si,
              en: c.en,
              study: c.study,
              meta: [`CN ${c.coordination}`, `${c.packing}%`, `${c.perCell} per cell`],
            })
          }
          className="group flex w-full items-center justify-between gap-2 rounded-xl border border-lab-violet/30 bg-gradient-to-r from-lab-violet/10 to-lab-teal/10 px-3.5 py-3 text-left transition hover:border-lab-violet/60"
        >
          <span>
            <span className="block text-[13px] font-medium text-slate-100">ඝන අවස්ථා සටහන්</span>
            <span className="block font-mono text-[10px] text-slate-500">
              ඇසුරුම් · ඝනත්වය · විභාග උගුල්
            </span>
          </span>
          <ChevronRight
            size={16}
            className="shrink-0 text-lab-violet transition group-hover:translate-x-0.5"
          />
        </button>

        <div className="glass p-3">
          <SectionLabel icon={Hash}>මතක තබාගන්න</SectionLabel>
          <ul className="space-y-1.5 text-[11.5px] leading-relaxed text-slate-400">
            <li>• SC: a = 2r, Z = 1</li>
            <li>• BCC: a = 4r/√3, Z = 2</li>
            <li>• FCC: a = 4r/√2, Z = 4</li>
            <li className="pt-1 text-[11px] text-slate-500">
              Z = ඒකක කොටුවක පරමාණු ගණන; ඝනත්වය ρ = ZM / (a³Nₐ)
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
