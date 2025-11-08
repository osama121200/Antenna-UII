import { useEffect, useMemo, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

function DroneIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M4 6h4M6 4v4M16 6h4M18 4v4M4 18h4M6 16v4M16 18h4M18 16v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function useImportAntennaImages() {
  // Load all images from antenna_parts directory using default Vite ?url behavior
  const imgs = useMemo(() => {
    const modules = import.meta.glob('../../assets/images/antenna_parts/*.{jpg,JPG,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' })
    const entries = Object.entries(modules).map(([path, url]) => {
      const base = path.replace(/\\/g, '/').split('/').pop() || path
      const name = base.replace(/\.[^.]+$/, '')
      const idx = Number(name.replace(/[^0-9]/g, '')) || 0
      return { id: base, url, name: base, index: idx }
    })
    entries.sort((a, b) => a.index - b.index)
    return entries
  }, [])
  return imgs
}

function TowerSvg() {
  // Detailed SVG tower with depth, platforms, ladder, braces, bolts, and subtle shadows
  return (
    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-stretch justify-center pointer-events-none">
      <svg viewBox="0 0 120 1000" preserveAspectRatio="xMidYMid meet" className="h-full w-auto" aria-hidden="true">
        <defs>
          {/* Materials */}
          <linearGradient id="metalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
          <linearGradient id="railShade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4b5563" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#6b7280" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#374151" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="braceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="shimmerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
          </linearGradient>
          {/* Background grid */}
          <pattern id="faintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94a3b8" strokeOpacity="0.12" strokeWidth="1" />
          </pattern>
          {/* Drop shadow for tower group */}
          <filter id="towerShadow" x="-30%" y="-5%" width="160%" height="110%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.18" />
          </filter>
          {/* Section band shading */}
          <linearGradient id="bandShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background grid */}
        <rect x="0" y="0" width="120" height="1000" fill="url(#faintGrid)" />

        {/* Tower group with shadow */}
        <g filter="url(#towerShadow)">
          {/* Outer body */}
          <rect x="28" y="10" width="64" height="980" rx="4" fill="url(#metalGrad)" stroke="#94a3b8" strokeOpacity="0.6" />

          {/* Rear rails (depth hint) */}
          <rect x="30" y="14" width="4" height="972" rx="1" fill="#6b7280" opacity="0.25" />
          <rect x="102" y="14" width="4" height="972" rx="1" fill="#6b7280" opacity="0.25" />

          {/* Front rails */}
          <rect x="34" y="14" width="8" height="972" rx="2" fill="url(#railShade)" />
          <rect x="94" y="14" width="8" height="972" rx="2" fill="url(#railShade)" />

          {/* Section bands every 10 m (6 bands in 60 m) */}
          {Array.from({ length: 6 }).map((_, j) => {
            const y = 14 + (j / 6) * 972
            return <rect key={`band-${j}`} x="28" y={y} width="64" height={972 / 6} fill="url(#bandShade)" />
          })}

          {/* Horizontal rungs (12) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const y = 14 + (i / 11) * 972
            return <rect key={`rung-${i}`} x="36" y={y} width="66" height="2" fill="#cbd5e1" opacity="0.7" />
          })}

          {/* Ladder (center-left) */}
          <rect x="54" y="20" width="2" height="952" fill="#6b7280" opacity="0.6" />
          <rect x="66" y="20" width="2" height="952" fill="#6b7280" opacity="0.6" />
          {Array.from({ length: 28 }).map((_, i) => {
            const y = 20 + (i / 27) * 952
            return <rect key={`ladder-${i}`} x="56" y={y} width="10" height="1.6" fill="#9ca3af" opacity="0.9" />
          })}

          {/* Diagonal cross-braces (20 segments) */}
          {Array.from({ length: 20 }).map((_, i) => {
            const segH = 972 / 20
            const y0 = 14 + i * segH
            const y1 = y0 + segH
            const leftX = 38
            const rightX = 98
            const isEven = i % 2 === 0
            return (
              <g key={`brace-${i}`} stroke="url(#braceGrad)" strokeWidth="2" opacity="0.78">
                {isEven ? (
                  <line x1={leftX} y1={y0 + 4} x2={rightX} y2={y1 - 4} />
                ) : (
                  <line x1={rightX} y1={y0 + 4} x2={leftX} y2={y1 - 4} />
                )}
              </g>
            )
          })}

          {/* Brace plate bolts at segment boundaries */}
          {Array.from({ length: 21 }).map((_, i) => {
            const segH = 972 / 20
            const y = 14 + i * segH
            return (
              <g key={`bolt-row-${i}`} fill="#94a3af" opacity="0.7">
                <circle cx="36" cy={y} r="1.4" />
                <circle cx="100" cy={y} r="1.4" />
              </g>
            )
          })}

          {/* Platforms every 20% */}
          {Array.from({ length: 4 }).map((_, i) => {
            const y = 14 + ((i + 1) / 5) * 972
            return (
              <g key={`platform-${i}`}>
                <rect x="34" y={y - 2} width="68" height="4" rx="1" fill="#737373" opacity="0.35" />
                <rect x="34" y={y - 1} width="68" height="2" rx="1" fill="#e5e7eb" opacity="0.45" />
              </g>
            )
          })}

          {/* Top cap and antenna panels */}
          <rect x="40" y="0" width="52" height="8" rx="2" fill="#9ca3af" opacity="0.6" />
          {/* Side-mounted panels */}
          <rect x="16" y="60" width="18" height="36" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeOpacity="0.6" />
          <rect x="104" y="110" width="18" height="36" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeOpacity="0.6" />
          {/* Top-mounted small panel */}
          <rect x="54" y="18" width="12" height="24" rx="1.5" fill="#cbd5e1" stroke="#94a3b8" strokeOpacity="0.6" />

          {/* Shimmer overlay */}
          <rect x="28" y="10" width="64" height="980" fill="url(#shimmerGrad)" opacity="0.12">
            <animate attributeName="y" from="-980" to="1000" dur="6s" repeatCount="indefinite" />
          </rect>
        </g>
      </svg>
    </div>
  )
}

export default function AntennaPlanDynamic() {
  const images = useImportAntennaImages()
  const count = images.length

  // Percentage-based vertical placement (fits fixed viewport height)
  // First image at top (0%), last at bottom (100%), others evenly spaced.
  const stepPct = useMemo(() => (count > 1 ? 100 / (count - 1) : 0), [count])

  // Estimate heights (m) from index top->bottom across a 60m range
  const estimatedHeights = useMemo(() => {
    const total = Math.max(1, count - 1)
    return images.map((img, i) => Math.round((1 - i / total) * 60))
  }, [images, count])

  // Modal state
  const [modalIdx, setModalIdx] = useState(null)
  const [zoom, setZoom] = useState(1)
  const modalBackdropRef = useRef(null)
  const minZoom = 1
  const maxZoom = 3

  const zoomIn = () => setZoom((z) => Math.min(maxZoom, +(z + 0.1).toFixed(2)))
  const zoomOut = () => setZoom((z) => Math.max(minZoom, +(z - 0.1).toFixed(2)))
  const handleWheelZoom = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.deltaY < 0) zoomIn()
    else zoomOut()
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setModalIdx(null)
      }
      if (modalIdx != null) {
        if (e.key === 'ArrowLeft') setModalIdx(i => (i != null ? Math.max(0, i - 1) : i))
        if (e.key === 'ArrowRight') setModalIdx(i => (i != null ? Math.min(count - 1, i + 1) : i))
        if (e.key === '+') zoomIn()
        if (e.key === '-') zoomOut()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [modalIdx, count])

  // Disable page scroll when modal is open
  useEffect(() => {
    const prev = document.body.style.overflow
    if (modalIdx != null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = prev }
  }, [modalIdx])

  // Panning state for zoomed image
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState(null)
  const containerRef = useRef(null)

  // Reset pan when closing modal or returning to base zoom
  useEffect(() => {
    if (modalIdx == null || zoom <= 1) {
      setPosition({ x: 0, y: 0 })
      setIsDragging(false)
    }
  }, [modalIdx, zoom])

  const handleMouseDown = (e) => {
    if (zoom <= 1) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e) => {
    if (!isDragging || zoom <= 1) return
    e.preventDefault()
    e.stopPropagation()
    if (!dragStart) return
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    const maxOffset = Math.max(100, 300 * (zoom - 1))
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max)
    setPosition({ x: clamp(newX, -maxOffset, maxOffset), y: clamp(newY, -maxOffset, maxOffset) })
  }

  const handleMouseUp = (e) => {
    if (!isDragging) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  // Decorative crossbars: 10 segments top->bottom
  const bars = Array.from({ length: 10 }, (_, i) => i)

  return (
    <div className="w-full">
      <div className="text-sm text-gray-600 mb-2">Plan d'antenne dynamique</div>
      <div className="relative w-full h-[80vh] flex justify-center items-center overflow-visible">
        <div className="relative h-full w-full flex flex-col items-center">
            {/* Background sky gradient (subtle) */}
            <div className="absolute inset-0 pointer-events-none">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <defs>
                  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="100" height="100" fill="url(#skyGrad)" />
              </svg>
            </div>

            {/* SVG Tower */}
            <TowerSvg />

            {/* Height labels every 10m along the left side */}
            <div className="absolute inset-y-0 left-3 sm:left-6 pointer-events-none select-none">
              {Array.from({ length: 7 }).map((_, i) => {
                const h = i * 10
                const t = 100 - (h / 60) * 100
                return (
                  <div key={`tick-${h}`} className="absolute flex items-center gap-2 text-[10px] text-gray-500" style={{ top: `calc(${t}% - 8px)` }}>
                    <div className="h-px w-4 bg-gray-300/70" />
                    <div className="whitespace-nowrap">{h} m</div>
                  </div>
                )
              })}
              <div className="absolute top-2 text-[10px] text-gray-500">Sommet</div>
              <div className="absolute bottom-2 text-[10px] text-gray-500">Base</div>
            </div>
            {/* Markers (zig-zag sides) */}
            {images.map((img, i) => {
              const topPct = count > 1 ? i * stepPct : 50
              const h = estimatedHeights[i]
              const rightSide = i % 2 === 0
              const sidePos = rightSide ? 'left-1/2' : 'right-1/2'
              const sideShift = rightSide ? 'translate-x-12' : '-translate-x-12'
              const tipSide = rightSide ? 'left-10' : 'right-10'
              return (
                <div key={img.id} className={`absolute group ${sidePos} -translate-y-1/2 ${sideShift} transition z-[1] group-hover:z-50`} style={{ top: `${topPct}%` }}>
                  {/* Connector line to tower */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-px bg-blue-500/40"
                    style={rightSide ? { left: '-3rem', width: '3rem' } : { right: '-3rem', width: '3rem' }}
                  />
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-300 ring-offset-1 group-hover:shadow-[0_0_0_6px_rgba(59,130,246,0.15)]"
                    onClick={() => { setModalIdx(i); setZoom(1) }}
                    aria-label={`Ouvrir l'image ${img.name}`}
                  >
                    <DroneIcon size={16} />
                  </button>
                  {/* Tooltip (fade-in on hover, aligned beside icon) */}
                  <div className={`pointer-events-none absolute ${tipSide} top-1/2 -translate-y-1/2 z-40 transition-opacity duration-300 opacity-0 group-hover:opacity-100`}>
                    <div className="bg-white shadow-xl rounded-lg p-2 w-56 border border-gray-200 transition-all duration-300">
                      <img src={img.url} alt="" loading="lazy" decoding="async" className="w-full h-32 object-cover rounded-md" />
                      <p className="text-xs text-gray-600 mt-1 text-center">Hauteur estimée: {h} m</p>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Modal viewer */}
      {modalIdx != null && (
        <div
          ref={modalBackdropRef}
          className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === modalBackdropRef.current) setModalIdx(null)
          }}
        >
          {/* Navigation arrows */}
          <div className="absolute inset-y-0 left-4 flex items-center" onClick={(e) => e.stopPropagation()}>
            <button
              className="bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow disabled:opacity-50"
              onClick={() => setModalIdx(i => Math.max(0, (i ?? 0) - 1))}
              disabled={modalIdx <= 0}
              aria-label="Précédent"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
          <div className="absolute inset-y-0 right-4 flex items-center" onClick={(e) => e.stopPropagation()}>
            <button
              className="bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow disabled:opacity-50"
              onClick={() => setModalIdx(i => Math.min(count - 1, (i ?? 0) + 1))}
              disabled={modalIdx >= count - 1}
              aria-label="Suivant"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          {/* Close button */}
          <button className="absolute top-4 right-4 bg-white text-gray-700 rounded-full p-2 shadow" onClick={() => setModalIdx(null)} aria-label="Fermer">
            <X size={18} />
          </button>
          {/* Centered image + independent controls layer */}
          <div className="relative max-w-[95vw] max-h-[90vh] w-full sm:w-auto flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <div
              ref={containerRef}
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              onWheel={handleWheelZoom}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <img
                src={images[modalIdx]?.url}
                alt={images[modalIdx]?.name}
                draggable={false}
                decoding="async"
                className="max-w-none select-none"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  maxHeight: '75vh',
                }}
              />
              {/* Controls Layer */}
              <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 bg-black/70 p-2 rounded-xl shadow-lg text-white">
                <button className="text-xl hover:scale-110 transition" onClick={zoomIn} aria-label="Zoom +"><ZoomIn size={18} /></button>
                <button className="text-xl hover:scale-110 transition" onClick={zoomOut} aria-label="Zoom -"><ZoomOut size={18} /></button>
                <div className="text-xs text-center opacity-90">{Math.round(zoom * 100)}%</div>
              </div>
            </div>
            <div className="mt-3 text-sm text-white text-center">
              <div className="truncate max-w-[80vw]">{images[modalIdx]?.name}</div>
              <div>Hauteur: {estimatedHeights[modalIdx]} m</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Small fade-in animation via Tailwind utility
// Add this to your global CSS if needed:
// .animate-fade-in { animation: fade-in 120ms ease-out; }
// @keyframes fade-in { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: none; } }


