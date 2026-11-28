import React, { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { ELEMENT_STYLE } from '../data/molecules.js'

const EXTRA = {
  Fe: { color: '#94a3b8', radius: 0.26 },
  Cu: { color: '#f59e0b', radius: 0.24 },
  Po: { color: '#a3e635', radius: 0.3 },
  Na: { color: '#a855f7', radius: 0.18 },
  Mg: { color: '#4ade80', radius: 0.22 },
  Zn: { color: '#7dd3fc', radius: 0.24 },
}
const styleOf = (el) => ELEMENT_STYLE[el] || EXTRA[el] || { color: '#64748b', radius: 0.3 }

const SPHERE = new THREE.SphereGeometry(1, 26, 20)
const CYL = new THREE.CylinderGeometry(1, 1, 1, 14, 1, false)

function Atom({ position, color, radius, label, showLabel }) {
  return (
    <group position={position}>
      <mesh geometry={SPHERE} scale={radius} castShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.34}
          metalness={0.22}
          emissive={color}
          emissiveIntensity={0.14}
        />
      </mesh>
      {showLabel && label && (
        <Html center distanceFactor={9} zIndexRange={[20, 0]}>
          <span className="pointer-events-none select-none font-mono text-[11px] font-bold text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {label}
          </span>
        </Html>
      )}
    </group>
  )
}

function AngleArc({ bonds, atoms, angleLabel }) {
  const geom = useMemo(() => {
    if (bonds.length < 2) return null
    const c = new THREE.Vector3(...atoms[bonds[0][0]].pos)
    const d1 = new THREE.Vector3(...atoms[bonds[0][1]].pos).sub(c).normalize()
    const d2 = new THREE.Vector3(...atoms[bonds[1][1]].pos).sub(c).normalize()
    const r = 0.85
    const n = 26
    const pts = []
    for (let i = 0; i <= n; i++) {
      const v = new THREE.Vector3().copy(d1).lerp(d2, i / n).normalize().multiplyScalar(r)
      pts.push(v.add(c))
    }
    return { curve: new THREE.CatmullRomCurve3(pts), mid: pts[Math.floor(n / 2)] }
  }, [bonds, atoms])
  if (!geom) return null
  return (
    <group>
      <mesh>
        <tubeGeometry args={[geom.curve, 24, 0.012, 6, false]} />
        <meshBasicMaterial color="#5eead4" transparent opacity={0.85} />
      </mesh>
      <Html position={geom.mid} center distanceFactor={8} zIndexRange={[30, 0]}>
        <span className="pointer-events-none whitespace-nowrap rounded border border-lab-teal/40 bg-ink-950/85 px-1.5 py-0.5 font-mono text-[9.5px] text-lab-teal">
          {angleLabel}
        </span>
      </Html>
    </group>
  )
}

function Model({ atoms, bonds, explode, showLabels, lonePairs, cell, angleLabel, showAngle }) {
  const positions = useRef([])
  const atomGroups = useRef([])
  const sticks = useRef([])

  // පරමාණු ආරම්භක ස්ථාන
  useEffect(() => {
    positions.current = atoms.map((a) => new THREE.Vector3(...a.pos))
    atomGroups.current.forEach((g, i) => {
      if (g && positions.current[i]) g.position.copy(positions.current[i])
    })
  }, [atoms])

  const stickList = useMemo(() => {
    const out = []
    bonds.forEach(([a, b, order = 1]) => {
      const n = Math.max(1, Math.min(3, order))
      for (let i = 0; i < n; i++) {
        out.push({ a, b, off: n === 1 ? 0 : (i - (n - 1) / 2) * 0.135 })
      }
    })
    return out
  }, [bonds])

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 7)
    atoms.forEach((a, i) => {
      const target = new THREE.Vector3(...a.pos).multiplyScalar(1 + explode * 1.25)
      if (!positions.current[i]) positions.current[i] = new THREE.Vector3(...a.pos)
      positions.current[i].lerp(target, k)
      const g = atomGroups.current[i]
      if (g) g.position.copy(positions.current[i])
    })

    const up = new THREE.Vector3(0, 1, 0)
    stickList.forEach((s, i) => {
      const mesh = sticks.current[i]
      if (!mesh) return
      const p1 = positions.current[s.a]
      const p2 = positions.current[s.b]
      if (!p1 || !p2) return
      const dir = new THREE.Vector3().subVectors(p2, p1)
      const len = dir.length()
      if (len < 0.0001) return
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)
      const perp = new THREE.Vector3().crossVectors(dir.clone().normalize(), up)
      if (perp.lengthSq() < 1e-5) perp.set(1, 0, 0)
      perp.normalize().multiplyScalar(s.off)
      mesh.position.copy(mid).add(perp)
      mesh.quaternion.setFromUnitVectors(up, dir.clone().normalize())
      mesh.scale.set(0.062, len, 0.062)
      if (mesh.material) mesh.material.opacity = Math.max(0, 1 - explode * 1.5)
    })
  })

  return (
    <group>
      {atoms.map((a, i) => {
        const st = styleOf(a.el)
        return (
          <group
            key={i}
            ref={(el) => (atomGroups.current[i] = el)}
            position={a.pos}
          >
            <Atom
              position={[0, 0, 0]}
              color={a.color || st.color}
              radius={a.r || st.radius}
              label={a.el}
              showLabel={showLabels}
            />
          </group>
        )
      })}

      {stickList.map((s, i) => (
        <mesh
          key={`s${i}`}
          ref={(el) => (sticks.current[i] = el)}
          geometry={CYL}
          renderOrder={1}
        >
          <meshStandardMaterial
            color="#cbd5e1"
            roughness={0.4}
            metalness={0.35}
            transparent
            opacity={1}
          />
        </mesh>
      ))}

      {/* තනි ඉලෙක්ට්‍රෝන යුගල */}
      {lonePairs?.map((p, i) => (
        <group
          key={`lp${i}`}
          position={[p[0] * (1 + explode), p[1] * (1 + explode * 1.2), p[2] * (1 + explode)]}
        >
          <mesh scale={[0.2, 0.34, 0.2]}>
            <sphereGeometry args={[1, 18, 14]} />
            <meshStandardMaterial
              color="#f472b6"
              emissive="#f472b6"
              emissiveIntensity={0.5}
              transparent
              opacity={0.42}
              roughness={0.2}
            />
          </mesh>
          <mesh scale={[0.09, 0.09, 0.09]} position={[0, 0.42, 0]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshBasicMaterial color="#fbcfe8" />
          </mesh>
        </group>
      ))}

      {showAngle && !explode && (
        <AngleArc bonds={bonds} atoms={atoms} angleLabel={angleLabel} />
      )}

      {cell && (
        <Line
          points={[
            [-1.3, -1.3, -1.3], [1.3, -1.3, -1.3], [1.3, -1.3, 1.3], [-1.3, -1.3, 1.3], [-1.3, -1.3, -1.3],
            [-1.3, 1.3, -1.3], [1.3, 1.3, -1.3], [1.3, 1.3, 1.3], [-1.3, 1.3, 1.3], [-1.3, 1.3, -1.3],
          ]}
          color="#5eead4"
          lineWidth={1}
          transparent
          opacity={0.28 * (1 - explode)}
          dashed
          dashSize={0.12}
          gapSize={0.08}
        />
      )}
      {cell && (
        <Line
          points={[
            [1.3, -1.3, -1.3], [1.3, 1.3, -1.3],
            [1.3, -1.3, 1.3], [1.3, 1.3, 1.3],
            [-1.3, -1.3, 1.3], [-1.3, 1.3, 1.3],
          ]}
          color="#5eead4"
          lineWidth={1}
          transparent
          opacity={0.28 * (1 - explode)}
          dashed
          dashSize={0.12}
          gapSize={0.08}
          segments
        />
      )}
    </group>
  )
}

export default function Scene3D({
  atoms,
  bonds = [],
  explode = 0,
  showLabels = false,
  lonePairs = [],
  cell = false,
  angleLabel,
  showAngle = false,
  autoRotate = true,
  camera = [0, 2.2, 7.4],
  height = '100%',
}) {
  return (
    <div style={{ height, width: '100%' }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: camera, fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[5, 8, 6]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-6, -2, -5]} intensity={0.7} color="#5eead4" />
        <pointLight position={[0, -5, 3]} intensity={26} distance={16} color="#a78bfa" />
        <Model
          atoms={atoms}
          bonds={bonds}
          explode={explode}
          showLabels={showLabels}
          lonePairs={lonePairs}
          cell={cell}
          angleLabel={angleLabel}
          showAngle={showAngle}
        />
        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          autoRotate={autoRotate}
          autoRotateSpeed={0.75}
          minDistance={4}
          maxDistance={15}
        />
      </Canvas>
    </div>
  )
}
