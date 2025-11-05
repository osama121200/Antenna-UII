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
  // Load all images from antenna_parts directory
  const imgs = useMemo(() => {
    const modules = import.meta.glob('../../assets/images/antenna_parts/*.{jpg,JPG,jpeg,png,webp}', { eager: true, as: 'url' })
    const entries = Object.entries(modules).map(([path, url]) => {
      const base = path.replace(/\\/g, '/').split('/').pop() || path
      const name = base.replace(/\.[^.]+$/, '')
      const idx = Number(name.replace(/[^0-9]/g, '')) || 0
      return { id: base, url, name: base, index: idx }
    })
    // Sort by numeric filename (1.jpg, 2.jpg, ...)
    entries.sort((a, b) => a.index - b.index)
    return entries
  }, [])
  return imgs
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
            {/* Main tower line */}
            <div className="absolute w-[6px] bg-gradient-to-b from-gray-400 to-gray-600 h-full rounded-full" />
            {/* Subtle crossbars */}
            {bars.map((i) => (
              <div
                key={i}
                className="absolute w-16 h-[2px] bg-gray-300"
                style={{ top: `${i * 10}%`, transform: i % 2 === 0 ? 'rotate(15deg)' : 'rotate(-15deg)' }}
              />
            ))}
            {/* Markers (zig-zag sides) */}
            {images.map((img, i) => {
              const topPct = count > 1 ? i * stepPct : 50
              const h = estimatedHeights[i]
              const rightSide = i % 2 === 0
              const sidePos = rightSide ? 'left-1/2' : 'right-1/2'
              const sideShift = rightSide ? 'translate-x-8' : '-translate-x-8'
              const tipSide = rightSide ? 'left-10' : 'right-10'
              return (
                <div key={img.id} className={`absolute group ${sidePos} -translate-y-1/2 ${sideShift} transition z-[1] group-hover:z-50`} style={{ top: `${topPct}%` }}>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    onClick={() => { setModalIdx(i); setZoom(1) }}
                    aria-label={`Ouvrir l'image ${img.name}`}
                  >
                    <DroneIcon size={16} />
                  </button>
                  {/* Tooltip (fade-in on hover, aligned beside icon) */}
                  <div className={`pointer-events-none absolute ${tipSide} top-1/2 -translate-y-1/2 z-40 transition-opacity duration-300 opacity-0 group-hover:opacity-100`}>
                    <div className="bg-white shadow-xl rounded-lg p-2 w-48 border border-gray-200 transition-all duration-300">
                      <img src={img.url} alt="" className="w-full h-28 object-cover rounded-md" />
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


