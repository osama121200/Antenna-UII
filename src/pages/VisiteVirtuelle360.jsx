import { useEffect, useMemo, useRef, useState } from 'react'
import 'pannellum/build/pannellum.css'
import { motion, AnimatePresence } from 'framer-motion'
import Page from '../components/motion/Page'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'

export default function VisiteVirtuelle360() {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)
  const [addMode, setAddMode] = useState(false)
  const [annotations, setAnnotations] = useState([])
  const [loading, setLoading] = useState(true)

  const defaultView = useMemo(() => ({ yaw: 0, pitch: 2, hfov: 100 }), [])
  const [view] = useState(defaultView)

  const imageUrl = 'https://pannellum.org/images/alma.jpg' // placeholder 360° panorama

  useEffect(() => {
    let disposed = false
    async function init() {
      if (!containerRef.current) return
      setLoading(true)
      try {
        await import('pannellum')
      } catch {}
      const pannellum = window.pannellum
      if (!pannellum || disposed) return
      const v = pannellum.viewer(containerRef.current, {
        type: 'equirectangular',
        panorama: imageUrl,
        autoLoad: true,
        yaw: view.yaw,
        pitch: view.pitch,
        hfov: view.hfov,
        showZoomCtrl: true,
        keyboardZoom: true,
        compass: true,
        mouseZoom: true,
      })
      viewerRef.current = v
      setTimeout(() => { if (!disposed) setLoading(false) }, 600)
    }
    init()
    return () => {
      disposed = true
      const v = viewerRef.current
      if (!v) return
      try {
        v?.removeHotSpot && annotations.forEach(a => v.removeHotSpot?.(a.id))
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef])

  function handleReset() {
    const v = viewerRef.current
    if (v) {
      v.setYaw(defaultView.yaw)
      v.setPitch(defaultView.pitch)
      v.setHfov(defaultView.hfov)
    }
  }

  function handleViewerClick(e) {
    if (!addMode) return
    const v = viewerRef.current
    if (!v) return
    // Convert mouse event to panorama coords (pitch, yaw)
    const coords = v.mouseEventToCoords?.(e.nativeEvent)
    if (!coords) return
    const [pitch, yaw] = coords
    const text = window.prompt('Ajouter un commentaire pour ce point:')
    if (text && text.trim()) {
      const annotation = { id: `hs-${Date.now()}`, yaw, pitch, text: text.trim(), ts: new Date().toISOString() }
      setAnnotations(prev => [...prev, annotation])
      // add hotspot to viewer
      try {
        v.addHotSpot({ id: annotation.id, pitch: annotation.pitch, yaw: annotation.yaw, type: 'info', text: annotation.text })
      } catch {}
    }
  }

  return (
    <Page>
      <div className="container-page space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">Visite Virtuelle 360°</div>
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-2 border rounded ${addMode ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
              onClick={() => setAddMode(m => !m)}
            >
              {addMode ? 'Mode ajout: actif' : 'Mode ajout de marqueur'}
            </button>
            <button className="px-3 py-2 bg-primary text-white rounded" onClick={handleReset}>
              Réinitialiser la vue
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
          <Card>
            <div className="relative">
              <div
                ref={containerRef}
                className="w-full h-[70vh] md:h-[80vh] min-h-[360px] rounded-lg overflow-hidden border shadow-card"
                onClick={handleViewerClick}
              />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                  <Spinner label="Chargement de la scène…" />
                </div>
              )}

              <AnimatePresence>
                {addMode && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-2 rounded border text-sm text-gray-700"
                  >
                    Cliquez dans la scène pour déposer un marqueur
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Basic visible controls for accessibility */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur rounded border p-2">
                <button
                  className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
                  onClick={() => {
                    const v = viewerRef.current
                    if (!v) return
                    const next = Math.min(120, (v.getHfov?.() ?? 100) + 10)
                    v.setHfov?.(next)
                  }}
                >
                  -
                </button>
                <button
                  className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
                  onClick={() => {
                    const v = viewerRef.current
                    if (!v) return
                    const next = Math.max(40, (v.getHfov?.() ?? 100) - 10)
                    v.setHfov?.(next)
                  }}
                >
                  +
                </button>
                <button className="px-2 py-1 text-sm border rounded hover:bg-gray-50" onClick={handleReset}>
                  Réinitialiser
                </button>
              </div>
            </div>
          </Card>

          <Card title={`Annotations (${annotations.length})`}>
            <div className="space-y-3 max-h-[70vh] md:max-h-[80vh] overflow-y-auto">
              <AnimatePresence initial={false}>
                {annotations.map((a) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="border rounded p-3 text-sm"
                  >
                    <div className="font-medium mb-1">{a.text}</div>
                    <div className="text-xs text-gray-600">Yaw: {a.yaw.toFixed(1)} · Pitch: {a.pitch.toFixed(1)}</div>
                    <div className="text-xs text-gray-600">{new Date(a.ts).toLocaleString('fr-FR')}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {annotations.length === 0 && (
                <div className="text-sm text-gray-600">Aucune annotation — activez le mode ajout pour créer des marqueurs.</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  )
}
