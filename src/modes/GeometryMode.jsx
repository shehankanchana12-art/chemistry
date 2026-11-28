import React, { useState } from 'react'
import {
  Split,
  RotateCcw,
  Tag,
  CircleDot,
  Sparkles,
  Move3D,
  ChevronRight,
  Atom,
  ArrowLeftRight,
} from 'lucide-react'
import Scene3D from '../components/Scene3D.jsx'
import { Panel, Stat, SectionLabel, Toggle, Badge, Chip } from '../components/ui.jsx'
import { MOLECULES } from '../data/molecules.js'

const VSEPR_SHAPE = (bp, lp) => {
  const n = bp + lp
  if (n === 2) return 'රේඛීය · Linear'
  if (n === 3) return lp ? 'කෝණික · Bent' : 'ත්‍රිකෝණී තලීය · Trigonal planar'
  if (n === 4) return lp === 0 ? 'චතුස්ශීර්ෂක · Tetrahedral' : lp === 1 ? 'ත්‍රිකෝණී පිරමිඩාකාර · Trigonal pyramidal' : 'කෝණික · Bent'
  if (n === 5) return 'ත්‍රිකෝණී ද්විපිරමිඩාකාර · Trigonal bipyramidal'
  if (n === 6) return lp ? 'චතුරස්රීය තලීය · Square planar' : 'අෂ්ටශීර්ෂක · Octahedral'
  return '—'
}

export default function GeometryMode({ onStudy }) {
  const [id, setId] = useState('ch4')
  const [explode, setExplode] = useState(0)
  const [labels, setLabels] = useState(false)
  const [lone, setLone] = useState(true)
  const [angle, setAngle] = useState(true)
  const [spin, setSpin] = useState(true)

  const m = MOLECULES.find((x) => x.id === id)
  const steric = m.bondingPairs + m.lonePairs

  const openStudy = () =>
    onStudy({
      si: `${m.formula} — ${m.si}`,
      en: `${m.en} · ${m.geometrySi.split('(')[0].trim()}`,
      study: m.study,
      meta: [m.hybrid, m.angle, `${m.lonePairs} තනි යුගල`, m.polar ? 'ධ්‍රැවීය' : 'ධ්‍රැවීය නොවේ'],
    })

  return (
    <div className="grid gap-3 xl:grid-cols-[212px_minmax(0,1fr)_270px]">
      {/* අණු ලැයිස්තුව */}
      <div className="glass self-start overflow-hidden">
        <div className="border-b border-white/[0.06] px-3 py-2.5">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-500">
            අණු 8 · A/L core
          </p>
        </div>
        <div className="max-h-[520px] space-y-1 overflow-y-auto p-1.5">
          {MOLECULES.map((mol) => {
            const active = mol.id === id
            return (
              <button
                key={mol.id}
                onClick={() => {
                  setId(mol.id)
                  setExplode(0)
                }}
                className={`group flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-all ${
                  active
                    ? 'border-lab-teal/40 bg-lab-teal/[0.08]'
                    : 'border-transparent hover:border-white/10 hover:bg-white/[0.03]'
                }`}
              >
                <span
                  className={`flex h-7 w-9 shrink-0 items-center justify-center rounded-md border font-mono text-[11.5px] font-semibold ${
                    active
                      ? 'border-lab-teal/50 bg-lab-teal/15 text-lab-teal'
                      : 'border-white/10 bg-white/[0.03] text-slate-300'
                  }`}
                >
                  {mol.formula}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] text-slate-200">{mol.si}</span>
                  <span className="block truncate font-mono text-[9.5px] text-slate-500">
                    {mol.hybrid} · {mol.angle}
                  </span>
                </span>
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    mol.polar ? 'bg-lab-amber' : 'bg-slate-600'
                  }`}
                  title={mol.polar ? 'ධ්‍රැවීය' : 'ධ්‍රැවීය නොවේ'}
                />
              </button>
            )
          })}
        </div>
        <div className="border-t border-white/[0.06] px-3 py-2">
          <p className="text-[10.5px] leading-snug text-slate-500">
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-lab-amber align-middle" />
            ධ්‍රැවීය අණුවක් බව අඟවයි
          </p>
        </div>
      </div>

      {/* 3D දර්ශනය */}
      <div className="glass relative min-h-[430px] overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif_si text-[26px] font-bold leading-none text-white">
                {m.formula}
              </span>
              <span className="text-[12px] text-slate-400">{m.si}</span>
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-lab-teal/70">
              {m.geometrySi}
            </p>
          </div>
          <div className="hidden gap-1.5 sm:flex">
            <Badge color="#5eead4">{m.hybrid}</Badge>
            <Badge color={m.polar ? '#fbbf24' : '#94a3b8'}>{m.angle}</Badge>
          </div>
        </div>

        <div className="h-[430px] w-full">
          <Scene3D
            atoms={m.atoms}
            bonds={m.bonds}
            explode={explode}
            showLabels={labels}
            lonePairs={lone ? m.lonePairPositions || [] : []}
            showAngle={angle && m.bonds.length >= 2}
            angleLabel={m.angle}
            autoRotate={spin}
          />
        </div>

        {/* පාලක තීරුව */}
        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/[0.07] bg-ink-950/70 px-3 py-2.5 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setExplode(explode > 0.5 ? 0 : 1)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-all ${
                explode > 0.5
                  ? 'border-lab-violet/60 bg-lab-violet/20 text-lab-violet'
                  : 'border-lab-teal/40 bg-lab-teal/10 text-lab-teal hover:bg-lab-teal/20'
              }`}
            >
              <Split size={13} />
              කොටස් වෙන් කරන්න
            </button>
            <div className="flex min-w-[110px] flex-1 items-center gap-2">
              <Move3D size={12} className="shrink-0 text-slate-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explode}
                onChange={(e) => setExplode(Number(e.target.value))}
                aria-label="කොටස් වෙන් කිරීමේ මට්ටම"
              />
            </div>
            <div className="flex gap-1">
              {[
                { on: labels, set: setLabels, icon: Tag, t: 'පරමාණු ලේබල' },
                { on: lone, set: setLone, icon: CircleDot, t: 'තනි යුගල' },
                { on: angle, set: setAngle, icon: Sparkles, t: 'බන්ධන කෝණ' },
                { on: spin, set: setSpin, icon: RotateCcw, t: 'භ්‍රමණය' },
              ].map((b, i) => (
                <button
                  key={i}
                  onClick={() => b.set(!b.on)}
                  title={b.t}
                  className={`rounded-lg border p-1.5 transition ${
                    b.on
                      ? 'border-lab-teal/50 bg-lab-teal/15 text-lab-teal'
                      : 'border-white/10 bg-white/[0.03] text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <b.icon size={13} />
                </button>
              ))}
            </div>
          </div>
          <p className="mt-1.5 text-[10px] text-slate-500">
            මවුසයෙන් අදින්න · scroll කර zoom කරන්න · අණුව භ්‍රමණය කර සියලු පැති බලන්න
          </p>
        </div>
      </div>

      {/* දත්ත පුවරුව */}
      <div className="space-y-3">
        <Panel title="ජ්‍යාමිතික දත්ත" subtitle="Geometry readout" pad={false}>
          <div className="grid grid-cols-2 gap-1.5 p-2.5">
            <Stat label="මුහුම්කරණය" value={m.hybrid} tone="teal" />
            <Stat label="බන්ධන කෝණය" value={m.angle} tone="violet" />
            <Stat label="බන්ධන යුගල" value={m.bondingPairs} tone="slate" />
            <Stat label="තනි යුගල" value={m.lonePairs} tone="rose" />
          </div>
          <div className="border-t border-white/[0.06] px-3 py-2.5">
            <SectionLabel icon={Atom}>ඉලෙක්ට්‍රෝන අවකාශ</SectionLabel>
            <p className="text-[12px] leading-relaxed text-slate-400">
              {steric} අවකාශ → <span className="text-slate-200">{VSEPR_SHAPE(m.bondingPairs, m.lonePairs)}</span>
            </p>
          </div>
          <div className="border-t border-white/[0.06] px-3 py-2.5">
            <SectionLabel icon={ArrowLeftRight}>ධ්‍රැවීයතාව</SectionLabel>
            <div className="flex items-center justify-between">
              <span
                className={`text-[13px] font-medium ${
                  m.polar ? 'text-lab-amber' : 'text-slate-300'
                }`}
              >
                {m.polar ? 'ධ්‍රැවීය අණුවකි' : 'ධ්‍රැවීය නොවේ'}
              </span>
              <span className="font-mono text-[11px] text-slate-500">{m.dipole}</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              {m.polar
                ? 'බන්ධන දෛශික එකිනෙක අවලංගු නොවේ — අසමමිතික ව්‍යුහය හෝ තනි ඉලෙක්ට්‍රෝන යුගල නිසා.'
                : 'බන්ධන දෛශික සමමිතිකව අවලංගු වේ — ශුද්ධ ද්විධ්‍රැව ඝූර්ණය ≈ 0.'}
            </p>
          </div>
        </Panel>

        <button
          onClick={openStudy}
          className="group flex w-full items-center justify-between gap-2 rounded-xl border border-lab-teal/30 bg-gradient-to-r from-lab-teal/10 to-lab-violet/10 px-3.5 py-3 text-left transition hover:border-lab-teal/60"
        >
          <span>
            <span className="block text-[13px] font-medium text-slate-100">
              අධ්‍යයන සටහන් විවෘත කරන්න
            </span>
            <span className="block font-mono text-[10px] text-slate-500">
              හැඳින්වීම · නියම · විභාග උගුල් · MCQ
            </span>
          </span>
          <ChevronRight
            size={16}
            className="shrink-0 text-lab-teal transition group-hover:translate-x-0.5"
          />
        </button>

        <div className="glass p-3">
          <SectionLabel>ඉක්මන් සංසන්දනය</SectionLabel>
          <div className="space-y-1">
            {MOLECULES.filter((x) => x.bondingPairs + x.lonePairs === steric)
              .slice(0, 4)
              .map((x) => (
                <button
                  key={x.id}
                  onClick={() => setId(x.id)}
                  className="flex w-full items-center justify-between rounded-md px-1.5 py-1 text-[11.5px] text-slate-400 transition hover:bg-white/[0.04] hover:text-slate-200"
                >
                  <span className="font-mono">{x.formula}</span>
                  <span className="text-[10.5px]">{x.angle}</span>
                </button>
              ))}
            <p className="pt-1 text-[10px] leading-relaxed text-slate-500">
              එකම ඉලෙක්ට්‍රෝන අවකාශ ගණනක් ඇති අණු අතර තනි යුගල වැඩි වන විට කෝණය අඩු වේ.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
