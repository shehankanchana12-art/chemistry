import React, { useMemo, useRef, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot,
} from 'recharts'
import {
  Scale,
  Flame,
  FlaskConical,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Info,
  Zap,
} from 'lucide-react'
import { Panel, Slider, Stat, SectionLabel, Toggle, Chip, Badge } from '../components/ui.jsx'

const R = 8.314
const TIP = {
  backgroundColor: 'rgba(8,14,24,0.96)',
  border: '1px solid rgba(94,234,212,0.3)',
  borderRadius: 8,
  fontSize: 11,
  color: '#e2e8f0',
  padding: '5px 8px',
}

/* ================= ලී චැටලියර් ================= */
const D_H = -92400 // J mol⁻¹ (NH₃ සංශ්ලේෂණය)
const K298 = 6.8e5

function kpAt(T) {
  return K298 * Math.exp((-D_H / R) * (1 / T - 1 / 298))
}

function solveExtent(Kp, P) {
  const q = (x) => {
    const n = 4 - 2 * x
    const pN2 = ((1 - x) / n) * P
    const pH2 = ((3 - 3 * x) / n) * P
    const pNH3 = ((2 * x) / n) * P
    if (pN2 <= 0 || pH2 <= 0) return Infinity
    return (pNH3 * pNH3) / (pN2 * pH2 * pH2 * pH2)
  }
  let lo = 0
  let hi = 0.97
  for (let i = 0; i < 70; i++) {
    const mid = (lo + hi) / 2
    if (q(mid) < Kp) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

function LeChatelier() {
  const [T, setT] = useState(700)
  const [P, setP] = useState(200)
  const prev = useRef({ T, P })

  const Kp = kpAt(T)
  const x = solveExtent(Kp, P)
  const nTotal = 4 - 2 * x
  const composition = [
    { key: 'N₂', mol: 1 - x, color: '#38bdf8' },
    { key: 'H₂', mol: 3 - 3 * x, color: '#5eead4' },
    { key: 'NH₃', mol: 2 * x, color: '#a78bfa' },
  ]
  const maxMol = Math.max(...composition.map((c) => c.mol), 1)

  const dT = T - prev.current.T
  const dP = P - prev.current.P
  const moved = []
  if (dT !== 0) {
    moved.push(
      dT > 0
        ? { dir: 'left', txt: 'උෂ්ණත්වය වැඩි කිරීම — තාපශෝෂක දිශාවට (ප්‍රතික්‍රියක පැත්තට) මාරු වේ.' }
        : { dir: 'right', txt: 'උෂ්ණත්වය අඩු කිරීම — තාපෝත්පාදක දිශාවට (ඵල පැත්තට) මාරු වේ.' }
    )
  }
  if (dP !== 0) {
    moved.push(
      dP > 0
        ? { dir: 'right', txt: 'පීඩනය වැඩි කිරීම — මවුල ගණන අඩු (ඵල) පැත්තට මාරු වේ.' }
        : { dir: 'left', txt: 'පීඩනය අඩු කිරීම — මවුල ගණන වැඩි (ප්‍රතික්‍රියක) පැත්තට මාරු වේ.' }
    )
  }
  prev.current = { T, P }

  return (
    <div className="space-y-3">
      <Panel
        title="හේබර් ක්‍රියාවලිය · ලී චැටලියර් මූලධර්මය"
        subtitle="N₂ + 3H₂ ⇌ 2NH₃ · ΔH = −92 kJ mol⁻¹"
        icon={Scale}
        right={<Badge color="#5eead4">Kp = {Kp.toExponential(2)}</Badge>}
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
          <div className="space-y-3.5">
            <Slider
              label="උෂ්ණත්වය"
              value={T}
              min={300}
              max={900}
              step={10}
              unit="K"
              onChange={setT}
            />
            <Slider
              label="පීඩනය"
              value={P}
              min={1}
              max={400}
              step={1}
              unit="atm"
              onChange={setP}
            />
            <div className="rounded-xl border border-white/[0.07] bg-ink-950/50 p-2.5">
              <SectionLabel icon={Info}>සමතුලිත මිශ්‍රණය (මවුල)</SectionLabel>
              <div className="space-y-1.5">
                {composition.map((c) => (
                  <div key={c.key} className="flex items-center gap-2">
                    <span className="w-9 shrink-0 font-mono text-[11px]" style={{ color: c.color }}>
                      {c.key}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${(c.mol / maxMol) * 100}%`,
                          background: c.color,
                          opacity: 0.85,
                        }}
                      />
                    </div>
                    <span className="si-num w-11 text-right font-mono text-[11px] text-slate-300">
                      {c.mol.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <Stat label="NH₃ පරිවර්තනය" value={`${(x * 100).toFixed(0)}%`} tone="violet" />
              <Stat label="මුළු මවුල" value={nTotal.toFixed(2)} tone="slate" />
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
              <SectionLabel>සමතුලිතතා ස්ථානය</SectionLabel>
              <div className="flex items-center justify-between gap-1 font-mono text-[12px]">
                <span className="text-sky-300">N₂ + 3H₂</span>
                <span className="flex flex-1 items-center gap-1 px-2">
                  <ArrowLeft
                    size={13}
                    className={moved.some((m) => m.dir === 'left') ? 'text-lab-rose' : 'text-slate-700'}
                  />
                  <span className="h-[2px] flex-1 bg-gradient-to-r from-sky-400/30 via-slate-600 to-violet-400/30" />
                  <ArrowRight
                    size={13}
                    className={moved.some((m) => m.dir === 'right') ? 'text-lab-teal' : 'text-slate-700'}
                  />
                </span>
                <span className="text-violet-300">2NH₃</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {moved.length === 0 ? (
                  <p className="text-[11.5px] text-slate-500">
                    උෂ්ණත්වය හෝ පීඩනය වෙනස් කර මාරුවීම බලන්න.
                  </p>
                ) : (
                  moved.map((m, i) => (
                    <p
                      key={i}
                      className={`flex gap-1.5 rounded-lg border px-2 py-1.5 text-[11.5px] leading-relaxed ${
                        m.dir === 'right'
                          ? 'border-lab-teal/25 bg-lab-teal/[0.06] text-teal-100/85'
                          : 'border-lab-rose/25 bg-lab-rose/[0.06] text-rose-100/85'
                      }`}
                    >
                      {m.dir === 'right' ? (
                        <ArrowRight size={12} className="mt-0.5 shrink-0" />
                      ) : (
                        <ArrowLeft size={12} className="mt-0.5 shrink-0" />
                      )}
                      {m.txt}
                    </p>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-[11.5px] leading-relaxed text-slate-400">
              <SectionLabel icon={Info}>මූලධර්මය</SectionLabel>
              සමතුලිත පද්ධතියකට බාහිර වෙනසක් (සාන්ද්‍රණය, පීඩනය, උෂ්ණත්වය) කළ විට, පද්ධතිය එම
              වෙනස අවම කරන දිශාවට සමතුලිතතාව මාරු කරයි.
              <div className="mt-2 grid gap-1 text-[11px]">
                <span>• <span className="text-slate-300">සාන්ද්‍රණය:</span> ප්‍රතික්‍රියක එකතු කළ විට ඵල පැත්තට.</span>
                <span>• <span className="text-slate-300">පීඩනය:</span> වායු මවුල අඩු පැත්තට (මෙහි Δn = −2).</span>
                <span>• <span className="text-slate-300">උෂ්ණත්වය:</span> තාපෝත්පාදක ප්‍රතික්‍රියාවකදී අඩු කිරීම ඵල පැත්තට.</span>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          {
            t: 'සාන්ද්‍රණ වෙනස්කම්',
            d: 'K අගය නොවෙනස්ව පවතී; Q වෙනස් වී සමතුලිතතාව නැවත ස්ථාපිත වේ.',
            c: '#5eead4',
          },
          {
            t: 'පීඩන / පරිමා වෙනස්කම්',
            d: 'අභිවාහක වායු නොමැති නම් හෝ Δn = 0 නම් පීඩනයෙන් ස්ථානය මාරු නොවේ.',
            c: '#a78bfa',
          },
          {
            t: 'උත්ප්‍රේරක',
            d: 'සමතුලිතතා ස්ථානය මාරු නොකරයි — ඉදිරි හා පසුගාමී වේග දෙකම සමානව වැඩි කරයි.',
            c: '#fbbf24',
          },
        ].map((k) => (
          <div
            key={k.t}
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3"
            style={{ borderLeft: `3px solid ${k.c}` }}
          >
            <p className="text-[12.5px] font-medium text-slate-200">{k.t}</p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">{k.d}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ================= ශක්ති විද්‍යාව ================= */
function Energetics() {
  const [ea, setEa] = useState(120)
  const [dh, setDh] = useState(-60)
  const [temp, setTemp] = useState(320)
  const [cat, setCat] = useState(false)

  const eaEff = cat ? ea * 0.55 : ea
  const data = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 100; i++) {
      const t = i / 100
      const base = dh * t
      const hump = Math.pow(Math.sin(Math.PI * t), 1.35)
      pts.push({
        t: +(t * 100).toFixed(0),
        normal: +(base + ea * hump).toFixed(2),
        catalyzed: +(base + eaEff * hump).toFixed(2),
      })
    }
    return pts
  }, [ea, dh, eaEff])

  const rateRatio = Math.exp((ea - eaEff) * 1000 / (R * temp))
  const tenK = Math.exp((ea * 1000 / R) * (1 / temp - 1 / (temp + 10)))
  const fmt = (n) => (n >= 1000 ? n.toExponential(1).replace('e+', ' × 10^') : n.toFixed(1))

  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <Panel title="පරාමිති" subtitle="Energy profile controls" icon={Flame}>
          <div className="space-y-4">
            <Slider
              label="සක්‍රීයකරණ ශක්තිය (Eₐ)"
              value={ea}
              min={20}
              max={240}
              step={5}
              unit="kJ mol⁻¹"
              onChange={setEa}
            />
            <Slider
              label="එන්තැල්පි වෙනස (ΔH)"
              value={dh}
              min={-140}
              max={140}
              step={5}
              unit="kJ mol⁻¹"
              onChange={setDh}
            />
            <Slider
              label="උෂ්ණත්වය"
              value={temp}
              min={250}
              max={700}
              step={5}
              unit="K"
              onChange={setTemp}
            />
            <Toggle
              label="උත්ප්‍රේරකයක් එකතු කරන්න (Eₐ ↓ 45%)"
              checked={cat}
              onChange={setCat}
              hint="උත්ප්‍රේරකය විකල්ප මාර්ගයක් ලබා දී Eₐ අඩු කරයි"
            />
            <div className="grid grid-cols-2 gap-1.5">
              <Stat
                label="ප්‍රතික්‍රියා වර්ගය"
                value={dh < 0 ? 'තාපෝත්පාදක' : dh > 0 ? 'තාපශෝෂක' : 'උදාසීන'}
                tone={dh < 0 ? 'teal' : 'rose'}
              />
              <Stat label="Eₐ (ප්‍රතිගාමී)" value={`${(eaEff - dh).toFixed(0)}`} sub="kJ mol⁻¹" tone="violet" />
            </div>
            <div className="rounded-lg border border-lab-teal/20 bg-lab-teal/[0.05] px-2.5 py-2 text-[11.5px] leading-relaxed text-teal-100/80">
              වේග වැඩිවීම:{' '}
              <span className="font-mono font-semibold">{fmt(rateRatio)}×</span>{' '}
              (උත්ප්‍රේරකය සමඟ, {temp} K දී)
              <br />
              උෂ්ණත්වය 10 K වැඩි කිරීමෙන් වේගය{' '}
              <span className="font-mono font-semibold">{tenK.toFixed(2)}×</span>
            </div>
          </div>
        </Panel>

        <Panel
          title="ශක්ති පැතිකඩ රූපය"
          subtitle="Energy profile · progress of reaction"
          icon={TrendingUp}
          right={
            <div className="flex gap-1">
              <Badge color="#5eead4">Eₐ {eaEff.toFixed(0)}</Badge>
              <Badge color={dh < 0 ? '#a78bfa' : '#fb7185'}>ΔH {dh}</Badge>
            </div>
          }
        >
          <div className="h-[286px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="gNormal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5eead4" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#5eead4" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="t"
                  tick={{ fill: '#64748b', fontSize: 9.5, fontFamily: 'monospace' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                  label={{
                    value: 'ප්‍රතික්‍රියා ප්‍රගතිය →',
                    position: 'insideBottomRight',
                    offset: -2,
                    fill: '#475569',
                    fontSize: 9,
                  }}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                  unit=""
                />
                <Tooltip
                  contentStyle={TIP}
                  labelFormatter={(l) => `ප්‍රගතිය ${l}%`}
                  formatter={(v, n) => [
                    `${Number(v).toFixed(1)} kJ mol⁻¹`,
                    n === 'normal' ? 'සාමාන්‍ය මාර්ගය' : 'උත්ප්‍රේරිත මාර්ගය',
                  ]}
                />
                <ReferenceLine y={0} stroke="rgba(148,163,184,0.25)" strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="normal"
                  stroke="#5eead4"
                  strokeWidth={2}
                  fill="url(#gNormal)"
                  animationDuration={400}
                />
                {cat && (
                  <Line
                    type="monotone"
                    dataKey="catalyzed"
                    stroke="#a78bfa"
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    dot={false}
                    animationDuration={400}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-[2px] w-4 bg-lab-teal" /> සාමාන්‍ය මාර්ගය
            </span>
            <span className="flex items-center gap-1">
              <span className="h-[2px] w-4 border-t border-dashed border-lab-violet" /> උත්ප්‍රේරිත මාර්ගය
            </span>
            <span>Eₐ = ප්‍රතික්‍රියක මට්ටමේ සිට උපරිම ශක්තියට ඇති දුර</span>
          </div>
        </Panel>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Panel title="තාපෝත්පාදක vs තාපශෝෂක" subtitle="Exothermic / endothermic">
          <div className="grid gap-2 text-[11.5px] leading-relaxed text-slate-400">
            <p>
              <span className="font-mono text-lab-teal">ΔH &lt; 0</span> — ඵලවල ශක්තිය ප්‍රතික්‍රියකවලට වඩා
              අඩුයි; තාපය නිකුත් වේ. (උදා: දහනය, උදාසීනීකරණය)
            </p>
            <p>
              <span className="font-mono text-lab-rose">ΔH &gt; 0</span> — ඵලවල ශක්තිය වැඩියි; තාපය
              අවශෝෂණය වේ. (උදා: තාප විච්ඡේදනය, CaCO₃ දහනය)
            </p>
            <p className="pt-1 text-slate-500">
              උත්ප්‍රේරකය Eₐ අඩු කරයි, නමුත් ΔH වෙනස් නොකරයි — එබැවින් සමතුලිතතා ස්ථානය මාරු නොවේ.
            </p>
          </div>
        </Panel>
        <Panel title="ආර්හේනියස් සමීකරණය" subtitle="Arrhenius equation">
          <div className="rounded-lg border border-white/[0.07] bg-ink-950/60 px-3 py-2.5 text-center font-mono text-[13px] text-lab-teal">
            k = A · e<sup>−Eₐ/RT</sup>
          </div>
          <p className="mt-2 text-[11.5px] leading-relaxed text-slate-400">
            ln k = ln A − Eₐ/RT. ln k එදා 1/T ප්‍රස්තාරයේ බෑවුම −Eₐ/R වේ. එබැවින් Eₐ විශාල වන විට
            උෂ්ණත්වයට ඇති සංවේදීතාව ද විශාල වේ.
          </p>
        </Panel>
      </div>
    </div>
  )
}

/* ================= අනුමාපනය ================= */
const SYSTEMS = {
  sa: { si: 'ප්‍රබල අම්ලය + ප්‍රබල භෂ්මය', en: 'Strong acid + strong base', pKa: null, type: 'sa' },
  wa: { si: 'දුර්වල අම්ලය + ප්‍රබල භෂ්මය', en: 'Weak acid + strong base', pKa: 4.76, type: 'wa' },
  wb: { si: 'දුර්වල භෂ්මය + ප්‍රබල අම්ලය', en: 'Weak base + strong acid', pKa: 4.75, type: 'wb' },
}

function phAt(sys, Ca, Va, Cb, Vb) {
  const nA = Ca * Va
  const nB = Cb * Vb
  const V = Va + Vb
  const Kw = 1e-14

  if (sys === 'sa') {
    const diff = nA - nB
    if (Math.abs(diff) < 1e-9) return 7
    if (diff > 0) {
      const h = diff / V
      return -Math.log10(Math.max(h, 1e-14))
    }
    const oh = -diff / V
    return 14 + Math.log10(Math.max(oh, 1e-14))
  }

  if (sys === 'wa') {
    const Ka = Math.pow(10, -4.76)
    const f = nA > 0 ? nB / nA : 1
    if (f < 0.999) {
      if (f < 0.002) {
        const c = nA / V
        return 0.5 * (-Math.log10(Ka) - Math.log10(c))
      }
      return -Math.log10(Ka) + Math.log10(f / (1 - f))
    }
    if (f <= 1.001) {
      const cSalt = nA / V
      const oh = Math.sqrt((Kw / Ka) * cSalt)
      return 14 + Math.log10(Math.max(oh, 1e-14))
    }
    const oh = (nB - nA) / V
    return 14 + Math.log10(Math.max(oh, 1e-14))
  }

  // weak base + strong acid (Cb = භෂ්ම, Ca = අම්ලය)
  const Kb = Math.pow(10, -4.75)
  const nBase = Cb * Va
  const nAcid = Ca * Vb
  const g = nBase > 0 ? nAcid / nBase : 1
  if (g < 0.999) {
    if (g < 0.002) {
      const c = nBase / V
      const oh = Math.sqrt(Kb * c)
      return 14 + Math.log10(Math.max(oh, 1e-14))
    }
    const pOH = -Math.log10(Kb) + Math.log10(g / (1 - g))
    return 14 - pOH
  }
  if (g <= 1.001) {
    const cSalt = nBase / V
    const h = Math.sqrt((Kw / Kb) * cSalt)
    return -Math.log10(Math.max(h, 1e-14))
  }
  const h = (nAcid - nBase) / V
  return -Math.log10(Math.max(h, 1e-14))
}

function Titration() {
  const [sys, setSys] = useState('wa')
  const [Ca, setCa] = useState(0.1)
  const [Va, setVa] = useState(25)
  const [Cb, setCb] = useState(0.1)
  const [added, setAdded] = useState(0)

  const s = SYSTEMS[sys]
  const isWB = sys === 'wb'
  // wb: Ca = අම්ලයේ සාන්ද්‍රණය, Va = භෂ්ම පරිමාව, Cb = භෂ්ම සාන්ද්‍රණය → අපි පැහැදිලිව නම් කරමු
  const acidC = isWB ? Ca : Ca
  const baseC = isWB ? Cb : Cb
  const analyteV = Va

  const veq = isWB ? (baseC * analyteV) / acidC : (acidC * analyteV) / baseC
  const vMax = Math.max(veq * 2, 1)

  const curve = useMemo(() => {
    const pts = []
    const N = 160
    for (let i = 0; i <= N; i++) {
      const v = (i / N) * vMax
      let ph
      if (isWB) ph = phAt('wb', acidC, analyteV, baseC, v)
      else ph = phAt(sys, acidC, analyteV, baseC, v)
      pts.push({ v: +v.toFixed(2), ph: +Math.min(14, Math.max(0, ph)).toFixed(2) })
    }
    return pts
  }, [sys, acidC, analyteV, baseC, vMax, isWB])

  const eqPh = isWB ? phAt('wb', acidC, analyteV, baseC, veq) : phAt(sys, acidC, analyteV, baseC, veq)
  const curPh = isWB ? phAt('wb', acidC, analyteV, baseC, added) : phAt(sys, acidC, analyteV, baseC, added)

  const indicator =
    eqPh < 6.5
      ? { si: 'මෙතිල් තැඹිලි', en: 'Methyl orange', range: '3.1 – 4.4', color: '#fb923c' }
      : eqPh > 8.5
      ? { si: 'ෆීනොල්ෆ්තැලීන්', en: 'Phenolphthalein', range: '8.2 – 10.0', color: '#f472b6' }
      : { si: 'බ්‍රෝමෝතයිමෝල් නිල්', en: 'Bromothymol blue', range: '6.0 – 7.6', color: '#38bdf8' }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(SYSTEMS).map(([k, v]) => (
          <Chip key={k} active={sys === k} onClick={() => setSys(k)}>
            {v.si}
          </Chip>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1.45fr]">
        <Panel title="පරාමිති" subtitle="Titration setup" icon={FlaskConical}>
          <div className="space-y-4">
            <Slider
              label={isWB ? 'අම්ලයේ සාන්ද්‍රණය (Ca)' : 'අම්ලයේ සාන්ද්‍රණය'}
              value={Ca}
              min={0.005}
              max={0.5}
              step={0.005}
              unit="mol dm⁻³"
              onChange={setCa}
              format={(v) => v.toFixed(3)}
            />
            <Slider
              label="අම්ල/භෂ්ම පරිමාව (V)" 
              value={Va}
              min={5}
              max={50}
              step={1}
              unit="cm³"
              onChange={setVa}
            />
            <Slider
              label={isWB ? 'භෂ්මයේ සාන්ද්‍රණය (Cb)' : 'භෂ්මයේ සාන්ද්‍රණය'}
              value={Cb}
              min={0.005}
              max={0.5}
              step={0.005}
              unit="mol dm⁻³"
              onChange={setCb}
              format={(v) => v.toFixed(3)}
            />
            <div className="border-t border-white/[0.06] pt-3">
              <Slider
                label={`එකතු කළ පරිමාව (Veq = ${veq.toFixed(1)} cm³)`}
                value={Math.min(added, vMax)}
                min={0}
                max={+vMax.toFixed(1)}
                step={0.1}
                unit="cm³"
                onChange={setAdded}
                format={(v) => v.toFixed(1)}
              />
              <div className="mt-2.5 flex items-center justify-between rounded-lg border border-white/[0.07] bg-ink-950/60 px-3 py-2">
                <span className="text-[11.5px] text-slate-400">මෙම ලක්ෂ්‍යයේ pH</span>
                <span className="si-num font-mono text-[18px] font-semibold text-lab-teal">
                  {curPh.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <Stat label="සමානතා පරිමාව" value={`${veq.toFixed(2)}`} sub="cm³" tone="violet" />
              <Stat label="සමානතා pH" value={eqPh.toFixed(2)} tone="amber" />
            </div>
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-2">
              <SectionLabel>නිර්දේශිත දර්ශකය</SectionLabel>
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] text-slate-200">{indicator.si}</span>
                <span className="font-mono text-[10.5px]" style={{ color: indicator.color }}>
                  pH {indicator.range}
                </span>
              </div>
            </div>
          </div>
        </Panel>

        <Panel
          title="අනුමාපන වක්‍රය"
          subtitle={s.en}
          icon={TrendingUp}
          right={<Badge color="#a78bfa">{s.pKa ? `pKa ${s.pKa}` : 'ප්‍රබල'}</Badge>}
        >
          <div className="h-[330px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curve} margin={{ top: 8, right: 14, bottom: 4, left: -18 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  type="number"
                  dataKey="v"
                  domain={[0, +vMax.toFixed(1)]}
                  tick={{ fill: '#64748b', fontSize: 9.5, fontFamily: 'monospace' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                  label={{
                    value: 'එකතු කළ පරිමාව / cm³',
                    position: 'insideBottom',
                    offset: -2,
                    fill: '#475569',
                    fontSize: 9,
                  }}
                />
                <YAxis
                  domain={[0, 14]}
                  ticks={[0, 2, 4, 6, 8, 10, 12, 14]}
                  tick={{ fill: '#64748b', fontSize: 9.5, fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip
                  contentStyle={TIP}
                  labelFormatter={(l) => `V = ${l} cm³`}
                  formatter={(v) => [`pH ${v}`, '']}
                />
                <ReferenceLine
                  x={+veq.toFixed(2)}
                  stroke="#a78bfa"
                  strokeDasharray="4 3"
                  label={{ value: 'Veq', fill: '#a78bfa', fontSize: 9, position: 'top' }}
                />
                <ReferenceLine y={eqPh} stroke="#a78bfa" strokeOpacity={0.25} strokeDasharray="2 4" />
                <ReferenceLine y={7} stroke="rgba(148,163,184,0.2)" strokeDasharray="2 4" />
                <Line
                  type="monotone"
                  dataKey="ph"
                  stroke="#5eead4"
                  strokeWidth={2.2}
                  dot={false}
                  animationDuration={350}
                />
                <ReferenceDot
                  x={+Math.min(added, vMax).toFixed(2)}
                  y={+curPh.toFixed(2)}
                  r={5}
                  fill="#fbbf24"
                  stroke="#05090f"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 grid gap-1 text-[10.5px] leading-relaxed text-slate-500 sm:grid-cols-2">
            <span>• සමානතා ලක්ෂ්‍යය = අම්ල හා භෂ්ම මවුල සමාන වන ලක්ෂ්‍යය.</span>
            <span>• දුර්වල අම්ල-ප්‍රබල භෂ්ම: Veq හි pH &gt; 7 (ලවණය භෂ්මීය).</span>
          </div>
        </Panel>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          { t: 'ප්‍රබල–ප්‍රබල', d: 'Veq හි pH = 7. වක්‍රය ඉතා තියුණු පිම්මක් පෙන්වයි.', c: '#5eead4' },
          { t: 'දුර්වල අම්ල–ප්‍රබල භෂ්ම', d: 'Veq pH > 7. ආරම්භයේදී buffer කලාපයක් ඇත.', c: '#a78bfa' },
          { t: 'දුර්වල භෂ්ම–ප්‍රබල අම්ල', d: 'Veq pH < 7. දර්ශකය මෙතිල් තැඹිලි විය යුතුය.', c: '#fbbf24' },
        ].map((k) => (
          <div
            key={k.t}
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3"
            style={{ borderLeft: `3px solid ${k.c}` }}
          >
            <p className="font-mono text-[11px] font-semibold" style={{ color: k.c }}>
              {k.t}
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">{k.d}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function EquilibriumMode() {
  const [tab, setTab] = useState('lechatelier')
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {[
          { id: 'lechatelier', si: 'සමතුලිතතාව හා ලී චැටලියර්', icon: Scale },
          { id: 'energetics', si: 'ශක්ති විද්‍යාව හා චාලකය', icon: Flame },
          { id: 'titration', si: 'අම්ල-භෂ්ම අනුමාපනය', icon: FlaskConical },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[12.5px] transition ${
              tab === t.id
                ? 'border-lab-teal/50 bg-lab-teal/10 text-lab-teal'
                : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200'
            }`}
          >
            <t.icon size={13} />
            {t.si}
          </button>
        ))}
      </div>
      {tab === 'lechatelier' && <LeChatelier />}
      {tab === 'energetics' && <Energetics />}
      {tab === 'titration' && <Titration />}
    </div>
  )
}
