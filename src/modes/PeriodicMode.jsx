import React, { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import { TrendingUp, Wand2, Droplets, Info, ChevronRight, Beaker } from 'lucide-react'
import { Panel, SectionLabel, Badge, Chip } from '../components/ui.jsx'
import {
  ELEMENTS,
  CATEGORY_META,
  TREND_SETS,
  PERIOD3_OXIDES,
} from '../data/elements.js'
import { buildElementStudy } from '../data/elementStudy.js'

const BLOCKS = [
  { id: 's', si: 's-ගොනුව', color: '#fb7185' },
  { id: 'p', si: 'p-ගොනුව', color: '#5eead4' },
  { id: 'd', si: 'd-ගොනුව', color: '#facc15' },
  { id: 'f', si: 'f-ගොනුව', color: '#94a3b8' },
]

function ElCell({ el, active, dim, onClick }) {
  const meta = CATEGORY_META[el.category] || {}
  return (
    <button
      onClick={onClick}
      title={`${el.si} (${el.en}) · Z=${el.z}`}
      style={{
        gridColumn: el.group > 0 ? el.group : undefined,
        gridRow: el.group > 0 ? el.period : undefined,
        background: active ? meta.color : meta.bg,
        borderColor: active ? meta.color : `${meta.color}33`,
        color: active ? '#05090f' : meta.color,
        opacity: dim ? 0.22 : 1,
      }}
      className="group relative flex aspect-square min-w-0 flex-col items-center justify-center rounded-[5px] border transition-all duration-150 hover:z-10 hover:scale-[1.14] hover:shadow-lg"
    >
      <span className="absolute left-[3px] top-[1px] font-mono text-[6.5px] leading-none opacity-70">
        {el.z}
      </span>
      <span className="font-mono text-[11.5px] font-bold leading-none">{el.sym}</span>
      <span className="mt-[2px] hidden max-w-full truncate px-[2px] text-[6.5px] leading-none opacity-75 lg:block">
        {el.si}
      </span>
    </button>
  )
}

function oxideStudy(o) {
  return {
    overview: `${o.formula} — ${o.si}. ${o.note} ආවර්තය 3 හි ${o.element} මූලද්‍රව්‍යයේ ඔක්සයිඩයක් ලෙස එහි අම්ල/භෂ්ම ස්වභාවය මූලද්‍රව්‍යයේ ලෝහීය ගුණයේ ප්‍රමාණය අඟවයි.`,
    principles: [
      `වර්ගය: ${o.typeSi} (${o.typeEn}). ජලීය ද්‍රාවණයේ pH ≈ ${o.ph}.`,
      `ජලය සමඟ: ${o.water}`,
      `අම්ලය සමඟ: ${o.acid}`,
      `භෂ්මය සමඟ: ${o.base}`,
      'ආවර්තයක් හරහා වමේ සිට දකුණට ඔක්සයිඩ මූලික → ඇම්ෆොටරික → අම්ලීය බවට වෙනස් වේ.',
    ],
    exam: [
      'Al₂O₃ ඇම්ෆොටරික බව — අම්ල හා භෂ්ම දෙක සමඟම ප්‍රතික්‍රියා කරන එකම ආවර්තය 3 ඔක්සයිඩයයි.',
      'SiO₂ ජලයේ නොද්‍රාව්‍ය වන අතර උණු කළ NaOH සමඟ පමණක් ප්‍රතික්‍රියා කරයි.',
      'ඔක්සයිඩයක අම්ල/භෂ්ම ස්වභාවය තීරණය වන්නේ මූලද්‍රව්‍යයේ විද්‍යුත්-ඍණාත්මකතාව හා ඔක්සිකරණ අවස්ථාව මත ය.',
    ],
    mcq: [
      {
        q: `${o.formula} අයත් වන්නේ කුමන ඔක්සයිඩ වර්ගයටද?`,
        options: ['මූලික ඔක්සයිඩ්', 'අම්ලීය ඔක්සයිඩ්', 'ඇම්ෆොටරික ඔක්සයිඩ්', 'උදාසීන ඔක්සයිඩ්'],
        correct: Math.max(0, ['මූලික ඔක්සයිඩ්', 'අම්ලීය ඔක්සයිඩ්', 'ඇම්ෆොටරික ඔක්සයිඩ්', 'උදාසීන ඔක්සයිඩ්'].indexOf(o.typeSi.replace(' (දුර්වල)', '').replace(' (ඉතා ප්‍රබල)', ''))),
        explain: `${o.formula} — ${o.typeSi}.`,
      },
    ],
  }
}

const TIP = {
  backgroundColor: 'rgba(8,14,24,0.96)',
  border: '1px solid rgba(94,234,212,0.3)',
  borderRadius: 8,
  fontSize: 11,
  color: '#e2e8f0',
  padding: '5px 8px',
}

export default function PeriodicMode({ onStudy, onOpenSolid }) {
  const [tab, setTab] = useState('table')
  const [selected, setSelected] = useState('Na')
  const [blockFilter, setBlockFilter] = useState(null)
  const [setId, setSetId] = useState('p3')

  const lanth = ELEMENTS.filter((e) => e.category === 'lanthanide')
  const actin = ELEMENTS.filter((e) => e.category === 'actinide')

  const set = TREND_SETS.find((s) => s.id === setId)
  const trendData = useMemo(
    () =>
      set.syms.map((sym) => {
        const e = ELEMENTS.find((x) => x.sym === sym)
        return {
          sym,
          si: e.si,
          ie: e.ie,
          en: e.enValue,
          mp: e.mp,
          radius: e.radius,
        }
      }),
    [set]
  )

  const openEl = (el) => {
    setSelected(el.sym)
    onStudy({
      si: `${el.si} (${el.sym})`,
      en: `${el.en} · Z ${el.z}`,
      study: buildElementStudy(el),
      meta: [
        el.config,
        `${CATEGORY_META[el.category]?.si}`,
        `Z = ${el.z}`,
        el.enValue ? `EN ${el.enValue}` : null,
      ].filter(Boolean),
    })
  }

  const sel = ELEMENTS.find((e) => e.sym === selected)

  return (
    <div className="space-y-3">
      {/* උප ටැබ */}
      <div className="flex flex-wrap items-center gap-1.5">
        {[
          { id: 'table', si: 'ආවර්තිතා වගුව', en: 'Periodic table' },
          { id: 'trends', si: 'ආවර්තිතා ප්‍රවණතා', en: 'Trends' },
          { id: 'oxides', si: 'ආවර්තය 3 ඔක්සයිඩ', en: 'Period 3 oxides' },
        ].map((t) => (
          <Chip key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
            {t.si}
          </Chip>
        ))}
        <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-wider text-slate-600 sm:block">
          118 මූලද්‍රව්‍ය · NIE syllabus aligned
        </span>
      </div>

      {tab === 'table' && (
        <div className="space-y-3">
          <Panel
            title="ආවර්තිතා වගුව"
            subtitle="Click any element for the study panel"
            right={
              <div className="flex flex-wrap justify-end gap-1">
                {BLOCKS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBlockFilter(blockFilter === b.id ? null : b.id)}
                    className="rounded border px-1.5 py-0.5 font-mono text-[9.5px] transition"
                    style={{
                      borderColor: blockFilter === b.id ? b.color : 'rgba(255,255,255,0.1)',
                      color: blockFilter === b.id ? '#05090f' : b.color,
                      background: blockFilter === b.id ? b.color : 'transparent',
                    }}
                  >
                    {b.si}
                  </button>
                ))}
              </div>
            }
          >
            <div className="overflow-x-auto pb-1">
              <div className="min-w-[620px]">
                <div
                  className="grid gap-[3px]"
                  style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
                >
                  {Array.from({ length: 18 }, (_, i) => (
                    <div
                      key={`h${i}`}
                      className="pb-0.5 text-center font-mono text-[8px] text-slate-600"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div
                  className="mt-[1px] grid gap-[3px]"
                  style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
                >
                  {ELEMENTS.filter((e) => e.group > 0).map((el) => (
                    <ElCell
                      key={el.sym}
                      el={el}
                      active={el.sym === selected}
                      dim={blockFilter && el.block !== blockFilter}
                      onClick={() => openEl(el)}
                    />
                  ))}
                </div>

                {/* f-ගොනුව */}
                <div className="mt-2 space-y-1">
                  {[
                    { label: 'ලැන්තනයිඩ', list: lanth },
                    { label: 'ඇක්ටිනයිඩ', list: actin },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-1.5">
                      <span className="w-[52px] shrink-0 text-right font-mono text-[8.5px] leading-tight text-slate-500">
                        {row.label}
                      </span>
                      <div
                        className="grid flex-1 gap-[3px]"
                        style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}
                      >
                        {row.list.map((el) => (
                          <ElCell
                            key={el.sym}
                            el={el}
                            active={el.sym === selected}
                            dim={blockFilter && el.block !== blockFilter}
                            onClick={() => openEl(el)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* වර්ණ පිළිවෙළ */}
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 border-t border-white/[0.06] pt-2.5">
              {Object.entries(CATEGORY_META).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span
                    className="h-2 w-2 rounded-sm"
                    style={{ background: v.color, opacity: 0.9 }}
                  />
                  {v.si}
                </span>
              ))}
            </div>
          </Panel>

          {sel && (
            <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
              <Panel title={`${sel.si} (${sel.sym})`} subtitle={sel.en} icon={Wand2}>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] sm:grid-cols-3">
                  {[
                    ['පරමාණුක ක්‍රමාංකය', sel.z],
                    ['සාපේක්ෂ ස්කන්ධය', sel.mass],
                    ['ගොනුව', `${sel.block}-ගොනුව`],
                    ['ආවර්තය', sel.period],
                    ['කාණ්ඩය', sel.group || 'f'],
                    ['EN (පෝලිං)', sel.enValue ?? '—'],
                    ['IE₁ (kJ/mol)', sel.ie ?? '—'],
                    ['ද්‍රවාංකය', sel.mp ? `${sel.mp} K` : '—'],
                    ['අරය (pm)', sel.radius ?? '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="border-b border-white/[0.05] pb-1">
                      <div className="font-mono text-[9px] uppercase tracking-wide text-slate-500">
                        {k}
                      </div>
                      <div className="si-num font-mono text-[12.5px] text-slate-200">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between rounded-lg border border-white/[0.07] bg-ink-950/50 px-3 py-2">
                  <span className="font-mono text-[12px] text-lab-teal">{sel.config}</span>
                  <button
                    onClick={() => openEl(sel)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 transition hover:text-lab-teal"
                  >
                    සම්පූර්ණ සටහන් <ChevronRight size={12} />
                  </button>
                </div>
              </Panel>

              <Panel title="ඔක්සයිඩ හා ස්වභාවය" subtitle="Element behaviour" icon={Droplets}>
                <p className="text-[12px] leading-relaxed text-slate-400">
                  {sel.category === 'alkali' || sel.category === 'alkaline'
                    ? 'ප්‍රබල මූලික ලෝහයකි — ඔක්සයිඩ මූලික වන අතර ජලය සමඟ භෂ්ම සාදයි.'
                    : sel.block === 'p' && ['Al', 'Si', 'P', 'S', 'Cl'].includes(sel.sym)
                    ? 'ආවර්තය 3 p-ගොනු මූලද්‍රව්‍යයකි — ඔක්සයිඩයේ ස්වභාවය ඇම්ෆොටරික සිට අම්ලීය දක්වා වෙනස් වේ.'
                    : sel.category === 'noble'
                    ? 'උත්කෘෂ්ට වායුවකි — සාමාන්‍ය තත්ත්වවලදී ඔක්සයිඩ සාදන්නේ නැත.'
                    : sel.category === 'halogen'
                    ? 'හැලජනයකි — ඔක්සයිඩ අම්ලීය වන අතර ඔක්සිකාරක බලය වැදගත් ය.'
                    : 'සංක්‍රාන්ති / d-ගොනු මූලද්‍රව්‍යයකි — විචල්‍ය ඔක්සිකරණ අවස්ථා හා වර්ණගත සංකීර්ණ පිළිබඳ අවධානය යොමු කරන්න.'}
                </p>
                <div className="mt-2.5 space-y-1.5">
                  {[
                    ['ඉලෙක්ට්‍රෝන වින්‍යාසය', sel.config],
                    ['වර්ගය', CATEGORY_META[sel.category]?.si],
                    ['බ්ලොක්', `${sel.block}-ගොනුව`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2 text-[11.5px]">
                      <span className="text-slate-500">{k}</span>
                      <span className="truncate font-mono text-slate-300">{v}</span>
                    </div>
                  ))}
                </div>
                {['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl'].includes(sel.sym) && (
                  <button
                    onClick={() => setTab('oxides')}
                    className="mt-2.5 w-full rounded-lg border border-lab-teal/30 bg-lab-teal/[0.07] px-2 py-1.5 text-[11.5px] text-lab-teal transition hover:bg-lab-teal/15"
                  >
                    ආවර්තය 3 ඔක්සයිඩ ප්‍රතික්‍රියා බලන්න
                  </button>
                )}
              </Panel>
            </div>
          )}
        </div>
      )}

      {tab === 'trends' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {TREND_SETS.map((s) => (
              <Chip key={s.id} active={setId === s.id} tone="violet" onClick={() => setSetId(s.id)}>
                {s.si} <span className="opacity-50">{s.en}</span>
              </Chip>
            ))}
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {[
              { key: 'ie', si: 'පළමු අයනීකරණ ශක්තිය', en: 'IE₁', unit: 'kJ mol⁻¹', color: '#5eead4' },
              { key: 'en', si: 'විද්‍යුත්-ඍණාත්මකතාව', en: 'EN', unit: 'පෝලිං', color: '#a78bfa' },
              { key: 'mp', si: 'ද්‍රවාංකය', en: 'm.p.', unit: 'K', color: '#fbbf24' },
              { key: 'radius', si: 'පරමාණුක අරය', en: 'radius', unit: 'pm', color: '#fb7185' },
            ].map((metric) => (
              <Panel
                key={metric.key}
                title={metric.si}
                subtitle={`${metric.en} · ${set.en}`}
                icon={TrendingUp}
              >
                <div className="h-[168px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 6, right: 10, bottom: 0, left: -18 }}>
                      <CartesianGrid stroke="rgba(255,255,255,0.055)" vertical={false} />
                      <XAxis
                        dataKey="sym"
                        tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }}
                        axisLine={false}
                        tickLine={false}
                        width={46}
                      />
                      <Tooltip
                        contentStyle={TIP}
                        labelFormatter={(l) => {
                          const d = trendData.find((x) => x.sym === l)
                          return `${l} — ${d?.si || ''}`
                        }}
                        formatter={(v) => [`${v} ${metric.unit}`, metric.en]}
                      />
                      <Line
                        type="monotone"
                        dataKey={metric.key}
                        stroke={metric.color}
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#05090f', stroke: metric.color, strokeWidth: 1.6 }}
                        activeDot={{ r: 5, fill: metric.color }}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-1 text-[10.5px] leading-relaxed text-slate-500">
                  අගය නොමැති මූලද්‍රව්‍ය (උදා: උත්කෘෂ්ට වායු) ප්‍රස්තාරයෙන් ඉවත් කර ඇත.
                </p>
              </Panel>
            ))}
          </div>

          <Panel title="ප්‍රවණතා පැහැදිලි කිරීම" subtitle="Why the trends run this way" icon={Info}>
            <div className="grid gap-3 text-[12px] leading-relaxed text-slate-400 md:grid-cols-2">
              <p>
                <span className="font-medium text-slate-200">ආවර්තයක් හරහා (වම → දකුණ):</span> ප්‍රධාන
                ක්වොන්ටම් මට්ටම නොවෙනස්ව පවතින අතර න්‍යෂ්ටික ආරෝපණය වැඩි වේ. ඉලෙක්ට්‍රෝන වඩාත් තදින්
                ඇදගැනේ → අරය අඩු වේ, අයනීකරණ ශක්තිය හා විද්‍යුත්-ඍණාත්මකතාව වැඩි වේ.
              </p>
              <p>
                <span className="font-medium text-slate-200">කාණ්ඩයක් තුළ (ඉහළ → පහළ):</span> අලුත්
                ඉලෙක්ට්‍රෝන කවචයක් එකතු වන බැවින් අරය වැඩි වේ; බාහිර ඉලෙක්ට්‍රෝනය න්‍යෂ්ටියෙන් ඈතින්
                බැවින් ඉවත් කිරීම පහසු ය → අයනීකරණ ශක්තිය අඩු වේ.
              </p>
              <p className="rounded-lg border border-lab-amber/20 bg-lab-amber/[0.05] px-2.5 py-2 text-[11.5px] text-amber-100/85">
                අසාමාන්‍යතා: Be → B (2s² පිරවූ උප-මට්ටම), N → O (අර්ධ-පිරවූ 2p³), Mg → Al, P → S.
                මේවා විභාගයේ නිතර අසනු ලැබේ.
              </p>
              <p className="rounded-lg border border-lab-violet/20 bg-lab-violet/[0.05] px-2.5 py-2 text-[11.5px] text-violet-100/85">
                ද්‍රවාංක ප්‍රවණතාව සරල රේඛීය නොවේ — දැලිස් ව්‍යුහය, බන්ධන වර්ගය හා අණු අතර බල
                මත රඳා පවතී.
              </p>
            </div>
          </Panel>
        </div>
      )}

      {tab === 'oxides' && (
        <div className="space-y-3">
          <Panel
            title="ආවර්තය 3 ඔක්සයිඩ — ජලය, අම්ල හා භෂ්ම සමඟ"
            subtitle="Period 3 oxide behaviour"
            icon={Beaker}
            right={
              <span className="hidden font-mono text-[10px] text-slate-500 sm:block">
                මූලික → ඇම්ෆොටරික → අම්ලීය
              </span>
            }
          >
            <div className="mb-3 h-[92px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PERIOD3_OXIDES} margin={{ top: 4, right: 6, bottom: 0, left: -24 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="formula"
                    tick={{ fill: '#94a3b8', fontSize: 9.5, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip contentStyle={TIP} formatter={(v) => [`pH ≈ ${v}`, 'ජලීය ද්‍රාවණය']} />
                  <Bar dataKey="ph" radius={[3, 3, 0, 0]}>
                    {PERIOD3_OXIDES.map((o) => (
                      <Cell
                        key={o.id}
                        fill={o.ph > 8 ? '#fb7185' : o.ph >= 6 ? '#fbbf24' : '#5eead4'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {PERIOD3_OXIDES.map((o) => (
                <button
                  key={o.id}
                  onClick={() =>
                    onStudy({
                      si: `${o.formula} · ${o.si}`,
                      en: o.typeEn,
                      study: oxideStudy(o),
                      meta: [o.typeSi, `pH ≈ ${o.ph}`, o.element],
                    })
                  }
                  className="glass-hover group rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-left"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[16px] font-semibold text-white">{o.formula}</span>
                    <Badge
                      color={o.ph > 8 ? '#fb7185' : o.ph >= 6 ? '#fbbf24' : '#5eead4'}
                    >
                      pH {o.ph}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-slate-400">{o.si}</p>
                  <p className="mt-1.5 text-[10.5px] font-medium text-lab-violet/80">{o.typeSi}</p>
                  <p className="mt-1.5 line-clamp-2 text-[10.5px] leading-relaxed text-slate-500">
                    {o.water}
                  </p>
                  <span className="mt-2 flex items-center gap-1 text-[10.5px] text-lab-teal opacity-0 transition group-hover:opacity-100">
                    සම්පූර්ණ ප්‍රතික්‍රියා <ChevronRight size={11} />
                  </span>
                </button>
              ))}
            </div>
          </Panel>

          <div className="grid gap-3 md:grid-cols-2">
            <Panel title="මූලික ඔක්සයිඩ වල ලක්ෂණ" subtitle="Basic oxides">
              <ul className="space-y-1.5 text-[12px] leading-relaxed text-slate-400">
                <li>• ලෝහ ඔක්සයිඩ — ජලය සමඟ භෂ්ම සාදයි (Na₂O → NaOH).</li>
                <li>• අම්ල සමඟ ප්‍රතික්‍රියා කර ලවණ + ජලය දෙයි.</li>
                <li>• භෂ්ම සමඟ ප්‍රතික්‍රියා නොකරයි.</li>
              </ul>
            </Panel>
            <Panel title="අම්ලීය ඔක්සයිඩ වල ලක්ෂණ" subtitle="Acidic oxides">
              <ul className="space-y-1.5 text-[12px] leading-relaxed text-slate-400">
                <li>• අලෝහ ඔක්සයිඩ — ජලය සමඟ අම්ල සාදයි (SO₃ → H₂SO₄).</li>
                <li>• භෂ්ම සමඟ ප්‍රතික්‍රියා කර ලවණ + ජලය දෙයි.</li>
                <li>• අම්ල සමඟ ප්‍රතික්‍රියා නොකරයි.</li>
                <li>• ඇම්ෆොටරික ඔක්සයිඩ (Al₂O₃) දෙකම සමඟ ප්‍රතික්‍රියා කරයි.</li>
              </ul>
            </Panel>
          </div>
        </div>
      )}
    </div>
  )
}
