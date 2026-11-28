import React, { useMemo, useState } from 'react'
import { Network, FlaskConical, ChevronRight, TestTube, Info, ArrowRight, Beaker } from 'lucide-react'
import { Panel, SectionLabel, Badge, Chip, Stat } from '../components/ui.jsx'
import { ORGANIC_NODES, ORGANIC_EDGES, QUAL_TESTS } from '../data/organic.js'

const FAMILY = {
  hydrocarbon: { color: '#5eead4', si: 'හයිඩ්‍රොකාබන' },
  aromatic: { color: '#fbbf24', si: 'සුවඳැති' },
  halide: { color: '#38bdf8', si: 'හැලයිඩ' },
  oxygen: { color: '#a78bfa', si: 'ඔක්සිජන් සංයෝග' },
  carbonyl: { color: '#fb7185', si: 'කාබොනයිල්' },
  acid: { color: '#facc15', si: 'අම්ල ව්‍යුත්පන්න' },
  nitrogen: { color: '#22d3ee', si: 'නයිට්‍රජන් සංයෝග' },
}

const nodeById = (id) => ORGANIC_NODES.find((n) => n.id === id)

function buildNodeStudy(node) {
  const out = ORGANIC_EDGES.filter((e) => e.from === node.id)
  const inc = ORGANIC_EDGES.filter((e) => e.from === node.id || e.to === node.id)

  const principles = [
    node.mechanism,
    ...out.slice(0, 5).map(
      (e) => `${node.si} → ${nodeById(e.to)?.si}: ${e.reagent}, ${e.condition} (${e.type}).`
    ),
  ]

  const mcq = []
  const pool = ORGANIC_EDGES.filter((e) => e.to !== node.id)
  out.slice(0, 2).forEach((e) => {
    const correct = e.reagent
    const opts = [correct]
    for (const p of pool) {
      if (opts.length >= 4) break
      if (!opts.includes(p.reagent)) opts.push(p.reagent)
    }
    const rot = opts.slice(1).concat(opts[0])
    mcq.push({
      q: `${node.si} → ${nodeById(e.to)?.si} පරිවර්තනය සඳහා භාවිත වන ප්‍රතිකාරකය කුමක්ද?`,
      options: rot,
      correct: rot.indexOf(correct),
      explain: `${e.eq} — තත්ත්වය: ${e.condition}.`,
    })
  })
  if (mcq.length === 0) {
    mcq.push({
      q: `${node.si} හි ක්‍රියාකාරී කාණ්ඩය සඳහන් කරන්න.`,
      options: [node.formula, 'R–O–R′', 'R–X', 'R–CHO'],
      correct: 0,
      explain: `${node.si} හි සූත්‍රය ${node.formula}.`,
    })
  }

  return {
    overview: node.overview,
    principles,
    reactions: inc.map((e) => ({
      name: `${nodeById(e.from)?.si} → ${nodeById(e.to)?.si}`,
      cond: e.reagent,
      eq: e.eq,
    })),
    exam: node.traps,
    mcq,
  }
}

function buildTestStudy(t) {
  return {
    overview: `${t.si} — ${t.applies} හඳුනාගැනීමට භාවිත වන ගුණාත්මක පරීක්ෂණයකි. ප්‍රතිකාරකය: ${t.reagent}. ධන ප්‍රතිචාරය: ${t.positive}.`,
    principles: [
      `ප්‍රතිකාරකය: ${t.reagent}`,
      `ධන ප්‍රතිඵලය: ${t.positive}`,
      `යෙදෙන ක්‍රියාකාරී කාණ්ඩ: ${t.applies}`,
      'නිශ්චිත ධන ප්‍රතිචාරයක් ලැබුණු විට පමණක් පරීක්ෂණය "ධන" ලෙස සැලකේ; වර්ණ වෙනස් නොවීම ඍණ වේ.',
    ],
    exam: [
      'Tollens හා Fehling ඇල්ඩිහයිඩ් සඳහා පමණක් — කීටෝන සමඟ ඍණ.',
      '2,4-DNP ඇල්ඩිහයිඩ් හා කීටෝන දෙක සමඟම ධන — එබැවින් ඒවා වෙන්කර ගැනීමට පමණක් භාවිත නොකරන්න.',
      'NaHCO₃ පරීක්ෂණය කාබොක්සිලික් අම්ල සඳහා පමණි; ෆීනෝල් සමඟ CO₂ නොදේ.',
    ],
    mcq: [
      {
        q: `${t.si} හි ධන ප්‍රතිඵලය කුමක්ද?`,
        options: [t.positive, 'වර්ණ වෙනසක් නැත', 'සුදු දුම්', 'නිල් ගිනිසිළුවක්'],
        correct: 0,
        explain: `${t.si}: ${t.reagent} සමඟ ${t.positive} ලැබේ.`,
      },
    ],
  }
}

function Edge({ e, a, b, active, dim, onHover }) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const startX = a.x + ux * 62
  const startY = a.y + uy * 22
  const endX = b.x - ux * 68
  const endY = b.y - uy * 22
  const mx = (startX + endX) / 2
  const my = (startY + endY) / 2
  const curve = 26
  const cx = mx - uy * curve
  const cy = my + ux * curve

  return (
    <g opacity={dim ? 0.12 : 1} className="transition-opacity duration-200">
      <path
        d={`M ${startX} ${startY} Q ${cx} ${cy} ${endX} ${endY}`}
        fill="none"
        stroke={active ? '#5eead4' : 'rgba(148,163,184,0.42)'}
        strokeWidth={active ? 2 : 1.15}
        markerEnd={active ? 'url(#arrowActive)' : 'url(#arrow)'}
      />
      {active && (
        <text
          x={cx + (e.id.charCodeAt(1) % 2 ? 16 : -16)}
          y={cy - 6}
          textAnchor="middle"
          className="pointer-events-none select-none"
          fill="#5eead4"
          fontSize="9.5"
          fontFamily="JetBrains Mono, monospace"
        >
          {e.reagent}
        </text>
      )}
    </g>
  )
}

export default function OrganicMode({ onStudy }) {
  const [tab, setTab] = useState('map')
  const [sel, setSel] = useState('alcohol')

  const node = nodeById(sel)
  const inc = useMemo(
    () => ORGANIC_EDGES.filter((e) => e.from === sel || e.to === sel),
    [sel]
  )

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <Chip active={tab === 'map'} onClick={() => setTab('map')}>
          අන්තර්-පරිවර්තන සිතියම
        </Chip>
        <Chip active={tab === 'tests'} onClick={() => setTab('tests')}>
          ගුණාත්මක පරීක්ෂණ
        </Chip>
        <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-wider text-slate-600 sm:block">
          {ORGANIC_NODES.length} කාණ්ඩ · {ORGANIC_EDGES.length} ප්‍රතික්‍රියා
        </span>
      </div>

      {tab === 'map' && (
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Panel title="ක්‍රියාකාරී කාණ්ඩ සිතියම" subtitle="ක්‍රියාකාරී කාණ්ඩයක් තෝරන්න" icon={Network}>
            <div className="overflow-x-auto">
              <svg viewBox="0 0 1120 730" className="min-w-[760px] w-full">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(148,163,184,0.55)" />
                  </marker>
                  <marker id="arrowActive" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#5eead4" />
                  </marker>
                </defs>

                {ORGANIC_EDGES.map((e) => {
                  const a = nodeById(e.from)
                  const b = nodeById(e.to)
                  if (!a || !b) return null
                  const active = e.from === sel || e.to === sel
                  return (
                    <Edge
                      key={e.id}
                      e={e}
                      a={a}
                      b={b}
                      active={active}
                      dim={!active}
                    />
                  )
                })}

                {ORGANIC_NODES.map((n) => {
                  const fam = FAMILY[n.family] || FAMILY.hydrocarbon
                  const active = n.id === sel
                  return (
                    <g
                      key={n.id}
                      onClick={() => setSel(n.id)}
                      onDoubleClick={() =>
                        onStudy({
                          si: n.si,
                          en: `${n.en} · ${n.formula}`,
                          study: buildNodeStudy(n),
                          meta: [n.formula, fam.si, `${ORGANIC_EDGES.filter((e) => e.from === n.id).length} ප්‍රතික්‍රියා`],
                        })
                      }
                      className="cursor-pointer"
                    >
                      <rect
                        x={n.x - 66}
                        y={n.y - 24}
                        width={132}
                        height={48}
                        rx={10}
                        fill={active ? fam.color : 'rgba(11,19,32,0.95)'}
                        stroke={fam.color}
                        strokeWidth={active ? 2 : 1}
                        opacity={active ? 0.95 : 0.9}
                      />
                      <text
                        x={n.x}
                        y={n.y - 6}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="700"
                        fontFamily="JetBrains Mono, monospace"
                        fill={active ? '#05090f' : fam.color}
                      >
                        {n.formula}
                      </text>
                      <text
                        x={n.x}
                        y={n.y + 9}
                        textAnchor="middle"
                        fontSize="10.5"
                        fill={active ? '#0b1320' : '#cbd5e1'}
                      >
                        {n.si}
                      </text>
                      <text
                        x={n.x}
                        y={n.y + 21}
                        textAnchor="middle"
                        fontSize="7.5"
                        fontFamily="JetBrains Mono, monospace"
                        fill={active ? '#0b1320' : '#64748b'}
                      >
                        {n.en}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/[0.06] pt-2">
              {Object.entries(FAMILY).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="h-2 w-2 rounded-sm" style={{ background: v.color }} />
                  {v.si}
                </span>
              ))}
              <span className="ml-auto font-mono text-[9.5px] text-slate-600">
                දෙවරක් click → සම්පූර්ණ සටහන්
              </span>
            </div>
          </Panel>

          <div className="space-y-3">
            <Panel title={node.si} subtitle={`${node.en} · ${node.formula}`} icon={Beaker}>
              <p className="text-[12px] leading-relaxed text-slate-400">{node.overview}</p>
              <div className="mt-2.5">
                <SectionLabel icon={Info}>යාන්ත්‍රණය</SectionLabel>
                <p className="text-[11.5px] leading-relaxed text-slate-400">{node.mechanism}</p>
              </div>
              <button
                onClick={() =>
                  onStudy({
                    si: node.si,
                    en: `${node.en} · ${node.formula}`,
                    study: buildNodeStudy(node),
                    meta: [node.formula, FAMILY[node.family]?.si],
                  })
                }
                className="mt-3 flex w-full items-center justify-between rounded-lg border border-lab-teal/30 bg-lab-teal/[0.07] px-2.5 py-2 text-[12px] text-lab-teal transition hover:bg-lab-teal/15"
              >
                සම්පූර්ණ සටහන් + MCQ
                <ChevronRight size={13} />
              </button>
            </Panel>

            <Panel title="සම්බන්ධ ප්‍රතික්‍රියා" subtitle={`${inc.length} reactions`} icon={FlaskConical} pad={false}>
              <div className="max-h-[300px] space-y-1.5 overflow-y-auto p-2.5">
                {inc.map((e) => {
                  const outgoing = e.from === sel
                  const other = nodeById(outgoing ? e.to : e.from)
                  return (
                    <div
                      key={e.id}
                      className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-2"
                    >
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <span className={outgoing ? 'text-lab-teal' : 'text-lab-violet'}>
                          {outgoing ? '→' : '←'}
                        </span>
                        <span className="truncate">{other?.si}</span>
                        <span className="ml-auto shrink-0 font-mono text-[9.5px] text-slate-500">
                          {e.reagent}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-[10px] leading-relaxed text-slate-500">{e.eq}</p>
                      <p className="text-[9.5px] text-lab-amber/70">{e.condition} · {e.type}</p>
                    </div>
                  )
                })}
              </div>
            </Panel>
          </div>
        </div>
      )}

      {tab === 'tests' && (
        <div className="space-y-3">
          <Panel
            title="ගුණාත්මක හඳුනාගැනීමේ පරීක්ෂණ"
            subtitle="Qualitative identification tests"
            icon={TestTube}
          >
            <div className="grid gap-2 md:grid-cols-2">
              {QUAL_TESTS.map((t) => (
                <button
                  key={t.id}
                  onClick={() =>
                    onStudy({
                      si: t.si,
                      en: 'Qualitative test',
                      study: buildTestStudy(t),
                      meta: [t.applies],
                    })
                  }
                  className="glass-hover group rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[13px] font-medium text-slate-100">{t.si}</span>
                    <Badge color="#22d3ee">{t.applies}</Badge>
                  </div>
                  <div className="mt-2 grid gap-1 text-[11px]">
                    <div className="flex gap-1.5">
                      <span className="w-16 shrink-0 text-slate-500">ප්‍රතිකාරකය</span>
                      <span className="text-slate-300">{t.reagent}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="w-16 shrink-0 text-slate-500">ධන ප්‍රතිඵලය</span>
                      <span className="text-lab-teal">{t.positive}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Panel>

          <div className="grid gap-3 md:grid-cols-2">
            <Panel title="ඇල්ඩිහයිඩ් vs කීටෝන" subtitle="Carbonyl discrimination">
              <div className="space-y-2 text-[11.5px] leading-relaxed text-slate-400">
                <div className="flex gap-2">
                  <ArrowRight size={12} className="mt-1 shrink-0 text-lab-teal" />
                  <p><span className="text-slate-200">Tollens / Fehling:</span> ඇල්ඩිහයිඩ් පමණක් ධන; කීටෝන ඍණ.</p>
                </div>
                <div className="flex gap-2">
                  <ArrowRight size={12} className="mt-1 shrink-0 text-lab-teal" />
                  <p><span className="text-slate-200">2,4-DNP:</span> දෙකම ධන — එබැවින් කාබොනයිල් පවතින බව පෙන්වයි.</p>
                </div>
                <div className="flex gap-2">
                  <ArrowRight size={12} className="mt-1 shrink-0 text-lab-teal" />
                  <p><span className="text-slate-200">අයඩෝෆෝම්:</span> CH₃CO– කාණ්ඩය ඇති මෙතිල් කීටෝන හා CH₃CH(OH)– ධන.</p>
                </div>
              </div>
            </Panel>
            <Panel title="අම්ල/භෂ්ම ස්වභාවය" subtitle="Acid–base tests">
              <div className="space-y-2 text-[11.5px] leading-relaxed text-slate-400">
                <div className="flex gap-2">
                  <ArrowRight size={12} className="mt-1 shrink-0 text-lab-amber" />
                  <p><span className="text-slate-200">NaHCO₃:</span> කාබොක්සිලික් අම්ල පමණක් CO₂ දෙයි (ෆීනෝල් නොදේ).</p>
                </div>
                <div className="flex gap-2">
                  <ArrowRight size={12} className="mt-1 shrink-0 text-lab-amber" />
                  <p><span className="text-slate-200">ලිට්මස්:</span> ඇමීන භෂ්මීය (නිල්); කාබොක්සිලික් අම්ල රතු.</p>
                </div>
                <div className="flex gap-2">
                  <ArrowRight size={12} className="mt-1 shrink-0 text-lab-amber" />
                  <p><span className="text-slate-200">FeCl₃:</span> ෆීනෝල් සමඟ දම් පැහැය — ෆීනෝල් හඳුනාගැනීම.</p>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  )
}
