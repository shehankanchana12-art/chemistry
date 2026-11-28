import React, { useState } from 'react'
import {
  Atom,
  Hexagon,
  Calculator,
  Wind,
  Flame,
  Gauge,
  Scale,
  Zap,
  Grid3x3,
  Network,
  Factory,
  FlaskConical,
  Languages,
  BookOpen,
  Menu,
  X,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import { LangProvider, useLang, ShowEn } from './components/ui.jsx'
import StudyDrawer from './components/StudyDrawer.jsx'
import UnitPage from './components/UnitPage.jsx'
import GeometryMode from './modes/GeometryMode.jsx'
import PeriodicMode from './modes/PeriodicMode.jsx'
import SolidMode from './modes/SolidMode.jsx'
import EquilibriumMode from './modes/EquilibriumMode.jsx'
import OrganicMode from './modes/OrganicMode.jsx'
import { UNITS } from './data/syllabus.js'

const ICONS = { Atom, Hexagon, Calculator, Wind, Flame, Gauge, Scale, Zap, Grid3x3, Network, Factory }

const MODES = [
  { id: 'geometry', si: 'අණුක ජ්‍යාමිතිය', en: 'Molecular geometry', icon: Hexagon },
  { id: 'periodic', si: 'ආවර්තිතා වගුව', en: 'Periodic table', icon: Grid3x3 },
  { id: 'solid', si: 'ඝන අවස්ථාව', en: 'Solid state', icon: Atom },
  { id: 'equilibrium', si: 'සමතුලිතතාව හා ශක්තිය', en: 'Equilibrium & energy', icon: Scale },
  { id: 'organic', si: 'කාබනික සිතියම', en: 'Organic roadmap', icon: Network },
]

function Header({ view, setView, mode, onMenu }) {
  const { showEn, setShowEn } = useLang()
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-ink-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-[1480px] items-center gap-3 px-3 lg:px-5">
        <button
          onClick={onMenu}
          className="rounded-lg border border-white/10 p-1.5 text-slate-400 lg:hidden"
          aria-label="මෙනුව"
        >
          <Menu size={16} />
        </button>

        <button onClick={() => setView('home')} className="flex min-w-0 items-center gap-2.5 text-left">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-lab-teal/35 bg-gradient-to-br from-lab-teal/25 to-lab-violet/20">
            <FlaskConical size={17} className="text-lab-teal" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-serif_si text-[16px] font-bold leading-tight text-white">
              රසායන ප්‍රයෝගාලය
            </span>
            <span className="block truncate font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">
              A/L Chemistry · Interactive Lab
            </span>
          </span>
        </button>

        <nav className="ml-2 hidden flex-1 items-center gap-1 xl:flex">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setView(m.id)
              }}
              className={`rounded-lg px-2.5 py-1.5 text-[12px] transition ${
                view === m.id
                  ? 'bg-lab-teal/12 text-lab-teal'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              {m.si}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowEn(!showEn)}
            title="English රසායනික පද පෙන්වන්න / සඟවන්න"
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[10.5px] transition ${
              showEn
                ? 'border-lab-teal/45 bg-lab-teal/12 text-lab-teal'
                : 'border-white/10 bg-white/[0.03] text-slate-500 hover:text-slate-300'
            }`}
          >
            <Languages size={13} />
            <span className="hidden sm:inline">සිංහල</span>
            <span className="opacity-50">+</span>
            <span>EN</span>
          </button>
          <button
            onClick={() => setView('units')}
            className={`hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11.5px] transition sm:flex ${
              view === 'units'
                ? 'border-lab-violet/45 bg-lab-violet/12 text-lab-violet'
                : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen size={13} />
            විෂය මාලාව
          </button>
        </div>
      </div>
    </header>
  )
}

function Sidebar({ view, setView, unitId, setUnitId, open, onClose }) {
  const { showEn } = useLang()
  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 z-30 bg-ink-950/70 backdrop-blur-sm lg:hidden" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[248px] shrink-0 overflow-y-auto border-r border-white/[0.07] bg-ink-900/95 px-2.5 py-4 backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-[60px] lg:z-0 lg:h-[calc(100vh-60px)] lg:translate-x-0 lg:bg-transparent ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-slate-500">
            විෂය මාලා ඒකක · Units
          </p>
          <button onClick={onClose} className="text-slate-500 lg:hidden">
            <X size={15} />
          </button>
        </div>

        <div className="space-y-0.5">
          {UNITS.map((u, i) => {
            const Icon = ICONS[u.icon] || Atom
            const active = view === 'units' && unitId === u.id
            return (
              <button
                key={u.id}
                onClick={() => {
                  setUnitId(u.id)
                  setView('units')
                  onClose()
                }}
                className={`group flex w-full items-center gap-2.5 rounded-lg px-2 py-[7px] text-left transition ${
                  active
                    ? 'border border-lab-teal/30 bg-lab-teal/[0.09] text-lab-teal'
                    : 'border border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                }`}
              >
                <Icon size={13} className="shrink-0 opacity-80" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11.8px] leading-tight">{u.si}</span>
                  {showEn && (
                    <span className="block truncate font-mono text-[8.5px] leading-tight text-slate-600">
                      {u.en}
                    </span>
                  )}
                </span>
                <span className="font-mono text-[8.5px] text-slate-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5">
          <div className="flex items-center gap-1.5">
            <GraduationCap size={12} className="text-lab-violet" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
              NIE Syllabus
            </span>
          </div>
          <p className="mt-1 text-[10.5px] leading-relaxed text-slate-500">
            ශ්‍රී ලංකා ජාතික අධ්‍යාපන ආයතනයේ උසස් පෙළ රසායන විද්‍යාව විෂය මාලාව හා ගුරු මාර්ගෝපදේශ
            මත පදනම්ව සකස් කර ඇත.
          </p>
        </div>

        <div className="mt-3 flex items-center gap-1.5 px-1 text-[9.5px] text-slate-600">
          <Sparkles size={10} />
          <span>සිමියුලේෂන් 5 · අණු 8 · මූලද්‍රව්‍ය 118</span>
        </div>
      </aside>
    </>
  )
}

function Home({ onLaunch, setUnitId, setView }) {
  return (
    <div className="space-y-3">
      <div className="glass relative overflow-hidden p-6 sm:p-8">
        <div className="noise absolute inset-0" />
        <div className="relative max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-lab-teal/80">
            ශ්‍රී ලංකා උසස් පෙළ · සිංහල මාධ්‍යය
          </p>
          <h1 className="mt-2 font-serif_si text-[32px] font-bold leading-tight text-white sm:text-[42px]">
            රසායන විද්‍යාව{' '}
            <span className="bg-gradient-to-r from-lab-teal to-lab-violet bg-clip-text text-transparent">
              ඇස් දෙකෙන් දකින්න
            </span>
          </h1>
          <p className="mt-3 text-[13.5px] leading-[1.9] text-slate-400">
            අණුක ජ්‍යාමිතිය 3D ලෙස කොටස් වෙන් කර පරීක්ෂා කරන්න, ආවර්තිතා ප්‍රවණතා ප්‍රස්තාරවලින්
            තේරුම් ගන්න, ස්ඵටික දැලිස් තුළ අයන පිහිටන ආකාරය බලන්න, සමතුලිතතාව හා අනුමාපනය
            අන්තර්ක්‍රියාකාරීව අත්දකින්න. සෑම අයිතමයක්ම විභාග උගුල් හා MCQ සමඟ.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { id: 'geometry', label: 'අණුක ජ්‍යාමිතිය' },
              { id: 'periodic', label: 'ආවර්තිතා වගුව' },
              { id: 'organic', label: 'කාබනික සිතියම' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => onLaunch(b.id)}
                className="rounded-lg border border-lab-teal/35 bg-lab-teal/10 px-3 py-1.5 text-[12px] text-lab-teal transition hover:bg-lab-teal/20"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => onLaunch(m.id)}
            className="glass glass-hover group flex items-start gap-3 p-3.5 text-left"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
              <m.icon size={15} className="text-lab-teal" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-medium text-slate-100">{m.si}</span>
              <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
                {m.en}
              </span>
            </span>
          </button>
        ))}
        <button
          onClick={() => {
            setUnitId(UNITS[0].id)
            setView('units')
          }}
          className="glass glass-hover flex items-start gap-3 p-3.5 text-left"
        >
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
            <BookOpen size={15} className="text-lab-violet" />
          </span>
          <span>
            <span className="block text-[13px] font-medium text-slate-100">විෂය මාලා ඒකක</span>
            <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
              11 themes · study notes
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
      <Shell />
    </LangProvider>
  )
}

function Shell() {
  const [view, setView] = useState('home')
  const [unitId, setUnitId] = useState(UNITS[0].id)
  const [drawer, setDrawer] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const unit = UNITS.find((u) => u.id === unitId)
  const openStudy = (t) => setDrawer(t)
  const launch = (mode) => {
    setView(mode)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  let content
  if (view === 'geometry') content = <GeometryMode onStudy={openStudy} />
  else if (view === 'periodic') content = <PeriodicMode onStudy={openStudy} />
  else if (view === 'solid') content = <SolidMode onStudy={openStudy} />
  else if (view === 'equilibrium') content = <EquilibriumMode onStudy={openStudy} />
  else if (view === 'organic') content = <OrganicMode onStudy={openStudy} />
  else if (view === 'units')
    content = (
      <UnitPage
        unit={unit}
        onLaunch={launch}
        onStudy={openStudy}
        setUnitId={setUnitId}
      />
    )
  else content = <Home onLaunch={launch} setUnitId={setUnitId} setView={setView} />

  const activeMode = MODES.find((m) => m.id === view)

  return (
    <div className="min-h-screen">
      <Header view={view} setView={setView} mode={view} onMenu={() => setMenuOpen(true)} />
      <div className="mx-auto flex max-w-[1480px]">
        <Sidebar
          view={view}
          setView={setView}
          unitId={unitId}
          setUnitId={setUnitId}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
        <main className="min-w-0 flex-1 px-3 py-3 lg:px-5 lg:py-4">
          {activeMode && (
            <div className="mb-2.5 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-lab-teal/70">
                  ප්‍රයෝගාලය · Simulation workspace
                </p>
                <h2 className="font-serif_si text-[21px] font-semibold leading-tight text-white">
                  {activeMode.si}
                  <ShowEn>
                    <span className="ml-2 font-mono text-[10.5px] font-normal uppercase tracking-wider text-slate-500">
                      {activeMode.en}
                    </span>
                  </ShowEn>
                </h2>
              </div>
              <div className="flex flex-wrap gap-1 xl:hidden">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setView(m.id)}
                    className={`rounded-md border px-2 py-1 text-[10.5px] transition ${
                      view === m.id
                        ? 'border-lab-teal/45 bg-lab-teal/12 text-lab-teal'
                        : 'border-white/10 text-slate-500'
                    }`}
                  >
                    {m.si}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div key={view} className="animate-floatUp">
            {content}
          </div>

          <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-3 text-[10px] text-slate-600">
            <span>රසායන ප්‍රයෝගාලය · ශ්‍රී ලංකා උසස් පෙළ රසායන විද්‍යාව (සිංහල මාධ්‍යය)</span>
            <span className="font-mono">
              NIE syllabus · සංකල්පීය අත්දැකීම් මත පදනම්ව
            </span>
          </footer>
        </main>
      </div>

      <StudyDrawer target={drawer} onClose={() => setDrawer(null)} />
    </div>
  )
}
